/**
 * Setup do ambiente LOCAL de teste (rodar uma vez, com o Postgres ligado):
 *
 *   node scripts/setup-local.js
 *
 * 1. Cria o banco "Sevenxmidia" se não existir
 * 2. Sincroniza as tabelas (User, Impression, ...)
 * 3. Cria/atualiza um usuário de teste VIP:
 *      email: teste@teste.com | senha: 123456
 */
require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

const DB_NAME = 'Sevenxmidia';
const ADMIN_URL = 'postgres://postgres:2025@localhost:5432/postgres';

async function ensureDatabase() {
    const client = new Client({ connectionString: ADMIN_URL });
    await client.connect();
    const exists = await client.query(
        'SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]
    );
    if (exists.rowCount === 0) {
        await client.query(`CREATE DATABASE "${DB_NAME}"`);
        console.log(`✅ Banco "${DB_NAME}" criado`);
    } else {
        console.log(`ℹ️  Banco "${DB_NAME}" já existe`);
    }
    await client.end();
}

async function main() {
    await ensureDatabase();

    // Carrega os models só depois do banco existir
    const db = require('../models');
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    console.log('✅ Tabelas sincronizadas');

    const password = await bcrypt.hash('123456', 10);
    const [user, created] = await db.User.scope('withPassword').findOrCreate({
        where: { email: 'teste@teste.com' },
        defaults: {
            name: 'Usuario Teste',
            email: 'teste@teste.com',
            password,
            isVip: true,
        },
    });
    if (!created) {
        await user.update({ isVip: true, isDisabled: false });
    }
    console.log(`✅ Usuário VIP pronto: teste@teste.com / 123456 (${created ? 'criado' : 'atualizado'})`);

    await db.sequelize.close();
    console.log('\n🎉 Ambiente pronto. Agora: npm start');
}

main().catch(err => {
    console.error('\n❌ Falhou:', err.message);
    console.error('   O PostgreSQL está rodando? Senha do usuário postgres = 2025?');
    process.exit(1);
});
