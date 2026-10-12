const { getPublicData, getStore } = require('./_lib/store')
const jwt = require('jsonwebtoken')

function response(statusCode, data) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}

function getTokenFromEvent(event) {
  const authHeader = event.headers && (event.headers.authorization || event.headers.Authorization)
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  try {
    return jwt.verify(authHeader.replace('Bearer ', ''), process.env.SESSION_SECRET || 'demo-secret')
  } catch {
    return null
  }
}

exports.handler = async function (event) {
  const token = getTokenFromEvent(event)
  if (!token || !['player', 'admin'].includes(token.role)) {
    return response(401, { message: 'Du hast keine Berechtigung für diese Aktion.' })
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {}
    const playerId = body.playerId || body.player_id
    const courseId = body.courseId || body.course_id
    const grossStrokes = Number(body.grossStrokes ?? body.gross_strokes)
    const playedAt = body.playedAt || body.played_at || ''

    if (!playerId) return response(400, { message: 'Ungültige Spieler-ID.' })
    if (!courseId) return response(400, { message: 'Ungültige Platz-ID.' })
    if (!Number.isInteger(grossStrokes) || grossStrokes <= 0) return response(400, { message: 'Bitte gib eine gültige Anzahl an Brutto-Schlägen ein.' })

    const store = getStore()
    const player = store.players.find((entry) => entry.id === playerId)
    const course = store.courses.find((entry) => entry.id === courseId)

    if (!player) return response(400, { message: 'Dieser Spieler existiert nicht.' })
    if (!course) return response(400, { message: 'Dieser Platz existiert nicht.' })
    if (!course.active) return response(400, { message: 'Dieser Platz ist nicht mehr aktiv.' })

    if (playedAt) {
      const dateValue = new Date(playedAt)
      if (Number.isNaN(dateValue.getTime())) return response(400, { message: 'Ungültiges Datum.' })
      const seasonEnd = process.env.SEASON_END_DATE || `${new Date().getFullYear()}-03-31`
      if (dateValue > new Date(seasonEnd)) return response(400, { message: 'Die Saison ist bereits beendet.' })
    }

    store.rounds.push({
      id: `r${Date.now()}`,
      playerId,
      courseId,
      grossStrokes,
      playedAt: playedAt || null,
      createdAt: new Date().toISOString(),
    })

    return response(200, { message: 'Ergebnis gespeichert.', data: getPublicData() })
  } catch (error) {
    console.error(error)
    return response(500, { message: 'Datenbankfehler oder Serverfehler.' })
  }
}
