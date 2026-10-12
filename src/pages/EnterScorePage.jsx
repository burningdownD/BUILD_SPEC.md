import { useEffect, useMemo, useState } from 'react'
import { loadPublicData } from '../lib/api'

export default function EnterScorePage() {
  const [data, setData] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('player-token') || '')
  const [password, setPassword] = useState('')
  const [form, setForm] = useState({
    playerId: '',
    courseId: '',
    grossStrokes: '',
    playedAt: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadPublicData().then(setData)
  }, [])

  const players = data?.players || []
  const courses = data?.courses || []

  const login = async () => {
    try {
      const response = await fetch('/.netlify/functions/auth-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        throw new Error('Das Passwort ist falsch.')
      }

      const payload = await response.json()
      const nextToken = payload.token || 'demo-player-token'
      localStorage.setItem('player-token', nextToken)
      setToken(nextToken)
      setMessage('Erfolgreich angemeldet.')
      setError('')
    } catch (err) {
      setError(err.message || 'Login fehlgeschlagen.')
      setMessage('')
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      const response = await fetch('/.netlify/functions/submit-round', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          playerId: form.playerId,
          courseId: form.courseId,
          grossStrokes: Number(form.grossStrokes),
          playedAt: form.playedAt || undefined,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload.message || 'Ergebnis konnte nicht gespeichert werden.')
      }

      setForm({ playerId: '', courseId: '', grossStrokes: '', playedAt: '' })
      setMessage('Ergebnis gespeichert. Die Wertung wurde aktualisiert.')
      await loadPublicData().then(setData)
    } catch (err) {
      setError(err.message || 'Fehler beim Speichern.')
    }
  }

  if (!token) {
    return (
      <div className="card">
        <h2>Ergebnis eingeben</h2>
        <p className="muted">Bitte gib das Spieler-Passwort ein.</p>
        <div className="form-grid mt-1">
          <div>
            <label>Passwort</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="mt-2">
          <button onClick={login}>Anmelden</button>
        </div>
        {error && <div className="alert error mt-2">{error}</div>}
        {message && <div className="alert success mt-2">{message}</div>}
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Ergebnis eingeben</h2>
      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}
      <form onSubmit={onSubmit} className="mt-1">
        <div className="form-grid">
          <div>
            <label>Spieler</label>
            <select value={form.playerId} onChange={(e) => setForm({ ...form, playerId: e.target.value })} required>
              <option value="">Bitte wählen</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Platz</label>
            <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} required>
              <option value="">Bitte wählen</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.name} (Par {course.par})</option>
              ))}
            </select>
          </div>

          <div>
            <label>Brutto-Schläge</label>
            <input type="number" min="1" value={form.grossStrokes} onChange={(e) => setForm({ ...form, grossStrokes: e.target.value })} required />
          </div>

          <div>
            <label>Spieldatum (optional)</label>
            <input type="date" value={form.playedAt} onChange={(e) => setForm({ ...form, playedAt: e.target.value })} />
          </div>
        </div>

        <div className="mt-2 row">
          <button type="submit">Speichern</button>
          <button type="button" className="secondary" onClick={() => setToken('')}>Abmelden</button>
        </div>
      </form>
    </div>
  )
}
