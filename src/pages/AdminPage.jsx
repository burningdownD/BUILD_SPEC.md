import { useEffect, useState } from 'react'
import { getAuthHeaders, requestJson } from '../lib/api'

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin-token') || '')
  const [password, setPassword] = useState('')
  const [players, setPlayers] = useState([])
  const [courses, setCourses] = useState([])
  const [rounds, setRounds] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [courseName, setCourseName] = useState('')
  const [coursePar, setCoursePar] = useState('72')
  const [courseType, setCourseType] = useState('18-hole')

  const loadAdminData = async () => {
    try {
      const payload = await requestJson('/.netlify/functions/admin-data?action=dashboard', {
        headers: getAuthHeaders(adminToken),
      }, { players: [], courses: [], rounds: [] })
      setPlayers(payload.players || [])
      setCourses(payload.courses || [])
      setRounds(payload.rounds || [])
    } catch {
      setError('Daten konnten nicht geladen werden.')
    }
  }

  useEffect(() => {
    if (adminToken) {
      loadAdminData()
    }
  }, [adminToken])

  const doAdminLogin = async () => {
    try {
      const response = await fetch('/.netlify/functions/auth-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) throw new Error('Das Passwort ist falsch.')
      const payload = await response.json()
      const nextToken = payload.token || 'demo-admin-token'
      localStorage.setItem('admin-token', nextToken)
      setAdminToken(nextToken)
      setMessage('Admin-Login erfolgreich.')
      setError('')
    } catch (err) {
      setError(err.message || 'Admin-Login fehlgeschlagen.')
      setMessage('')
    }
  }

  const callAdminAction = async (action, body = {}) => {
    const response = await fetch('/.netlify/functions/admin-data', {
      method: 'POST',
      headers: {
        ...getAuthHeaders(adminToken),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, ...body }),
    })

    const payload = await response.json()
    if (!response.ok) throw new Error(payload.message || 'Aktion fehlgeschlagen.')
    return payload
  }

  const addPlayer = async () => {
    try {
      const payload = await callAdminAction('add-player', { name: playerName })
      setMessage(payload.message || 'Spieler hinzugefügt.')
      setPlayerName('')
      await loadAdminData()
    } catch (err) {
      setError(err.message)
    }
  }

  const addCourse = async () => {
    try {
      const payload = await callAdminAction('add-course', { name: courseName, par: Number(coursePar), type: courseType })
      setMessage(payload.message || 'Platz hinzugefügt.')
      setCourseName('')
      setCoursePar('72')
      await loadAdminData()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteRound = async (roundId) => {
    try {
      const payload = await callAdminAction('delete-round', { roundId })
      setMessage(payload.message || 'Runde gelöscht.')
      await loadAdminData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!adminToken) {
    return (
      <div className="card">
        <h2>Admin-Bereich</h2>
        <p className="muted">Bitte gib das Admin-Passwort ein.</p>
        <div className="form-grid">
          <div>
            <label>Passwort</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="mt-2">
          <button onClick={doAdminLogin}>Admin anmelden</button>
        </div>
        {error && <div className="alert error mt-2">{error}</div>}
        {message && <div className="alert success mt-2">{message}</div>}
      </div>
    )
  }

  return (
    <div className="card">
      <h2>Admin-Bereich</h2>
      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}

      <div className="mt-2">
        <button className="secondary" onClick={() => { localStorage.removeItem('admin-token'); setAdminToken(''); }}>Abmelden</button>
      </div>

      <div className="grid mt-2">
        <section>
          <h3>Spieler verwalten</h3>
          <div className="form-grid">
            <div>
              <label>Neuer Spieler</label>
              <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
            </div>
          </div>
          <div className="mt-2">
            <button onClick={addPlayer}>Spieler hinzufügen</button>
          </div>
          <div className="table-wrap mt-2">
            <table>
              <thead><tr><th>Name</th><th>Status</th></tr></thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id}><td>{player.name}</td><td>{player.active ? 'Aktiv' : 'Inaktiv'}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3>Plätze verwalten</h3>
          <div className="form-grid">
            <div>
              <label>Neuer Platz</label>
              <input value={courseName} onChange={(e) => setCourseName(e.target.value)} />
            </div>
            <div>
              <label>Typ</label>
              <select value={courseType} onChange={(e) => setCourseType(e.target.value)}>
                <option value="18-hole">18-hole</option>
                <option value="short/par3">short/par3</option>
              </select>
            </div>
            <div>
              <label>Par</label>
              <input type="number" min="1" value={coursePar} onChange={(e) => setCoursePar(e.target.value)} />
            </div>
          </div>
          <div className="mt-2"><button onClick={addCourse}>Platz hinzufügen</button></div>
          <div className="table-wrap mt-2">
            <table>
              <thead><tr><th>Name</th><th>Typ</th><th>Par</th></tr></thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}><td>{course.name}</td><td>{course.type}</td><td>{course.par}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3>Runden verwalten</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Spieler</th><th>Platz</th><th>Brutto</th><th>Datum</th><th>Aktion</th></tr></thead>
              <tbody>
                {rounds.map((round) => (
                  <tr key={round.id}>
                    <td>{round.playerName || round.player_id}</td>
                    <td>{round.courseName || round.course_id}</td>
                    <td>{round.grossStrokes}</td>
                    <td>{round.playedAt || '-'}</td>
                    <td><button className="inline" onClick={() => deleteRound(round.id)}>Löschen</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
