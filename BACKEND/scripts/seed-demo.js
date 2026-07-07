/**
 * Semeia dados DEMO no ambiente local (para screenshots/demonstração):
 *  1. Remove impressões de debug (network_a/b/c e 'none')
 *  2. Gera ~2 semanas de impressões variadas usando as redes reais
 *     configuradas para o site (respeitando o guard de política)
 *
 *   node scripts/seed-demo.js
 */
require('dotenv').config();
const { Op } = require('sequelize');
const db = require('../models');
const { selectNetworkFrom, countryTier } = require('../config/networks');

const SITE_ID = 'sxm_pub_1a9ee8a5b72f';
const DAY = 864e5;

const COUNTRIES = [
    ['US', 28], ['GB', 8], ['DE', 7], ['CA', 6], ['AU', 4],
    ['FR', 6], ['ES', 4], ['IT', 3],
    ['BR', 14], ['IN', 12], ['ID', 5], ['MX', 3],
];

function pickCountry() {
    const total = COUNTRIES.reduce((s, [, w]) => s + w, 0);
    let r = Math.random() * total;
    for (const [c, w] of COUNTRIES) {
        r -= w;
        if (r <= 0) return c;
    }
    return 'US';
}

async function main() {
    await db.sequelize.authenticate();

    const removed = await db.Impression.destroy({
        where: {
            siteId: SITE_ID,
            network: { [Op.in]: ['network_a', 'network_b', 'network_c', 'none'] },
        },
    });
    console.log(`🧹 ${removed} impressões de debug removidas`);

    const rows = await db.SiteNetwork.findAll({ where: { siteId: SITE_ID, enabled: true } });
    if (rows.length === 0) {
        console.error('❌ Nenhuma rede configurada para o site — adicione no dashboard antes.');
        process.exit(1);
    }
    const networks = rows.map(r => r.get({ plain: true }));

    const toCreate = [];
    for (let d = 13; d >= 0; d--) {
        // leve tendência de crescimento em direção a hoje
        const count = 18 + Math.round((13 - d) * 1.5) + Math.floor(Math.random() * 8);
        for (let i = 0; i < count; i++) {
            const country = pickCountry();
            const net = selectNetworkFrom(country, networks);
            const when = new Date(Date.now() - d * DAY - Math.floor(Math.random() * DAY * 0.9));
            toCreate.push({
                siteId: SITE_ID,
                network: net ? net.name : 'none',
                country,
                tier: countryTier(country),
                revenueMicros: net ? Math.round(net.estRpmMicros / 1000) : 0,
                createdAt: when,
                updatedAt: when,
            });
        }
    }

    await db.Impression.bulkCreate(toCreate);
    console.log(`✅ ${toCreate.length} impressões demo criadas (14 dias)`);

    await db.sequelize.close();
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
