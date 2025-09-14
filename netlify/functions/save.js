// CommonJS-compatible function using a dynamic import
exports.handler = async (event) => {
  try {
    const blobs = await import('@netlify/blobs');

    const siteID = process.env.NETLIFY_SITE_ID;
    const token  = process.env.NETLIFY_AUTH_TOKEN;

    // pick the right API shape regardless of installed version
    let store;
    if (typeof blobs.createClient === 'function') {
      // Newer SDK
      const client = blobs.createClient({ siteID, token });
      store = client.store('guides');
    } else if (typeof blobs.getStore === 'function') {
      // Some SDKs expose getStore directly
      store = blobs.getStore('guides', { siteID, token });
    } else if (blobs.Blobs) {
      // Older SDKs exposed a class
      const client = new blobs.Blobs({ siteID, token });
      store = client.store('guides');
    } else {
      throw new Error('No compatible @netlify/blobs API found');
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      await store.setJSON('guide.json', body);
      return {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ saved: true }),
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
