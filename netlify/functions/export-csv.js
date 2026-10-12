const { Pool } = require('pg')
const jwt = require('jsonwebtoken')
const stringify = require('csv-stringify').stringify

const pool = new Pool({connectionString: process.env.DATABASE_URL})

function verifyAdmin(event){
  const auth = event.headers && (event.headers.authorization || event.headers.Authorization)
  if(!auth) return null
  const m = auth.match(/^Bearer (.+)$/)
  if(!m) return null
  try{ const t = jwt.verify(m[1], process.env.SESSION_SECRET || 'secret'); return t.role==='admin' ? t : null }catch(e){return null}
}

exports.handler = async function(event){
  const admin = verifyAdmin(event)
  if(!admin) return {statusCode:401, body: JSON.stringify({message:'Keine Admin-Session'})}
  try{
    const client = await pool.connect()
    try{
      // export raw rounds
      const r = await client.query(`SELECT p.name as spieler, c.name as platz, c.type as platztyp, c.par, r.gross_strokes, (r.gross_strokes - c.par) as score_to_par, r.played_at, r.created_at FROM rounds r JOIN players p ON p.id=r.player_id JOIN courses c ON c.id=r.course_id ORDER BY r.created_at`)
      const header = ['Spieler','Platz','Platztyp','Par','Brutto-Schläge','Score-to-Par','Spieldatum','Erstellt am']
      const rows = r.rows.map(rr=>[rr.spieler, rr.platz, rr.platztyp, rr.par, rr.gross_strokes, rr.score_to_par, rr.played_at ? rr.played_at.toISOString().split('T')[0] : '', rr.created_at.toISOString()])
      const csv = [header].concat(rows).map(r=>r.join(';')).join('\n')
      return {statusCode:200, headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="raw_rounds.csv"'}, body: csv}
    }finally{client.release()}
  }catch(err){console.error(err); return {statusCode:500, body: JSON.stringify({message:'Serverfehler'})}}
}
