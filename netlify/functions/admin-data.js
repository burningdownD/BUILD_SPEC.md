const { Pool } = require('pg')
const jwt = require('jsonwebtoken')

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
    const q = event.queryStringParameters || {}
    const action = q.action || 'list'
    const client = await pool.connect()
    try{
      if(action==='listPlayers'){
        const r = await client.query('SELECT id,name,active,created_at FROM players ORDER BY name')
        return {statusCode:200, body: JSON.stringify({players:r.rows})}
      }
      if(action==='addPlayer'){
        const body = JSON.parse(event.body||'{}')
        if(!body.name) return {statusCode:400, body: JSON.stringify({message:'Name fehlt'})}
        await client.query('INSERT INTO players(id,name,active,created_at) VALUES (gen_random_uuid(), $1, true, now())', [body.name])
        return {statusCode:200, body: JSON.stringify({message:'Spieler hinzugefügt'})}
      }
      // other admin actions omitted for brevity
      return {statusCode:400, body: JSON.stringify({message:'Ungültige Aktion'})}
    }finally{client.release()}
  }catch(err){console.error(err); return {statusCode:500, body: JSON.stringify({message:'Serverfehler'})}}
}
