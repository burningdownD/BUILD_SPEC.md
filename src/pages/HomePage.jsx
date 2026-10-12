import React, {useEffect, useState} from 'react'

export default function HomePage(){
  const [data,setData] = useState(null)
  useEffect(()=>{
    fetch('/.netlify/functions/public-data')
      .then(r=>r.json()).then(setData).catch(()=>setData({error:true}))
  },[])

  if(!data) return <div>Lade Daten...</div>
  if(data.error) return <div>Fehler beim Laden der öffentlichen Daten.</div>

  return (
    <div className="container">
      <h2>Gesamttabelle</h2>
      <table className="table">
        <thead><tr><th>Rang</th><th>Spieler</th><th>Punkte</th><th>18-Loch</th><th>Par3</th><th>Bestes Ergebnis</th></tr></thead>
        <tbody>
          {data.overall.map((p,i)=> (
            <tr key={p.id}><td>{i+1}</td><td>{p.name}</td><td>{p.total_points}</td><td>{p.points_18}</td><td>{p.points_par3}</td><td>{p.best_score_to_par}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
