const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

/**
 * Rotas PÚBLICAS do script do publisher — registradas ANTES do CORS
 * restrito, pois rodam em sites de terceiros (qualquer origem).
 */
const collectRouter = require('./routes/collect');
app.use('/collect', collectRouter);

app.get('/sxm.js', (req, res) => {
  res.type('application/javascript');
  res.set('Cache-Control', 'public, max-age=300');
  res.sendFile(path.join(__dirname, 'public', 'sxm.js'));
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://localhost:3000',
  credentials: true,
}));

app.use(express.json());

const webhookRouter = require('./routes/webhook');
const authRouter = require('./routes/auth');
const payRouter = require('./routes/payment');
const StripePortal = require('./routes/stripeportal');
const dashboardRouter = require('./routes/dashboard');

app.use('/webhook', webhookRouter);
app.use('/auth', authRouter);
app.use('/pay', payRouter);
app.use('/stripe-portal', StripePortal);
app.use('/dashboard', dashboardRouter);

// TEMP: diagnóstico de conexão com o banco. REMOVER depois de resolver.
app.get('/__dbcheck', async (req, res) => {
  const db = require('./models');
  const cfg = db.sequelize.config;
  try {
    await db.sequelize.authenticate();
    res.json({ ok: true, host: cfg.host, port: cfg.port, database: cfg.database });
  } catch (err) {
    res.status(500).json({
      ok: false,
      host: cfg.host,
      port: cfg.port,
      code: err.parent && err.parent.code,
      message: err.message,
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      vercel: !!process.env.VERCEL,
      nodeEnv: process.env.NODE_ENV || null,
    });
  }
});

// PostgreSQL (via Pool)
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

app.set('trust proxy', true); //
pool.connect((err, client, done) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados');
  done();
});

// Sequelize
const db = require('./models');
async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Conectado ao banco');
    console.log('NODE_ENV:', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  await db.sequelize.sync();
  console.log('Tabelas sincronizadas (sem recriar)');
}

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
  }
}

/**
 * Na Vercel (serverless) o app é exportado como handler — não há
 * app.listen; cada request sobe/reusa uma function. Localmente,
 * sobe o servidor HTTP normal.
 */
if (process.env.VERCEL) {
  module.exports = app;
} else {
  startServer();
}
