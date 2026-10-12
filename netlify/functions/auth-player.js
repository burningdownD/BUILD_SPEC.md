const jwt = require('jsonwebtoken')

exports.handler = async function(event){
  try{
    const body = JSON.parse(event.body||'{}')
    const pw = process.env.PLAYER_PASSWORD
    if(!pw) return {statusCode:500, body: JSON.stringify({message:'Server-Konfiguration fehlerhaft'})}
    if(body.password !== pw) return {statusCode:401, body: JSON.stringify({message:'Das Passwort ist falsch.'})}
    const token = jwt.sign({role:'player',iat:Math.floor(Date.now()/1000)}, process.env.SESSION_SECRET || 'secret', {expiresIn:'6h'})
    return {statusCode:200, body: JSON.stringify({token})}
  }catch(err){
    return {statusCode:400, body: JSON.stringify({message:'Ungültige Anfrage'})}
  }
}
