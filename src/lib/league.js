export const POINTS_18 = [100, 80, 65, 55, 47, 40, 34, 29, 25, 21, 0]
export const POINTS_PAR3 = [43, 34, 28, 24, 20, 17, 15, 12, 11, 9, 0]

export function scoreToPar(grossStrokes, par) {
  return Number(grossStrokes) - Number(par)
}

export function getRanking(scores) {
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

export function pointsForRank(courseType, rank) {
  const table = courseType === '18-hole' ? POINTS_18 : POINTS_PAR3
  if (rank <= 0 || rank > table.length) return 0
  return table[rank - 1]
}

export function bestScoreForPlayer(rounds) {
  if (!rounds.length) return null
  return Math.min(...rounds.map((round) => Number(round.scoreToPar)))
}

export function calculateCourseLeaderboard(course, rounds, players) {
  const playerMap = new Map(players.map((player) => [player.id, player]))

  const entries = rounds
    .filter((round) => round.courseId === course.id)
    .map((round) => {
      const player = playerMap.get(round.playerId)
      if (!player) return null
      return {
        playerId: round.playerId,
        playerName: player.name,
        scoreToPar: scoreToPar(round.grossStrokes, course.par),
        grossStrokes: round.grossStrokes,
        playedAt: round.playedAt,
      }
    })
    .filter(Boolean)

  const bestByPlayer = new Map()
  entries.forEach((entry) => {
    const previous = bestByPlayer.get(entry.playerId)
    if (!previous || entry.scoreToPar < previous.scoreToPar) {
      bestByPlayer.set(entry.playerId, entry)
    }
  })

  const bestEntries = Array.from(bestByPlayer.values()).sort((a, b) => a.scoreToPar - b.scoreToPar)
  const scores = bestEntries.map((entry) => entry.scoreToPar)
  const rankings = getRanking(scores)

  return bestEntries
    .map((entry, index) => ({
      ...entry,
      rank: rankings[index],
      points: pointsForRank(course.type, rankings[index]),
    }))
    .sort((a, b) => a.rank - b.rank || a.scoreToPar - b.scoreToPar)
}

export function calculateOverallTable(players, courses, rounds) {
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
      courseCount: 0,
      roundCount: 0,
    })
  })

  rounds.forEach((round) => {
    const player = perPlayer.get(round.playerId)
    const course = courseMap.get(round.courseId)
    if (!player || !course) return
    player.roundCount += 1

    const scoreToPar = scoreToPar(round.grossStrokes, course.par)
    if (player.bestScoreToPar === null || scoreToPar < player.bestScoreToPar) {
      player.bestScoreToPar = scoreToPar
    }
  })

  courses.forEach((course) => {
    const leaderboard = calculateCourseLeaderboard(course, rounds, players)
    leaderboard.forEach((entry) => {
      const player = perPlayer.get(entry.playerId)
      if (!player) return
      if (player.bestScoreToPar === null || entry.scoreToPar < player.bestScoreToPar) {
        player.bestScoreToPar = entry.scoreToPar
      }
      player.courseCount += 1
      if (course.type === '18-hole') {
        player.points18 += entry.points
      } else {
        player.pointsPar3 += entry.points
      }
      player.totalPoints += entry.points
    })
  })

  const rows = Array.from(perPlayer.values())
    .filter((entry) => entry.roundCount > 0)
    .map((entry) => ({
      ...entry,
      bestScoreToPar: entry.bestScoreToPar ?? null,
    }))
    .sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
      if (b.points18 !== a.points18) return b.points18 - a.points18
      if (a.bestScoreToPar === null && b.bestScoreToPar === null) return 0
      if (a.bestScoreToPar === null) return 1
      if (b.bestScoreToPar === null) return -1
      return a.bestScoreToPar - b.bestScoreToPar
    })

  return rows.map((row, index) => ({ ...row, rank: index + 1 }))
}
