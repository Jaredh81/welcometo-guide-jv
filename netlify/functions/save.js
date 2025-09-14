// CommonJS, version-proof, always store strings
const blobsImport = () => import('@netlify/blobs');

exports.handler = async (event) => {
  const blobs = await blobsImport();
  const siteID = process.env.NETLIFY_SITE_ID;
  const token  = process.env.NETLIFY_AUTH_TOKEN;

  // get a store named "guides" regardless of SDK shape
  const store =
    typeof blobs.getStore === 'function'
      ? blobs.getStore({ name: 'guides', siteID, token })
      : blobs.createClient
      ? blobs.createClient({ siteID, token }).store('guides')
      : new blobs.Blobs({ siteID, token }).store('guides');

  // DELETE -> clear and confirm
  if (event.httpMethod === 'DELETE') {
    await store.delete?.('guide.json').catch(() => {});
    return resp(200, { ok: true, cleared: true });
  }

  // POST -> save JSON as a string (always)
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const text = JSON.stringify(body);                 // <- guaranteed JSON string
    await store.set('guide.json', text, {
      type: 'text',
      contentType: 'application/json',
    });
    return resp(200, { ok: true, saved: body });
  }

  // GET -> read text and parse; if not JSON, show raw so we see what's wrong
  if (event.httpMethod === 'GET') {
    const text = await store.get('guide.json', { type: 'text' }).catch(() => null);
    if (!text) return resp(200, { latest: null });

    try {
      return resp(200, { latest: JSON.parse(text) });
    } catch {
      return resp(200, { latest_raw: text });          // <- helps spot "[object Object]"
    }
  }

  return resp(405, { error: 'Method Not Allowed' });
};

function resp(code, obj) {
  return {
    statusCode: code,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(obj),
  };
}
