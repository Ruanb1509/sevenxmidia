/**
 * =====================================================================
 * ROTA PÚBLICA DE DECISÃO / COLETA
 * =====================================================================
 * Chamada pelo sxm.js rodando no site do publisher (qualquer origem).
 *
 * GET /collect/decide?site=sxm_pub_xxx
 *   1. Valida o siteId e se o dono tem plano ativo
 *   2. Detecta o país do visitante (headers de edge/CDN)
 *   3. Roda a seleção probabilística (config/networks.js) NO SERVIDOR
 *   4. Registra a impressão (alimenta o dashboard)
 *   5. Na primeira impressão, marca scriptStatus = 'active'
 *      (o overview sai de "provisioning" automaticamente)
 *   6. Devolve só a tag escolhida — a lógica nunca vai pro browser
 * =====================================================================
 */
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { User, Impression, SiteNetwork } = require('../models');
const { selectNetworkFrom, countryTier } = require('../config/networks');

// O script roda em sites de terceiros — CORS aberto só nestas rotas
router.use(cors());

// Proteção básica contra abuso (por IP)
router.use(rateLimit({
    windowMs: 60 * 1000,
    max: 600,
    standardHeaders: true,
    legacyHeaders: false,
    validate: false,
}));

/**
 * País do visitante via headers de edge:
 *  - Vercel:      x-vercel-ip-country
 *  - Cloudflare:  cf-ipcountry
 * Sem header (ex.: dev local) => null => tier3.
 */
function detectCountry(req) {
    const raw =
        req.headers['x-vercel-ip-country'] ||
        req.headers['cf-ipcountry'] ||
        req.headers['x-country-code'] ||
        null;
    if (raw && /^[A-Za-z]{2}$/.test(raw) && raw.toUpperCase() !== 'XX') {
        return raw.toUpperCase();
    }
    return null;
}

router.get('/decide', async (req, res) => {
    try {
        const siteId = String(req.query.site || '');
        if (!/^sxm_pub_[a-f0-9]{12}$/.test(siteId)) {
            return res.status(400).json({ error: 'invalid_site' });
        }

        const user = await User.findOne({ where: { siteId } });
        if (!user || !user.isVip) {
            return res.status(403).json({ error: 'site_not_active' });
        }

        let country = detectCountry(req);
        // Override para testes locais: ?country=US (bloqueado em produção)
        if (!country && process.env.NODE_ENV !== 'production' && req.query.country) {
            const q = String(req.query.country);
            if (/^[A-Za-z]{2}$/.test(q)) country = q.toUpperCase();
        }

        const tier = countryTier(country);

        // Primeira chamada detectada => script instalado e funcionando
        if (user.scriptStatus !== 'active') {
            await user.update({ scriptStatus: 'active' });
        }

        // Redes DO PUBLISHER (tags das contas dele, configuradas no dashboard)
        const rows = await SiteNetwork.findAll({
            where: { siteId, enabled: true },
        });
        if (rows.length === 0) {
            // Sem tags configuradas: nada a servir e nada a medir
            return res.json({ fill: false, reason: 'no_networks' });
        }

        const network = selectNetworkFrom(country, rows.map(r => r.get({ plain: true })));

        await Impression.create({
            siteId,
            network: network ? network.name : 'none',
            country,
            tier,
            // receita estimada da impressão = RPM / 1000
            revenueMicros: network ? Math.round(network.estRpmMicros / 1000) : 0,
        });

        if (!network) return res.json({ fill: false });
        return res.json({ fill: true, network: network.name, tag: network.tag });
    } catch (err) {
        console.error('Collect decide error:', err);
        return res.status(500).json({ error: 'decide_failed' });
    }
});

module.exports = router;
