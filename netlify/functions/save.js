// netlify/functions/save.js
const { getStore } = require('@netlify/blobs');
const { randomUUID } = require('crypto');

const json = (code, obj) => ({
  statusCode: code,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(obj),
});

exports.handler = async (event) => {
  try {
    // ⚠️ TEMP for testing — hard-coded creds
    const store = getStore('guides', {
      siteID: 'ceb7e2c6-43f6-41f2-8cec-1455df7bb177',   // your Site ID
      token: 'nfp_5hBEYsupGEB4pZGmp477tJU8woK4ZvAM95e8'                 // <-- paste your token
    });

    if (event.httpMethod !== 'POST') {
      const latest = await store.getJSON('latest');
      return json(200, { ok: true, latest });
    }

    const { id = '', data } = JSON.parse(event.body || '{}');
    if (!data) return json(400, { error: 'Missing `data` (guide JSON)' });

    const guideId = id || randomUUID();
    const payload = { id: guideId, status: 'active', data, updatedAt: new Date().toISOString() };

    await store.setJSON(guideId, payload);
    await store.setJSON('latest', payload);

    return json(200, { id: guideId });
  } catch (err) {
    console.error(err);
    return json(500, { error: 'Internal error', detail: String(err?.message || err) });
  }
};
