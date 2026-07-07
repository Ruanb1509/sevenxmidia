const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { Op } = require('sequelize');
const { User, Impression, SiteNetwork } = require('../models');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

/**
 * Janela de provisionamento: depois de gerar as credenciais, o script
 * pode levar até este tempo para começar a reportar dados.
 */
const PROVISIONING_HOURS = 48;

/** Gera credenciais únicas do publisher */
function generateCredentials() {
    return {
        siteId: `sxm_pub_${crypto.randomBytes(6).toString('hex')}`,
        apiKey: `sxm_live_${crypto.randomBytes(24).toString('hex')}`,
    };
}

/** Mascara a apiKey para exibição (mostra só início e fim) */
function maskKey(key) {
    if (!key) return null;
    return `${key.slice(0, 12)}••••••••${key.slice(-4)}`;
}

/**
 * FONTE DE DADOS REAL — agrega as impressões do siteId no formato que
 * o frontend espera. Janela atual = últimos 30 dias; deltas comparam
 * com os 30 dias anteriores. Valores monetários em dólares.
 *
 * network = 'none' são requisições sem fill: entram só no fill rate,
 * ficam fora de receita/impressões/breakdowns.
 */
async function buildStats(siteId) {
    const DAY = 864e5;
    const now = Date.now();
    const since60 = new Date(now - 60 * DAY);
    const since30 = new Date(now - 30 * DAY);

    const rows = await Impression.findAll({
        where: { siteId, createdAt: { [Op.gte]: since60 } },
        attributes: ['network', 'country', 'revenueMicros', 'createdAt'],
        raw: true,
    });

    const cur = [];
    const prev = [];
    for (const r of rows) (new Date(r.createdAt) >= since30 ? cur : prev).push(r);

    const filled = rs => rs.filter(r => r.network !== 'none');
    const sumRev = rs => rs.reduce((s, r) => s + Number(r.revenueMicros || 0), 0) / 1e6;
    const pct = (c, p) => (p > 0 ? ((c - p) / p) * 100 : 0);

    const curFilled = filled(cur);
    const prevFilled = filled(prev);

    const revenue30d = sumRev(curFilled);
    const revenuePrev = sumRev(prevFilled);
    const impressions30d = curFilled.length;
    const imprPrev = prevFilled.length;

    const rpm = impressions30d > 0 ? (revenue30d / impressions30d) * 1000 : 0;
    const rpmPrev = imprPrev > 0 ? (revenuePrev / imprPrev) * 1000 : 0;

    const fillRate = cur.length > 0 ? (curFilled.length / cur.length) * 100 : 0;
    const fillPrev = prev.length > 0 ? (prevFilled.length / prev.length) * 100 : 0;

    // Últimos 14 dias, um valor (USD) por dia — formato do gráfico
    const dailyRevenue = [];
    for (let i = 13; i >= 0; i--) {
        const start = now - (i + 1) * DAY;
        const end = now - i * DAY;
        let micros = 0;
        for (const r of curFilled) {
            const t = new Date(r.createdAt).getTime();
            if (t >= start && t < end) micros += Number(r.revenueMicros || 0);
        }
        dailyRevenue.push(Number((micros / 1e6).toFixed(2)));
    }

    // Breakdown por rede: share de impressões + RPM da rede
    const byNet = {};
    for (const r of curFilled) {
        byNet[r.network] = byNet[r.network] || { imp: 0, micros: 0 };
        byNet[r.network].imp += 1;
        byNet[r.network].micros += Number(r.revenueMicros || 0);
    }
    const networks = Object.entries(byNet)
        .map(([name, v]) => ({
            name,
            share: Math.round((v.imp / impressions30d) * 100),
            rpm: Number(((v.micros / 1e6 / v.imp) * 1000).toFixed(2)),
        }))
        .sort((a, b) => b.share - a.share);

    // Breakdown por país (top 5 por impressões)
    const byGeo = {};
    for (const r of curFilled) {
        const c = r.country || 'Other';
        byGeo[c] = (byGeo[c] || 0) + 1;
    }
    const geo = Object.entries(byGeo)
        .map(([country, imp]) => ({
            country,
            share: Math.round((imp / impressions30d) * 100),
        }))
        .sort((a, b) => b.share - a.share)
        .slice(0, 5);

    return {
        revenue30d: Number(revenue30d.toFixed(2)),
        revenueDelta: Number(pct(revenue30d, revenuePrev).toFixed(1)),
        impressions30d,
        impressionsDelta: Number(pct(impressions30d, imprPrev).toFixed(1)),
        rpm: Number(rpm.toFixed(2)),
        rpmDelta: Number(pct(rpm, rpmPrev).toFixed(1)),
        fillRate: Number(fillRate.toFixed(1)),
        fillRateDelta: Number((fillRate - fillPrev).toFixed(1)),
        dailyRevenue,
        networks,
        geo,
    };
}

/**
 * @route GET /dashboard/overview
 * @desc  Dados do dashboard do usuário logado
 * @access Private (JWT)
 *
 * Estados possíveis em `dataStatus`:
 *  - 'no_credentials' : usuário ainda não gerou siteId/apiKey
 *  - 'provisioning'   : credenciais geradas, aguardando primeiros dados
 *  - 'ready'          : dados disponíveis
 */
router.get('/overview', authMiddleware, async (req, res) => {
    try {
        const user = await User.scope('withApiKey').findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.isVip) {
            return res.status(403).json({
                error: 'subscription_required',
                message: 'An active plan is required to access the dashboard.',
            });
        }

        // Sem credenciais ainda
        if (!user.siteId || !user.apiKey) {
            return res.json({
                dataStatus: 'no_credentials',
                plan: {
                    active: true,
                    renewsAt: user.vipExpirationDate,
                },
                credentials: null,
                stats: null,
            });
        }

        // Janela de provisionamento após gerar credenciais
        const generatedAt = user.apiKeyGeneratedAt || new Date();
        const hoursSince = (Date.now() - new Date(generatedAt).getTime()) / 36e5;
        const provisioning =
            user.scriptStatus !== 'active' && hoursSince < PROVISIONING_HOURS;

        // Métricas reais agregadas das impressões coletadas pelo sxm.js
        const stats = await buildStats(user.siteId);
        const hasData = stats.impressions30d > 0;

        return res.json({
            dataStatus: hasData ? 'ready' : 'provisioning',
            provisioningWindowHours: PROVISIONING_HOURS,
            scriptStatus: user.scriptStatus, // 'pending' | 'active'
            plan: {
                active: true,
                renewsAt: user.vipExpirationDate,
            },
            credentials: {
                siteId: user.siteId,
                apiKeyMasked: maskKey(user.apiKey),
                generatedAt: user.apiKeyGeneratedAt,
            },
            stats: hasData ? stats : null,
        });
    } catch (err) {
        console.error('Dashboard overview error:', err);
        return res.status(500).json({ error: 'Failed to load dashboard' });
    }
});

/**
 * @route POST /dashboard/credentials
 * @desc  Gera (ou regenera) siteId + apiKey do usuário logado.
 *        A apiKey completa só é retornada NESTA resposta — depois,
 *        apenas a versão mascarada aparece no overview.
 * @access Private (JWT, assinante)
 */
router.post('/credentials', authMiddleware, async (req, res) => {
    try {
        const user = await User.scope('withApiKey').findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.isVip) {
            return res.status(403).json({
                error: 'subscription_required',
                message: 'An active plan is required to generate API access.',
            });
        }

        const { siteId, apiKey } = generateCredentials();

        // Mantém o siteId se já existir (regenerar a key não muda o site)
        const finalSiteId = user.siteId || siteId;

        await user.update({
            siteId: finalSiteId,
            apiKey,
            apiKeyGeneratedAt: new Date(),
            scriptStatus: 'pending',
        });

        return res.status(201).json({
            message: `API access generated. It can take up to ${PROVISIONING_HOURS}h for data to start appearing.`,
            credentials: {
                siteId: finalSiteId,
                apiKey, // única vez que a key completa é exposta
                generatedAt: new Date(),
            },
        });
    } catch (err) {
        console.error('Generate credentials error:', err);
        return res.status(500).json({ error: 'Failed to generate credentials' });
    }
});

/* =====================================================================
 * AD NETWORKS DO PUBLISHER
 * O publisher cola as tags das PRÓPRIAS contas; o script decide qual
 * delas serve cada impressão. Limite atual: 3 redes por site.
 * ===================================================================== */

const FORMAT_CLASSES = ['display', 'native', 'push', 'pop'];
// TODO: quando houver distinção de plano no banco, aplicar 2 (monthly/yearly) vs 3 (lifetime)
const MAX_NETWORKS = 3;

/**
 * @route GET /dashboard/networks
 * @desc  Lista as redes configuradas para o site do usuário
 */
router.get('/networks', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!user.isVip) return res.status(403).json({ error: 'subscription_required' });
        if (!user.siteId) return res.json({ networks: [] });

        const rows = await SiteNetwork.findAll({
            where: { siteId: user.siteId },
            order: [['createdAt', 'ASC']],
        });
        return res.json({
            networks: rows.map(n => ({
                id: n.id,
                name: n.name,
                formatClass: n.formatClass,
                strictPolicy: n.strictPolicy,
                estRpm: n.estRpmMicros / 1e6,
                enabled: n.enabled,
                tagPreview: n.tag.length > 80 ? `${n.tag.slice(0, 80)}…` : n.tag,
            })),
            maxNetworks: MAX_NETWORKS,
        });
    } catch (err) {
        console.error('List networks error:', err);
        return res.status(500).json({ error: 'Failed to list networks' });
    }
});

/**
 * @route POST /dashboard/networks
 * @desc  Adiciona uma rede (tag do próprio publisher) ao site do usuário
 */
router.post('/networks', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!user.isVip) return res.status(403).json({ error: 'subscription_required' });
        if (!user.siteId) {
            return res.status(400).json({ error: 'Generate your API access first.' });
        }

        const name = String(req.body.name || '').trim();
        const tag = String(req.body.tag || '').trim();
        const formatClass = String(req.body.formatClass || 'display');
        const strictPolicy = Boolean(req.body.strictPolicy);
        const estRpm = Number(req.body.estRpm);

        if (name.length < 2 || name.length > 40) {
            return res.status(400).json({ error: 'Name must be 2-40 characters.' });
        }
        if (tag.length < 10 || tag.length > 8000) {
            return res.status(400).json({ error: 'Tag looks invalid (10-8000 characters).' });
        }
        if (!FORMAT_CLASSES.includes(formatClass)) {
            return res.status(400).json({ error: 'Invalid format class.' });
        }

        const count = await SiteNetwork.count({ where: { siteId: user.siteId } });
        if (count >= MAX_NETWORKS) {
            return res.status(400).json({ error: `Your plan allows up to ${MAX_NETWORKS} networks.` });
        }

        const row = await SiteNetwork.create({
            siteId: user.siteId,
            name,
            tag,
            formatClass,
            strictPolicy,
            estRpmMicros: Number.isFinite(estRpm) && estRpm > 0 && estRpm <= 1000
                ? Math.round(estRpm * 1e6)
                : 1_000_000,
        });

        return res.status(201).json({ id: row.id, message: 'Network added.' });
    } catch (err) {
        console.error('Add network error:', err);
        return res.status(500).json({ error: 'Failed to add network' });
    }
});

/**
 * @route DELETE /dashboard/networks/:id
 * @desc  Remove uma rede do site do usuário
 */
router.delete('/networks/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!user.isVip) return res.status(403).json({ error: 'subscription_required' });

        const row = await SiteNetwork.findOne({
            where: { id: req.params.id, siteId: user.siteId || null },
        });
        if (!row) return res.status(404).json({ error: 'Network not found' });

        await row.destroy();
        return res.json({ message: 'Network removed.' });
    } catch (err) {
        console.error('Delete network error:', err);
        return res.status(500).json({ error: 'Failed to remove network' });
    }
});

module.exports = router;
