const jwt = require('jsonwebtoken')

function response(statusCode, data) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}

exports.handler = async function (event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {}
    const suppliedPassword = String(body.password || '')
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (suppliedPassword !== expectedPassword) {
      return response(401, { message: 'Das Passwort ist falsch.' })
    }

    const token = jwt.sign({ role: 'admin' }, process.env.SESSION_SECRET || 'demo-secret', {
      expiresIn: '12h',
    })

    return response(200, { token })
  } catch (error) {
    return response(400, { message: 'Ungültige Anfrage.' })
  }
}
