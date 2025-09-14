import { Blobs } from '@netlify/blobs'

export const handler = async (event) => {
  try {
    const store = new Blobs({
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
      name: 'guides',
    })

    const body = JSON.parse(event.body || '{}')

    await store.setJSON('guide.json', body)

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, stored: body }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
