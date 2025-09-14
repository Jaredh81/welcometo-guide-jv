const { createClient } = require('@netlify/blobs');

exports.handler = async (event) => {
  try {
    const client = createClient({
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });

    // use (or auto-create) a store named "guides"
    const store = client.store('guides');

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      await store.setJSON('guide.json', body);
      return {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ saved: body }),
      };
    }

    if (event.httpMethod === 'GET') {
      const latest = await store.getJSON('guide.json');
      return {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ latest }),
      };
    }

    return {
      statusCode: 405,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
