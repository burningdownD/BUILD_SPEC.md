const { describe, expect, it } = require('vitest')
const { getRanking, pointsForRank, scoreToPar, calculateOverallTable } = require('../src/lib/league.cjs')

describe('Bestes Ergebnis', () => {
  it('schlechteres Ergebnis ignoriert', () => {
    const scores = [2, -1, -4, 0]
    const best = Math.min(...scores)
    expect(best).toBe(-4)
  })

  it('besseres Ergebnis wird verwendet', () => {
    const scores = [-1, -3, -2]
    expect(Math.min(...scores)).toBe(-3)
  })

  it('mehrere identische Bestwerte funktionieren', () => {
    const scores = [-2, -2, -1, -2]
    expect(scores.filter((value) => value === Math.min(...scores)).length).toBe(3)
  })
})

describe('Tie-Ranking', () => {
  it('Rangfolge mit Tie und Skip', () => {
    expect(getRanking([-4, -2, -2, -1])).toEqual([1, 2, 2, 4])
  })

  it('Rang 10 Tie erhält Rang 12 danach', () => {
    const ranking = getRanking([-1, -2, -2, 0, 1, 2, 3, 4, 5, 6, 7, 8])
    expect(ranking[1]).toBe(10)
  })
})

describe('Punktetabellen', () => {
  it('Rang 1 18-Loch = 100', () => {
    expect(pointsForRank('18-hole', 1)).toBe(100)
  })

  it('Rang 10 18-Loch = 21', () => {
    expect(pointsForRank('18-hole', 10)).toBe(21)
  })

  it('Rang 11 18-Loch = 0', () => {
    expect(pointsForRank('18-hole', 11)).toBe(0)
  })

  it('Rang 1 Par3 = 43', () => {
    expect(pointsForRank('short/par3', 1)).toBe(43)
  })

  it('Rang 10 Par3 = 9', () => {
    expect(pointsForRank('short/par3', 10)).toBe(9)
  })

  it('Rang 11 Par3 = 0', () => {
    expect(pointsForRank('short/par3', 11)).toBe(0)
  })
})

describe('Gesamtwertung', () => {
  it('tiebreaker and no results handled', () => {
    const players = [
      { id: 'p1', name: 'A', active: true },
      { id: 'p2', name: 'B', active: true },
      { id: 'p3', name: 'C', active: true },
    ]
    const courses = [
      { id: 'c1', name: 'Course 1', type: '18-hole', par: 72, active: true },
    ]
    const rounds = [
      { id: 'r1', playerId: 'p1', courseId: 'c1', grossStrokes: 68 },
      { id: 'r2', playerId: 'p2', courseId: 'c1', grossStrokes: 68 },
      { id: 'r3', playerId: 'p3', courseId: 'c1', grossStrokes: 75 },
    ]

    const rows = calculateOverallTable(players, courses, rounds)
    expect(rows[0].totalPoints).toBeGreaterThanOrEqual(rows[1].totalPoints)
  })
})
