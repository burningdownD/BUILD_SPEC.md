import { buildDemoData } from './demoData'

export async function requestJson(url, options = {}, fallback = null) {
  try {
    const response = await fetch(url, options)
    if (!response.ok) {
      if (fallback !== null) return fallback
      throw new Error('Request failed')
    }
    const json = await response.json()
    return json
  } catch (error) {
    if (fallback !== null) return fallback
    throw error
  }
}

export async function loadPublicData() {
  const fallback = buildDemoData()
  try {
    const data = await requestJson('/.netlify/functions/public-data', {}, fallback)
    return data
  } catch {
    return fallback
  }
}

export function getAuthHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}
