const { getPublicData } = require('./_lib/store')

function response(statusCode, data) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}

exports.handler = async function () {
  try {
    return response(200, getPublicData())
  } catch (error) {
    console.error(error)
    return response(500, { message: 'Daten konnten nicht geladen werden.' })
  }
}
