// CommonJS + version-proof + explicit envs
exports.handler = async (event) => {
  // 0) Verify env is visible
  const siteID = process.env.NETLIFY_SITE_ID;
  const token  = process.env.NETLIFY_AUTH_TOKEN;
  if (!siteID || !token) {
    return json(500, {
      error: "Env vars not visible at runtime",
      siteID: !!siteID,
      token: !!token
    });
  }

  // 1) Load SDK in a way that works in CJS
  const blobs = await import('@netlify/blobs');

  // 2) Get a store named "guides" with explicit creds (works across plans)
  const store =
    typeof blobs.getStore === 'function'
      ? blobs.getStore({ name: 'guides', siteID, token })
      : typeof blobs.createClient === 'function'
        ? blobs.createClient({ siteID, token }).store('guides')
        : new blobs.Blobs({ siteID, token }).store('guides');

  try {
    if (event.httpMethod === 'POST') {
      // Parse body
      let body = {};
      try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Bad JSON body' }); }
      // Always write as JSON string (no [object Object])
      await store.set('guide.json', JSON.stringify(body), { type: 'text', contentType: 'application/json' });
      return json(200, { message: 'Saved!', data: body });
    }

    if (event.httpMethod === 'GET') {
      // Read raw text then parse
      const text = await store.get('guide.json', { type: 'text' }).catch(() => null);
      if (!text) return json(200, { latest: null });
      try {
        return json(200, { latest: JSON.parse(text) });
      } catch {
        // If something old/bad is stored, show raw so we can see it
        return json(200, { latest_raw: text });
      }
    }

    if (event.httpMethod === 'DELETE') {
      // Optional: clear the stored value
      if (typeof store.delete === 'function') await store.delete('guide.json').catch(() => {});
      else await store.set('guide.json', '', { type: 'text' });
      return json(200, { cleared: true });
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
