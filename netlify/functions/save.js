// netlify/functions/save.js
exports.handler = async (event) => {
  const blobs = await import('@netlify/blobs');
  const siteID = process.env.NETLIFY_SITE_ID;
  const token  = process.env.NETLIFY_AUTH_TOKEN;

  const store =
    typeof blobs.getStore === 'function'
      ? blobs.getStore({ name: 'guides', siteID, token })
      : blobs.createClient
      ? blobs.createClient({ siteID, token }).store('guides')
      : new blobs.Blobs({ siteID, token }).store('guides');

  // pick ID from query, fallback to "default"
  const id = (event.queryStringParameters && event.queryStringParameters.id) || "default";
  const key = `guide-${id}.json`;

  try {
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      await store.set(key, JSON.stringify(body), { type: 'text', contentType: 'application/json' });
      return json(200, { message: 'Saved!', id, data: body });
    }

    if (event.httpMethod === 'GET') {
      const text = await store.get(key, { type: 'text' }).catch(() => null);
      if (!text) return json(200, { id, latest: null });
      try {
        return json(200, { id, latest: JSON.parse(text) });
      } catch {
        return json(200, { id, latest_raw: text });
      }
    }

    if (event.httpMethod === 'DELETE') {
      if (typeof store.delete === 'function') await store.delete(key).catch(() => {});
      else await store.set(key, '', { type: 'text' });
      return json(200, { id, cleared: true });
    }

    return json(405, { error: 'Method Not Allowed' });
  } catch (err) {
    return json(500, { error: String(err?.message || err) });
  }
};

function json(code, obj) {
  return {
    statusCode: code,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(obj),
  };
}
