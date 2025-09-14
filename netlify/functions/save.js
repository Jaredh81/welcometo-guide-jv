const { Blobs } = require('@netlify/blobs')

exports.handler = async (event) => {
  try {
    const store = new Blobs({
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
      name: 'guides',
    })

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}')
      await store.setJSON('guide.json', body)
      return { statusCode: 200, body: JSON.stringify({ saved: body }) }
    }

    if (event.httpMethod === 'GET') {
      const latest = await store.getJSON('guide.json')
      return { statusCode: 200, body: JSON.stringify({ latest }) }
    }

    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
