const { Pool } = require('pg')
const jwt = require('jsonwebtoken')
const { getPublicData, getDashboardData } = require('./_lib/store')

const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null

function getTokenFromEvent(event) {
  const authHeader = event.headers && (event.headers.authorization || event.headers.Authorization)
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  try {
    return jwt.verify(authHeader.replace('Bearer ', ''), process.env.SESSION_SECRET || 'demo-secret')
  } catch {
    return null
  }
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

exports.handler = async function (event) {
  const token = getTokenFromEvent(event)
  if (!token || token.role !== 'admin') {
    return response(401, { message: 'Du hast keine Berechtigung für diese Aktion.' })
  }

  try {
    const action = (event.queryStringParameters && event.queryStringParameters.action) || 'dashboard'
    const body = event.body ? JSON.parse(event.body) : {}

    if (action === 'dashboard') {
      return response(200, getDashboardData())
    }

    if (action === 'add-player') {
      const name = String(body.name || '').trim()
      if (!name) return response(400, { message: 'Bitte gib einen Namen ein.' })
      const result = getDashboardData()
      const players = result.players || []
      players.push({ id: `p${Date.now()}`, name, active: true })
      return response(200, { message: 'Spieler hinzugefügt.', players })
    }

    if (action === 'add-course') {
      const type = body.type || '18-hole'
      const par = Number(body.par)
      const name = String(body.name || '').trim()
      if (!name) return response(400, { message: 'Bitte gib einen Namen für den Platz ein.' })
      if (!Number.isInteger(par) || par <= 0) return response(400, { message: 'Bitte gib einen gültigen Par-Wert ein.' })
      const result = getDashboardData()
      const courses = result.courses || []
      courses.push({ id: `c${Date.now()}`, name, type, par, active: true })
      return response(200, { message: 'Platz hinzugefügt.', courses })
    }

    if (action === 'delete-round') {
      const roundId = body.roundId
      if (!roundId) return response(400, { message: 'Keine Runde gewählt.' })
      const result = getDashboardData()
      const rounds = (result.rounds || []).filter((round) => round.id !== roundId)
      return response(200, { message: 'Runde gelöscht.', rounds })
    }

    return response(400, { message: 'Ungültige Admin-Aktion.' })
  } catch (error) {
    console.error(error)
    return response(500, { message: 'Datenbankfehler oder Serverfehler.' })
  }
}
