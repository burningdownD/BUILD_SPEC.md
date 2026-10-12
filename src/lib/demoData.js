export const demoPlayers = [
  { id: 'p1', name: 'Anna', active: true },
  { id: 'p2', name: 'Ben', active: true },
  { id: 'p3', name: 'Clara', active: true },
  { id: 'p4', name: 'Dieter', active: true },
  { id: 'p5', name: 'Eva', active: true },
  { id: 'p6', name: 'Felix', active: false },
]

export const demoCourses = [
  { id: 'c1', name: '18-Loch Platz 1', type: '18-hole', par: 72, active: true },
  { id: 'c2', name: '18-Loch Platz 2', type: '18-hole', par: 71, active: true },
  { id: 'c3', name: '18-Loch Platz 3', type: '18-hole', par: 70, active: true },
  { id: 'c4', name: '18-Loch Platz 4', type: '18-hole', par: 69, active: true },
  { id: 'c5', name: 'Par3 Platz 1', type: 'short/par3', par: 27, active: true },
  { id: 'c6', name: 'Par3 Platz 2', type: 'short/par3', par: 30, active: true },
  { id: 'c7', name: 'Par3 Platz 3', type: 'short/par3', par: 27, active: true },
  { id: 'c8', name: 'Par3 Platz 4', type: 'short/par3', par: 27, active: true },
]

export const demoRounds = [
  { id: 'r1', playerId: 'p1', courseId: 'c1', grossStrokes: 68, playedAt: '2026-01-12' },
  { id: 'r2', playerId: 'p2', courseId: 'c1', grossStrokes: 72, playedAt: '2026-01-15' },
  { id: 'r3', playerId: 'p3', courseId: 'c1', grossStrokes: 71, playedAt: '2026-01-18' },
  { id: 'r4', playerId: 'p4', courseId: 'c1', grossStrokes: 76, playedAt: '2026-01-19' },
  { id: 'r5', playerId: 'p1', courseId: 'c5', grossStrokes: 27, playedAt: '2026-01-21' },
  { id: 'r6', playerId: 'p2', courseId: 'c5', grossStrokes: 30, playedAt: '2026-01-23' },
  { id: 'r7', playerId: 'p3', courseId: 'c5', grossStrokes: 29, playedAt: '2026-01-25' },
  { id: 'r8', playerId: 'p4', courseId: 'c5', grossStrokes: 33, playedAt: '2026-01-27' },
  { id: 'r9', playerId: 'p5', courseId: 'c2', grossStrokes: 74, playedAt: '2026-02-03' },
  { id: 'r10', playerId: 'p5', courseId: 'c6', grossStrokes: 31, playedAt: '2026-02-06' },
  { id: 'r11', playerId: 'p6', courseId: 'c3', grossStrokes: 78, playedAt: '2026-02-07' },
  { id: 'r12', playerId: 'p6', courseId: 'c7', grossStrokes: 32, playedAt: '2026-02-11' },
]

export function buildDemoData() {
  return {
    players: demoPlayers,
    courses: demoCourses,
    rounds: demoRounds,
    generatedAt: Date.now(),
  }
}
