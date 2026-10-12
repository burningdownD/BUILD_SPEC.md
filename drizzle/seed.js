const { Client } = require('pg')

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL nicht gesetzt. Seed übersprungen.')
    return
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  try {
    const courses = [
      ['18-Loch Platz 1', '18-hole', 72],
      ['18-Loch Platz 2', '18-hole', 71],
      ['18-Loch Platz 3', '18-hole', 70],
      ['18-Loch Platz 4', '18-hole', 69],
      ['Par3 Platz 1', 'short/par3', 27],
      ['Par3 Platz 2', 'short/par3', 30],
      ['Par3 Platz 3', 'short/par3', 27],
      ['Par3 Platz 4', 'short/par3', 27],
    ]

    for (const [name, type, par] of courses) {
      const existing = await client.query('SELECT 1 FROM courses WHERE name = $1', [name])
      if (existing.rowCount === 0) {
        await client.query('INSERT INTO courses (name, type, par, active, created_at) VALUES ($1, $2, $3, true, now())', [name, type, par])
      }
    }

    console.log('Seed erfolgreich ausgeführt.')
  } finally {
    await client.end()
  }
}

seed().catch((error) => {
  console.error('Fehler beim Seed:', error)
  process.exit(1)
})
