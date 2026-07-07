/**
 * Impression — um registro por impressão servida pelo script.
 * Alimenta as métricas do dashboard (agregadas por siteId).
 *
 * network = 'none' significa requisição sem fill (nenhuma rede tinha
 * peso para o tier do visitante) — usada só no cálculo de fill rate.
 */
module.exports = (sequelize, DataTypes) => {
    const Impression = sequelize.define('Impression', {
        siteId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        network: {
            type: DataTypes.STRING,       // ex.: 'network_a' | 'none'
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(2),    // ISO-2, ex.: 'US'
            allowNull: true,
        },
        tier: {
            type: DataTypes.STRING,       // 'tier1' | 'tier2' | 'tier3'
            allowNull: true,
        },
        // Receita estimada desta impressão, em micros (1 USD = 1_000_000).
        // = estRpmMicros / 1000  (RPM é por mil impressões)
        revenueMicros: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        indexes: [
            { fields: ['siteId'] },
            { fields: ['siteId', 'createdAt'] },
        ],
    });

    return Impression;
};
