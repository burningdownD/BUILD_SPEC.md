const { calculateOverallTable, calculateCourseLeaderboard } = require('./league')

const store = {
  players: [
    { id: 'p1', name: 'Anna', active: true },
    { id: 'p2', name: 'Ben', active: true },
    { id: 'p3', name: 'Clara', active: true },
    { id: 'p4', name: 'Dieter', active: true },
    { id: 'p5', name: 'Eva', active: true },
    { id: 'p6', name: 'Felix', active: false },
  ],
  courses: [
    { id: 'c1', name: '18-Loch Platz 1', type: '18-hole', par: 72, active: true },
    { id: 'c2', name: '18-Loch Platz 2', type: '18-hole', par: 71, active: true },
    { id: 'c3', name: '18-Loch Platz 3', type: '18-hole', par: 70, active: true },
    { id: 'c4', name: '18-Loch Platz 4', type: '18-hole', par: 69, active: true },
    { id: 'c5', name: 'Par3 Platz 1', type: 'short/par3', par: 27, active: true },
    { id: 'c6', name: 'Par3 Platz 2', type: 'short/par3', par: 30, active: true },
    { id: 'c7', name: 'Par3 Platz 3', type: 'short/par3', par: 27, active: true },
    { id: 'c8', name: 'Par3 Platz 4', type: 'short/par3', par: 27, active: true },
  ],
  rounds: [
    { id: 'r1', playerId: 'p1', courseId: 'c1', grossStrokes: 68, playedAt: '2026-01-12', createdAt: '2026-01-12T00:00:00Z' },
    { id: 'r2', playerId: 'p2', courseId: 'c1', grossStrokes: 72, playedAt: '2026-01-15', createdAt: '2026-01-15T00:00:00Z' },
    { id: 'r3', playerId: 'p3', courseId: 'c1', grossStrokes: 71, playedAt: '2026-01-18', createdAt: '2026-01-18T00:00:00Z' },
    { id: 'r4', playerId: 'p4', courseId: 'c1', grossStrokes: 76, playedAt: '2026-01-19', createdAt: '2026-01-19T00:00:00Z' },
    { id: 'r5', playerId: 'p1', courseId: 'c5', grossStrokes: 27, playedAt: '2026-01-21', createdAt: '2026-01-21T00:00:00Z' },
    { id: 'r6', playerId: 'p2', courseId: 'c5', grossStrokes: 30, playedAt: '2026-01-23', createdAt: '2026-01-23T00:00:00Z' },
    { id: 'r7', playerId: 'p3', courseId: 'c5', grossStrokes: 29, playedAt: '2026-01-25', createdAt: '2026-01-25T00:00:00Z' },
    { id: 'r8', playerId: 'p4', courseId: 'c5', grossStrokes: 33, playedAt: '2026-01-27', createdAt: '2026-01-27T00:00:00Z' },
    { id: 'r9', playerId: 'p5', courseId: 'c2', grossStrokes: 74, playedAt: '2026-02-03', createdAt: '2026-02-03T00:00:00Z' },
    { id: 'r10', playerId: 'p5', courseId: 'c6', grossStrokes: 31, playedAt: '2026-02-06', createdAt: '2026-02-06T00:00:00Z' },
    { id: 'r11', playerId: 'p6', courseId: 'c3', grossStrokes: 78, playedAt: '2026-02-07', createdAt: '2026-02-07T00:00:00Z' },
    { id: 'r12', playerId: 'p6', courseId: 'c7', grossStrokes: 32, playedAt: '2026-02-11', createdAt: '2026-02-11T00:00:00Z' },
  ],
}

function withPlayerNames(entries, playerLookup) {
  return entries.map((entry) => ({
    ...entry,
    playerName: playerLookup.get(entry.playerId)?.name || entry.playerId,
  }))
}

function getPublicData() {
  const playerLookup = new Map(store.players.map((player) => [player.id, player]))
  const leaderboards = {}

  store.courses.forEach((course) => {
    const rows = calculateCourseLeaderboard(course, store.rounds, store.players)
    leaderboards[course.id] = rows.map((entry) => ({
      ...entry,
      playerName: playerLookup.get(entry.playerId)?.name || entry.playerId,
    }))
  })

  const overall = calculateOverallTable(store.players, store.courses, store.rounds)

  return {
    players: store.players,
    courses: store.courses,
    overall,
    leaderboards,
  }
}

function getDashboardData() {
  const playerLookup = new Map(store.players.map((player) => [player.id, player]))
  const courseLookup = new Map(store.courses.map((course) => [course.id, course]))

  const rounds = store.rounds.map((round) => ({
    ...round,
    playerName: playerLookup.get(round.playerId)?.name || round.playerId,
    courseName: courseLookup.get(round.courseId)?.name || round.courseId,
  }))

  return {
    players: store.players,
    courses: store.courses,
    rounds,
  }
}

function getStore() {
  return store
}

module.exports = { getPublicData, getDashboardData, getStore }
