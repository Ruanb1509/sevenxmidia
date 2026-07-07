/**
 * =====================================================================
 * CONFIGURAÇÃO DAS AD NETWORKS + LÓGICA DE SELEÇÃO
 * =====================================================================
 * Este é o "cérebro" do produto. A seleção roda NO SERVIDOR — o script
 * do publisher só recebe a tag já escolhida (a lógica proprietária
 * nunca é exposta no browser).
 *
 * COMO CONFIGURAR:
 *  - tag: cole aqui o snippet HTML/JS real de cada ad network
 *    (o código que a rede te dá para colocar no site).
 *  - estRpmMicros: RPM estimado em micros de dólar (1 USD = 1_000_000).
 *    Usado para estimar receita até integrar a API de reporting de
 *    cada rede. Ex.: $1.80 RPM => 1_800_000.
 *  - weights: peso probabilístico da rede por tier de país.
 *    Peso 0 = rede nunca é escolhida para aquele tier.
 * =====================================================================
 */
const NETWORKS = [
    {
        name: 'network_a',
        estRpmMicros: 1_800_000, // $1.80 por 1000 impressões
        weights: { tier1: 60, tier2: 30, tier3: 10 },
        // COLE AQUI a tag real da rede A (dentro das crases):
        tag: `<!-- network_a tag placeholder -->`,
    },
    {
        name: 'network_b',
        estRpmMicros: 1_400_000,
        weights: { tier1: 30, tier2: 45, tier3: 30 },
        // COLE AQUI a tag real da rede B (dentro das crases):
        tag: `<!-- network_b tag placeholder -->`,
    },
    {
        name: 'network_c',
        estRpmMicros: 900_000,
        weights: { tier1: 10, tier2: 25, tier3: 60 },
        // COLE AQUI a tag real da rede C (dentro das crases):
        tag: `<!-- network_c tag placeholder -->`,
    },
];

/** Classificação de países em tiers (expanda conforme necessário) */
const TIER1 = new Set(['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'DE', 'NL', 'SE', 'NO', 'DK', 'CH', 'AT', 'FI']);
const TIER2 = new Set(['FR', 'IT', 'ES', 'PT', 'BE', 'JP', 'KR', 'SG', 'AE', 'IL', 'PL', 'CZ']);

function countryTier(countryCode) {
    if (TIER1.has(countryCode)) return 'tier1';
    if (TIER2.has(countryCode)) return 'tier2';
    return 'tier3';
}

/**
 * GUARD DE POLÍTICA: se o site tem alguma rede com strictPolicy (ex.:
 * Google AdSense), formatos agressivos (push/pop) saem da rotação —
 * misturá-los na mesma página é a causa clássica de banimento na rede
 * estrita, e a punição cai na conta do publisher.
 */
function applyPolicyGuard(networks) {
    const hasStrict = networks.some(n => n.strictPolicy);
    if (!hasStrict) return networks;
    return networks.filter(n => n.formatClass === 'display' || n.formatClass === 'native');
}

/**
 * Seleção probabilística ponderada por tier, sobre uma lista arbitrária
 * de redes (as redes DO PUBLISHER, vindas do banco).
 * Retorna a rede escolhida (ou null se nenhuma é elegível).
 */
function selectNetworkFrom(countryCode, networks) {
    const tier = countryTier(countryCode);
    const pool = applyPolicyGuard(networks.filter(n => n.enabled !== false))
        .filter(n => ((n.weights || {})[tier] || 0) > 0);
    if (pool.length === 0) return null;

    const total = pool.reduce((s, n) => s + n.weights[tier], 0);
    let r = Math.random() * total;
    for (const n of pool) {
        r -= n.weights[tier];
        if (r <= 0) return n;
    }
    return pool[pool.length - 1];
}

/** Compat: seleção sobre a lista global (demo/fallback interno) */
function selectNetwork(countryCode) {
    return selectNetworkFrom(countryCode, NETWORKS);
}

function getNetworkByName(name) {
    return NETWORKS.find(n => n.name === name) || null;
}

module.exports = {
    NETWORKS,
    selectNetwork,
    selectNetworkFrom,
    applyPolicyGuard,
    getNetworkByName,
    countryTier,
};
