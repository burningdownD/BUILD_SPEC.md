import React, {useEffect, useState} from 'react'

export default function EnterScorePage(){
  const [playerPass, setPlayerPass] = useState('')
  const [authed, setAuthed] = useState(false)
  const [players, setPlayers] = useState([])
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState({player_id:'',course_id:'',gross_strokes:'',played_at:''})

  async function login(){
    const res = await fetch('/.netlify/functions/auth-player', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:playerPass})})
    if(res.ok) setAuthed(true)
    else alert('Das Passwort ist falsch.')
  }

  useEffect(()=>{
    fetch('/.netlify/functions/public-data').then(r=>r.json()).then(d=>{setPlayers(d.players); setCourses(d.courses)})
  },[])

  async function submit(e){
    e.preventDefault()
    const res = await fetch('/.netlify/functions/submit-round', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    if(res.ok){alert('Ergebnis gespeichert.'); setForm({player_id:'',course_id:'',gross_strokes:'',played_at:''})}
    else {const err=await res.json(); alert(err.message || 'Fehler')}
  }

  return (
    <div className="container">
      <h2>Ergebnis eingeben</h2>
      {!authed ? (
        <div>
          <p>Bitte Spieler-Passwort eingeben:</p>
          <input type="password" value={playerPass} onChange={e=>setPlayerPass(e.target.value)} />
          <button onClick={login}>Anmelden</button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div>
            <label>Spieler</label>
            <select value={form.player_id} onChange={e=>setForm({...form,player_id:e.target.value})} required>
              <option value="">-- wählen --</option>
              {players.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label>Platz</label>
            <select value={form.course_id} onChange={e=>setForm({...form,course_id:e.target.value})} required>
              <option value="">-- wählen --</option>
              {courses.map(c=> <option key={c.id} value={c.id}>{c.name} (Par {c.par})</option>)}
            </select>
          </div>
          <div>
            <label>Brutto-Schläge</label>
            <input type="number" min="1" value={form.gross_strokes} onChange={e=>setForm({...form,gross_strokes:e.target.value})} required />
          </div>
          <div>
            <label>Spieldatum (optional)</label>
            <input type="date" value={form.played_at} onChange={e=>setForm({...form,played_at:e.target.value})} />
          </div>
          <button type="submit">Speichern</button>
        </form>
      )}
    </div>
  )
}
