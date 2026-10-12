import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { loadPublicData } from '../lib/api'

export default function CoursePage() {
  const { courseId } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    loadPublicData().then(setData)
  }, [])

  const course = useMemo(() => {
    if (!data?.courses) return null
    return data.courses.find((entry) => entry.id === courseId)
  }, [data, courseId])

  if (!data) return <div className="card">Lade Platzdaten...</div>
  if (!course) return <div className="card error">Dieser Platz wurde nicht gefunden.</div>

  const leaderboard = Array.isArray(data.leaderboards?.[courseId]) ? data.leaderboards[courseId] : []

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2>{course.name}</h2>
          <p className="muted">{course.type} · Par {course.par}</p>
        </div>
        <Link className="muted-link" to="/">Zurück zur Gesamtwertung</Link>
      </div>

      <div className="table-wrap mt-1">
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Spieler</th>
              <th>Score-to-Par</th>
              <th>Punkte</th>
              <th>Brutto</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr><td colSpan="6">Noch keine Ergebnisse für diesen Platz.</td></tr>
            ) : leaderboard.map((entry) => (
              <tr key={entry.playerId || entry.player_id}>
                <td>{entry.rank ?? '-'}</td>
                <td>{entry.playerName || entry.player_name}</td>
                <td>{entry.scoreToPar ?? entry.score_to_par}</td>
                <td>{entry.points ?? 0}</td>
                <td>{entry.grossStrokes ?? entry.gross_strokes ?? '-'}</td>
                <td>{entry.playedAt ?? entry.played_at ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
