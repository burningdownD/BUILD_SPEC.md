const { Pool } = require('pg')
const jwt = require('jsonwebtoken')

const pool = new Pool({connectionString: process.env.DATABASE_URL})
const SEASON_END = process.env.SEASON_END_DATE || (()=>{const y=new Date().getFullYear(); return `${y}-03-31`})()

function verifyToken(event){
  const auth = event.headers && (event.headers.authorization || event.headers.Authorization)
  if(!auth) return null
  const m = auth.match(/^Bearer (.+)$/)
  if(!m) return null
  try{ return jwt.verify(m[1], process.env.SESSION_SECRET || 'secret') }catch(e){return null}
}

exports.handler = async function(event){
  try{
    const token = verifyToken(event)
    if(!token) return {statusCode:401, body: JSON.stringify({message:'Keine gültige Session'})}
    const body = JSON.parse(event.body||'{}')
    // only allow player/admin roles for submit
    if(!(token.role==='player' || token.role==='admin')) return {statusCode:403, body: JSON.stringify({message:'Keine Berechtigung'})}

    const {player_id, course_id, gross_strokes, played_at} = body
    if(!player_id) return {statusCode:400, body: JSON.stringify({message:'Ungültige Spieler-ID'})}
    if(!course_id) return {statusCode:400, body: JSON.stringify({message:'Ungültige Platz-ID'})}
    const gross = parseInt(gross_strokes)
    if(!Number.isInteger(gross) || gross <=0) return {statusCode:400, body: JSON.stringify({message:'Bitte gib eine gültige Anzahl an Brutto-Schlägen ein.'})}
    if(played_at){
      const d = new Date(played_at)
      if(isNaN(d)) return {statusCode:400, body: JSON.stringify({message:'Ungültiges Datum'})}
      const end = new Date(SEASON_END)
      if(d > end) return {statusCode:400, body: JSON.stringify({message:'Die Saison ist bereits beendet.'})}
    }

    const client = await pool.connect()
    try{
      // check player exists
      const p = await client.query('SELECT id FROM players WHERE id = $1', [player_id])
      if(p.rowCount===0) return {statusCode:400, body: JSON.stringify({message:'Spieler existiert nicht'})}
      // check course exists and active
      const c = await client.query('SELECT id, active FROM courses WHERE id = $1', [course_id])
      if(c.rowCount===0) return {statusCode:400, body: JSON.stringify({message:'Platz existiert nicht'})}
      if(!c.rows[0].active) return {statusCode:400, body: JSON.stringify({message:'Dieser Platz ist nicht mehr aktiv.'})}

      await client.query('INSERT INTO rounds(id, player_id, course_id, gross_strokes, played_at, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, now())', [player_id, course_id, gross, played_at || null])
      return {statusCode:200, body: JSON.stringify({message:'Ergebnis gespeichert'})}
    }finally{client.release()}
  }catch(err){console.error(err); return {statusCode:500, body: JSON.stringify({message:'Serverfehler'})}}
}
