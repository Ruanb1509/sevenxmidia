/**
 * VERSÃO SEGURA - webhook.js
 * CORREÇÃO: Adicionado transações atômicas para evitar TOCTTOU
 * CORREÇÃO: Adicionado idempotência para evitar processamento duplicado
 */
const express = require('express');
const router = express.Router();
// Stripe é opcional: sem chave, o app sobe normalmente e só esta rota fica inativa.
const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;
const { User, sequelize } = require('../models');

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('⚠️ Webhook verification error:', err.message);
      logToFile('security', {
        action: 'WEBHOOK_SIGNATURE_FAILED',
        error: err.message,
        ip: req.ip
      });
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Log do evento recebido
    logToFile('audit', {
      action: 'WEBHOOK_RECEIVED',
      eventType: event.type,
      eventId: event.id
    });

    // Função utilitária segura para pegar data de expiração
    const getSafeExpirationDate = (source) => {
      if (!source) return null;
      const ms = source * 1000;
      const date = new Date(ms);
      if (isNaN(date.getTime())) {
        console.error("❌ Invalid data generated from:", source);
        return null;
      }
      return date;
    };

    switch (event.type) {

      /* ============================
         CHECKOUT.SESSION.COMPLETED
      ============================ */
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerEmail = session.customer_email;
        const subscriptionId = session.subscription;

        if (!customerEmail || !subscriptionId) {
          return res.status(400).send('Dados incompletos');
        }

        // CORREÇÃO: Usar transação atômica
        const t = await sequelize.transaction();

        try {
          // Lock para evitar race condition
          const user = await User.findOne({ 
            where: { email: customerEmail },
            lock: t.LOCK.UPDATE,
            transaction: t
          });

          if (!user) {
            await t.rollback();
            return res.status(404).send('Usuário não encontrado');
          }

          // IDEMPOTÊNCIA: Verificar se já foi processado
          if (user.stripeSubscriptionId === subscriptionId) {
            await t.rollback();
            console.log(`⚠️ Webhook já processado para: ${customerEmail}`);
            return res.status(200).send({ received: true, message: 'Already processed' });
          }

          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          let expirationDate = null;

          if (subscription.current_period_end) {
            expirationDate = getSafeExpirationDate(subscription.current_period_end);
          }

          if (!expirationDate && session.invoice) {
            const invoice = await stripe.invoices.retrieve(session.invoice);
            if (invoice.lines?.data?.[0]?.period?.end) {
              expirationDate = getSafeExpirationDate(invoice.lines.data[0].period.end);
            }
          }

          if (!expirationDate) {
            await t.rollback();
            console.error("❌ Could not get expirationDate from Stripe", { subscriptionId });
            return res.status(500).send("Could not calculate expiration date");
          }

          await user.update({
            isVip: true,
            vipExpirationDate: expirationDate,
            stripeSubscriptionId: subscriptionId,
          }, { transaction: t });

          await t.commit();

          console.log(`✅ VIP ativado para: ${customerEmail} até ${expirationDate}`);
          logToFile('audit', {
            action: 'VIP_ACTIVATED',
            email: customerEmail,
            subscriptionId,
            expirationDate
          });

        } catch (err) {
          await t.rollback();
          console.error('Error updating user:', err);
          return res.status(500).send('Erro ao atualizar usuário');
        }
        break;
      }

      /* ============================
               INVOICE.PAID
      ============================ */
      case 'invoice.paid': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (!subscriptionId) break;

        const t = await sequelize.transaction();

        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          const user = await User.findOne({
            where: { stripeSubscriptionId: subscriptionId },
            lock: t.LOCK.UPDATE,
            transaction: t
          });

          if (!user) {
            await t.rollback();
            console.error('User with subscription not found');
            break;
          }

          let expirationDate = null;

          if (subscription.current_period_end) {
            expirationDate = getSafeExpirationDate(subscription.current_period_end);
          }

          if (!expirationDate && invoice.lines?.data?.[0]?.period?.end) {
            expirationDate = getSafeExpirationDate(invoice.lines.data[0].period.end);
          }

          if (!expirationDate) {
            await t.rollback();
            console.error("❌ Error: could not validate expirationDate for invoice.paid");
            break;
          }

          // IDEMPOTÊNCIA: Verificar se a data já é a mesma
          if (user.vipExpirationDate && 
              new Date(user.vipExpirationDate).getTime() === expirationDate.getTime()) {
            await t.rollback();
            console.log(`⚠️ Invoice já processado para: ${user.email}`);
            break;
          }

          await user.update({
            isVip: true,
            vipExpirationDate: expirationDate,
          }, { transaction: t });

          await t.commit();

          console.log(`✅ VIP renovado até ${expirationDate} para: ${user.email}`);
          logToFile('audit', {
            action: 'VIP_RENEWED',
            email: user.email,
            subscriptionId,
            expirationDate
          });

        } catch (err) {
          await t.rollback();
          console.error('Erro ao processar invoice.paid:', err);
        }
        break;
      }

      /* ============================
         CUSTOMER.SUBSCRIPTION.DELETED
      ============================ */
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const stripeSubId = subscription.id;

        const t = await sequelize.transaction();

        try {
          const user = await User.findOne({ 
            where: { stripeSubscriptionId: stripeSubId },
            lock: t.LOCK.UPDATE,
            transaction: t
          });

          if (user) {
            await user.update({
              stripeSubscriptionId: null,
              isVip: false,
              vipExpirationDate: null,
            }, { transaction: t });

            await t.commit();

            console.log('❌ Assinatura cancelada, VIP removido do usuário:', user.email);
            logToFile('audit', {
              action: 'VIP_CANCELED',
              email: user.email,
              subscriptionId: stripeSubId
            });
          } else {
            await t.rollback();
          }
        } catch (err) {
          await t.rollback();
          console.error('Erro ao processar cancelamento:', err);
        }
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    res.status(200).send({ received: true });
  }
);

module.exports = router;
