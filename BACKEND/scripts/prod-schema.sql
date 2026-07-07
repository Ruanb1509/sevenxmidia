-- =====================================================================
-- SevenX Media — schema de PRODUÇÃO (rodar uma vez no Postgres de prod,
-- ex.: SQL Editor do Neon/Supabase). Em produção o sync() não roda.
-- =====================================================================

CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  "isVip" BOOLEAN NOT NULL DEFAULT false,
  "isAdmin" BOOLEAN NOT NULL DEFAULT false,
  "resetPasswordToken" VARCHAR(255),
  "resetPasswordExpires" TIMESTAMPTZ,
  "vipExpirationDate" TIMESTAMPTZ,
  "lastLogin" TIMESTAMPTZ,
  "recentlyViewed" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
  "stripeSubscriptionId" VARCHAR(255),
  "isDisabled" BOOLEAN NOT NULL DEFAULT false,
  "isSubscriptionCanceled" BOOLEAN NOT NULL DEFAULT false,
  "googleId" VARCHAR(255) UNIQUE,
  "siteId" VARCHAR(255) UNIQUE,
  "apiKey" VARCHAR(255),
  "apiKeyGeneratedAt" TIMESTAMPTZ,
  "scriptStatus" VARCHAR(255) NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Impression" (
  id SERIAL PRIMARY KEY,
  "siteId" VARCHAR(255) NOT NULL,
  network VARCHAR(255) NOT NULL,
  country VARCHAR(2),
  tier VARCHAR(255),
  "revenueMicros" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
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
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sitenetwork_site_id ON "SiteNetwork" ("siteId");
