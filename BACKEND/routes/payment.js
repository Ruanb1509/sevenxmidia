const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Whop plan IDs
const WHOP_PLANS = {
  monthly: 'plan_onwM5nKi3rqUs',
  yearly: 'plan_fOaWp9ercfoBx',
  lifetime: 'plan_pI0m0CKux1fFU',
};

router.post('/vip-payment', async (req, res) => {
  const { planType } = req.body;

  if (!['monthly', 'annual', 'lifetime'].includes(planType)) {
    return res.status(400).json({ error: 'Tipo de plano inválido.' });
  }

  try {
    const prices = {
      monthly: process.env.STRIPE_PRICEID_MONTHLY,
      annual: process.env.STRIPE_PRICEID_ANNUAL,
      lifetime: process.env.STRIPE_PRICEID_LIFETIME,
    };

    if (!prices[planType]) {
      return res.status(500).json({ error: 'Price ID não configurado.' });
    }

    const isLifetime = planType === 'lifetime';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: isLifetime ? 'payment' : 'subscription',
      line_items: [
        {
          price: prices[planType],
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        planType,
        access: isLifetime ? 'lifetime' : 'recurring',
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Erro ao criar sessão de checkout' });
  }
});

// Whop checkout endpoint
router.post('/whop-payment', async (req, res) => {
  const { planType } = req.body;

  if (!['monthly', 'yearly', 'lifetime'].includes(planType)) {
    return res.status(400).json({ error: 'Tipo de plano inválido para Whop.' });
  }

  try {
    const whopPlanId = WHOP_PLANS[planType];
    
    if (!whopPlanId) {
      return res.status(500).json({ error: 'Plano Whop não configurado.' });
    }

    const whopCheckoutUrl = `https://whop.com/checkout/${whopPlanId}`;
    
    res.json({ url: whopCheckoutUrl });
  } catch (error) {
    console.error('Whop checkout error:', error);
    res.status(500).json({ error: 'Erro ao criar sessão de checkout do Whop' });
  }
});

module.exports = router;
