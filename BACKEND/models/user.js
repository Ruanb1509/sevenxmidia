/**
 * VERSÃO SEGURA - User Model
 * CORREÇÃO: Adicionado defaultScope para evitar exposição de dados sensíveis
 */
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isVip: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      resetPasswordToken: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: { 
        type: DataTypes.DATE,
        allowNull: true,
      },
      vipExpirationDate: { 
        type: DataTypes.DATE,
        allowNull: true, 
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      recentlyViewed: { 
        type: DataTypes.ARRAY(DataTypes.STRING), 
        allowNull: true,
        defaultValue: [], 
      },
      stripeSubscriptionId: { 
        type: DataTypes.STRING, 
        allowNull: true,
      },
      isDisabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isSubscriptionCanceled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      // --- SaaS: credenciais de integração do publisher ---
      siteId: {
        type: DataTypes.STRING,      // ID público usado no snippet do script
        allowNull: true,
        unique: true,
      },
      apiKey: {
        type: DataTypes.STRING,      // token secreto de API do publisher
        allowNull: true,
      },
      apiKeyGeneratedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      scriptStatus: {
        type: DataTypes.STRING,      // 'pending' | 'active'
        allowNull: false,
        defaultValue: 'pending',
      },
    }, {
      // SEGURANÇA: defaultScope exclui campos sensíveis por padrão
      defaultScope: {
        attributes: {
          exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires', 'apiKey']
        }
      },
      // Scope para operações que precisam da senha (login)
      scopes: {
        withPassword: {
          attributes: {} // Inclui todos os campos
        },
        withApiKey: {
          attributes: {
            exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires']
          }
        },
        withResetToken: {
          attributes: {
            exclude: ['password']
          }
        }
      }
    });
  
    return User;
  };
  