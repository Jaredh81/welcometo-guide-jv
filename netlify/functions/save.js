// netlify/functions/save.js
const { getStore } = require('@netlify/blobs');
const { randomUUID } = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { id, data } = JSON.parse(event.body || '{}');
    if (!data) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'Missing `data` (guide JSON)' }),
      };
    }

    const guideId = id || randomUUID();
    const store = getStore('guides');

    const payload = {
      id: guideId,
      status: 'active',
      data,
      updatedAt: new Date().toISOString(),
    };

    await store.setJSON(guideId, payload);

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: guideId }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
};
