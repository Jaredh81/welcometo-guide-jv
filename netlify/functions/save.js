import { getStore } from '@netlify/blobs'
import { randomUUID } from 'crypto'

const json = (code, obj) => ({
  statusCode: code,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(obj),
})

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' })
  }

  let body = {}
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return json(400, { error: 'Invalid JSON body' })
  }

  const { id = '', data } = body
  if (!data) {
    return json(400, { error: 'Missing `data` (guide JSON)' })
  }

  const siteID = process.env.NETLIFY_SITE_ID
  const token  = process.env.NETLIFY_AUTH_TOKEN

  const store = getStore({ name: 'guides', siteID, token })

  const guideId = id || randomUUID()
  const payload = {
    id: guideId,
    status: 'active',
    data,
    updatedAt: new Date().toISOString(),
  }

  try {
    await store.setJSON(guideId, payload)
    return json(200, { id: guideId })
  } catch (err) {
    console.error(err)
    return json(500, { error: 'Internal error', detail: String(err?.message || err) })
  }
}
