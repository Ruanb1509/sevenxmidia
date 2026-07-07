# SevenX Media — Guia do pipeline de impressões

Ciclo completo, já funcionando de ponta a ponta:

```
login → overview → gerar credenciais → instalar snippet no site
      → sxm.js chama /collect/decide → servidor escolhe a rede e grava a impressão
      → scriptStatus vira 'active' → overview devolve 'ready' com dados reais
```

## Arquivos do pipeline

| Arquivo | Papel |
|---|---|
| `config/networks.js` | O "cérebro": redes, pesos por tier de país, RPM estimado e as tags. Roda só no servidor. |
| `models/impression.js` | Tabela `Impression` — um registro por decisão do script. |
| `routes/collect.js` | `GET /collect/decide?site=...` — público (CORS aberto), com rate limit. Seleciona a rede, grava a impressão e devolve a tag. |
| `public/sxm.js` | Script do publisher, servido em `GET /sxm.js`. Só pergunta ao servidor e injeta a tag recebida. |
| `routes/dashboard.js` | `buildStats()` agrega as impressões (30d + deltas vs 30d anteriores, gráfico de 14 dias, breakdown por rede e país). |

## O que VOCÊ precisa configurar

### 1. Tags reais das ad networks
Em `config/networks.js`, substitua os placeholders pelas tags reais que cada
rede te fornece (dentro das crases):

```js
tag: `<script async src="https://exemplo-rede.com/tag.js" data-zone="123"></script>`,
```

Ajuste também `estRpmMicros` (RPM estimado; $1.80 = `1_800_000`) e os
`weights` por tier. Peso 0 = rede nunca escolhida naquele tier.

### 2. Criar a tabela em produção
Em desenvolvimento o `sequelize.sync()` cria sozinho. Em produção, rode uma vez:

```sql
CREATE TABLE IF NOT EXISTS "Impression" (
  id SERIAL PRIMARY KEY,
  "siteId" VARCHAR(255) NOT NULL,
  network VARCHAR(255) NOT NULL,
  country VARCHAR(2),
  tier VARCHAR(255),
  "revenueMicros" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS impression_site_id ON "Impression" ("siteId");
CREATE INDEX IF NOT EXISTS impression_site_created ON "Impression" ("siteId", "createdAt");

CREATE TABLE IF NOT EXISTS "SiteNetwork" (
  id SERIAL PRIMARY KEY,
  "siteId" VARCHAR(255) NOT NULL,
  name VARCHAR(40) NOT NULL,
  tag TEXT NOT NULL,
  "formatClass" VARCHAR(255) NOT NULL DEFAULT 'display',
  "strictPolicy" BOOLEAN NOT NULL DEFAULT false,
  "estRpmMicros" INTEGER NOT NULL DEFAULT 1000000,
  weights JSONB NOT NULL DEFAULT '{"tier1":33,"tier2":33,"tier3":34}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS sitenetwork_site_id ON "SiteNetwork" ("siteId");
```

### 3. Nada mais
O snippet do dashboard já aponta para `SEU_BACKEND/sxm.js` (via
`REACT_APP_BACKEND_URL` do frontend). O país do visitante vem dos headers de
edge (`x-vercel-ip-country` na Vercel, `cf-ipcountry` na Cloudflare) — na
Vercel funciona sem configurar nada.

## Como testar localmente

1. Suba o backend (`npm start` em `BACKEND/`, com `NODE_ENV=development` para
   o sync criar a tabela) e o frontend.
2. Logue com um usuário `isVip = true`, gere as credenciais no dashboard e
   copie o `siteId`.
3. Simule o script (o `?country=` só funciona fora de produção):

```bash
curl "http://localhost:3001/collect/decide?site=SEU_SITE_ID&country=US"
```

Resposta esperada: `{"fill":true,"network":"network_a","tag":"..."}` (a rede
varia — é probabilístico). Cada chamada grava uma impressão.

4. Recarregue o dashboard: o badge muda de "Collecting data" para
   "Script active" e os KPIs/gráficos aparecem com os dados reais.

Ou teste o script de verdade: crie um HTML com o snippet copiado do
dashboard, abra no navegador e veja a chamada a `/collect/decide` na aba
Network.

## Comportamentos importantes

- **Receita é estimada**: cada impressão vale `estRpmMicros / 1000`. Quando
  integrar a API de reporting de cada rede, é só reconciliar os valores.
- **Fill rate real**: requisições em que nenhuma rede tem peso para o tier
  viram `network = 'none'` (receita 0) e só entram no cálculo de fill rate.
- **Regenerar API key não quebra o site**: o `siteId` é mantido, então o
  snippet instalado continua válido.
- **Rate limit**: 600 requisições/min por IP em `/collect` — ajuste em
  `routes/collect.js` conforme o tráfego crescer.
- **Escala**: o `buildStats()` carrega as impressões de 60 dias do siteId e
  agrega em memória — simples e correto para MVP. Acima de ~centenas de
  milhares de impressões/mês por site, migre para agregação em SQL
  (GROUP BY dia/rede/país) ou tabela de rollup diário.
