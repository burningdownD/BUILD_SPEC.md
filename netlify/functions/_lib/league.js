const POINTS_18 = [100, 80, 65, 55, 47, 40, 34, 29, 25, 21, 0]
const POINTS_PAR3 = [43, 34, 28, 24, 20, 17, 15, 12, 11, 9, 0]

function scoreToPar(grossStrokes, par) {
  return Number(grossStrokes) - Number(par)
}

function getRanking(scores) {
  const indexed = scores.map((score, index) => ({ score, index })).sort((a, b) => a.score - b.score)
  const result = new Array(scores.length).fill(0)
  let cursor = 0
  let rank = 1

  while (cursor < indexed.length) {
    const group = []
    const first = indexed[cursor]
    while (cursor < indexed.length && indexed[cursor].score === first.score) {
      group.push(indexed[cursor])
      cursor += 1
    }
    group.forEach(({ index }) => {
      result[index] = rank
    })
    rank += group.length
  }

  return result
}

function pointsForRank(courseType, rank) {
  const table = courseType === '18-hole' ? POINTS_18 : POINTS_PAR3
  if (!rank || rank > table.length) return 0
  return table[rank - 1]
}

function calculateCourseLeaderboard(course, rounds, players) {
  const playerMap = new Map(players.map((player) => [player.id, player]))
  const entries = rounds
    .filter((round) => round.courseId === course.id)
    .map((round) => {
      const player = playerMap.get(round.playerId)
      if (!player) return null
      return {
        playerId: round.playerId,
        scoreToPar: scoreToPar(round.grossStrokes, course.par),
        grossStrokes: round.grossStrokes,
        playedAt: round.playedAt,
      }
    })
    .filter(Boolean)

  const bestByPlayer = new Map()
  entries.forEach((entry) => {
    const previous = bestByPlayer.get(entry.playerId)
    if (!previous || entry.scoreToPar < previous.scoreToPar) bestByPlayer.set(entry.playerId, entry)
  })

  const rankingValues = Array.from(bestByPlayer.values()).sort((a, b) => a.scoreToPar - b.scoreToPar)
  const ranks = getRanking(rankingValues.map((entry) => entry.scoreToPar))

  return rankingValues
    .map((entry, index) => ({
      ...entry,
      rank: ranks[index],
      points: pointsForRank(course.type, ranks[index]),
    }))
    .sort((a, b) => a.rank - b.rank || a.scoreToPar - b.scoreToPar)
}

function calculateOverallTable(players, courses, rounds) {
  const playerMap = new Map(players.map((player) => [player.id, player]))
  const courseMap = new Map(courses.map((course) => [course.id, course]))
  const perPlayer = new Map()

  players.forEach((player) => {
    perPlayer.set(player.id, {
      id: player.id,
      name: player.name,
      active: player.active,
      totalPoints: 0,
      points18: 0,
      pointsPar3: 0,
      bestScoreToPar: null,
      roundCount: 0,
    })
  })

  rounds.forEach((round) => {
    const player = perPlayer.get(round.playerId)
    const course = courseMap.get(round.courseId)
    if (!player || !course) return
    player.roundCount += 1
    const score = scoreToPar(round.grossStrokes, course.par)
    if (player.bestScoreToPar === null || score < player.bestScoreToPar) {
      player.bestScoreToPar = score
    }
  })

  courses.forEach((course) => {
    const leaderboard = calculateCourseLeaderboard(course, rounds, players)
    leaderboard.forEach((entry) => {
      const player = perPlayer.get(entry.playerId)
      if (!player) return
      if (course.type === '18-hole') player.points18 += entry.points
      else player.pointsPar3 += entry.points
      player.totalPoints += entry.points
    })
  })

  return Array.from(perPlayer.values())
    .filter((entry) => entry.roundCount > 0)
    .sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
      if (b.points18 !== a.points18) return b.points18 - a.points18
      if (a.bestScoreToPar === null && b.bestScoreToPar === null) return 0
      if (a.bestScoreToPar === null) return 1
      if (b.bestScoreToPar === null) return -1
      return a.bestScoreToPar - b.bestScoreToPar
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
}

module.exports = {
  POINTS_18,
  POINTS_PAR3,
  getRanking,
  pointsForRank,
  scoreToPar,
  calculateCourseLeaderboard,
  calculateOverallTable,
}
