import { useEffect, useState } from 'react'
import { loadPublicData } from '../lib/api'

export default function HomePage({ type = null }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    loadPublicData().then((result) => {
      if (!ignore) {
        setData(result)
        setLoading(false)
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  if (loading) return <div className="card">Lade Wertung...</div>
  if (!data) return <div className="card error">Keine Daten verfügbar.</div>

  const overallRows = Array.isArray(data.overall) ? data.overall : []
  const visibleRows = type ? overallRows.filter((row) => row.type === type) : overallRows

  return (
    <div className="card">
      <h2>{type === '18-hole' ? '18-Loch-Wertung' : type === 'short/par3' ? 'Par3-Wertung' : 'Gesamtwertung'}</h2>
      <p className="muted">Saisonzeitraum: bis 31. März</p>
      <div className="alert">Wertung nach Gesamtpunkten, 18-Loch-Punkten und bestem Einzel-Score-to-Par.</div>

      <div className="table-wrap mt-1">
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Spieler</th>
              <th>Gesamtpunkte</th>
              <th>18-Loch</th>
              <th>Par3</th>
              <th>Bestes Ergebnis</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan="6">Noch keine Ergebnisse.</td>
              </tr>
            ) : (
              visibleRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.rank ?? '-'}</td>
                  <td>{row.name}</td>
                  <td>{row.totalPoints ?? row.total_points ?? 0}</td>
                  <td>{row.points18 ?? row.points_18 ?? 0}</td>
                  <td>{row.pointsPar3 ?? row.points_par3 ?? 0}</td>
                  <td>{row.bestScoreToPar ?? row.best_score_to_par ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
