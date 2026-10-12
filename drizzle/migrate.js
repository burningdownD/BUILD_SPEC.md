const { Client } = require('pg')

async function applyMigrations() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL nicht gesetzt. Migration übersprungen.')
    return
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
      CREATE TABLE IF NOT EXISTS players (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS courses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('18-hole', 'short/par3')),
        par INTEGER NOT NULL CHECK (par > 0),
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      CREATE TABLE IF NOT EXISTS rounds (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        player_id UUID NOT NULL REFERENCES players(id),
        course_id UUID NOT NULL REFERENCES courses(id),
        gross_strokes INTEGER NOT NULL CHECK (gross_strokes > 0),
        played_at DATE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `)
    console.log('Migrations erfolgreich ausgeführt.')
  } finally {
    await client.end()
  }
}

applyMigrations().catch((error) => {
  console.error('Fehler bei der Migration:', error)
  process.exit(1)
})
