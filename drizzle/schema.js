const fs = require('fs')
const path = require('path')

const schemaFile = `export const players = {\n  id: 'uuid',\n  name: 'text',\n  active: 'boolean',\n  created_at: 'timestamp',\n}\n\nexport const courses = {\n  id: 'uuid',\n  name: 'text',\n  type: 'text',\n  par: 'integer',\n  active: 'boolean',\n  created_at: 'timestamp',\n}\n\nexport const rounds = {\n  id: 'uuid',\n  player_id: 'uuid',\n  course_id: 'uuid',\n  gross_strokes: 'integer',\n  played_at: 'date',\n  created_at: 'timestamp',\n}\n`

const migrationsDir = path.join(__dirname, 'migrations')
fs.mkdirSync(migrationsDir, { recursive: true })
const migrationPath = path.join(migrationsDir, '001_init.sql')
if (!fs.existsSync(migrationPath)) {
  fs.writeFileSync(migrationPath, `CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";\n\nCREATE TABLE IF NOT EXISTS players (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL,\n  active BOOLEAN NOT NULL DEFAULT true,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n\nCREATE TABLE IF NOT EXISTS courses (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL,\n  type TEXT NOT NULL CHECK (type IN ('18-hole', 'short/par3')),\n  par INTEGER NOT NULL CHECK (par > 0),\n  active BOOLEAN NOT NULL DEFAULT true,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n\nCREATE TABLE IF NOT EXISTS rounds (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  player_id UUID NOT NULL REFERENCES players(id),\n  course_id UUID NOT NULL REFERENCES courses(id),\n  gross_strokes INTEGER NOT NULL CHECK (gross_strokes > 0),\n  played_at DATE,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT now()\n);\n`)
}
fs.writeFileSync(path.join(__dirname, 'schema.js'), schemaFile)
console.log('Drizzle schema and initial migration created.')
