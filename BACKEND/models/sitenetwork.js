/**
 * SiteNetwork — uma ad network configurada PELO publisher para o site dele.
 * As tags são do próprio publisher (contas dele nas redes); o script apenas
 * decide qual delas serve cada impressão.
 *
 * formatClass: 'display' | 'native' | 'push' | 'pop'
 * strictPolicy: redes com políticas rígidas de convivência (ex.: Google
 *   AdSense). Quando uma rede strict está ativa no site, formatos
 *   agressivos (push/pop) são excluídos da rotação — proteção contra
 *   violação das políticas da rede estrita.
 */
module.exports = (sequelize, DataTypes) => {
    const SiteNetwork = sequelize.define('SiteNetwork', {
        siteId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
        tag: {
            type: DataTypes.TEXT,        // snippet HTML/JS fornecido pela rede ao publisher
            allowNull: false,
        },
        formatClass: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'display',
        },
        strictPolicy: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        // RPM estimado em micros (1 USD = 1_000_000) — usado só para as
        // estimativas do dashboard até integrar reporting real.
        estRpmMicros: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1_000_000,
        },
        // Pesos probabilísticos por tier de país (ajustáveis internamente)
        weights: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: { tier1: 33, tier2: 33, tier3: 34 },
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        indexes: [
            { fields: ['siteId'] },
        ],
    });

    return SiteNetwork;
};
