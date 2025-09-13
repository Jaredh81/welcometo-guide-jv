// netlify/functions/save.js
import { getStore } from '@netlify/blobs';

export const handler = async (event) => {
  // Method guard
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const data = body?.data;

    if (!data) {
      return {
        statusCode: 400,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: "Missing `data` (guide JSON)" }),
      };
    }

    // Robust ID (works even if crypto.randomUUID is unavailable)
    const makeId = () =>
      (globalThis.crypto?.randomUUID?.() ??
        `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`);

    const id = String(body?.id || makeId());

    // Write to Netlify Blobs "guides" store
    const store = getStore('guides');

    const payload = {
      id,
      status: 'active',
      data,
      updatedAt: new Date().toISOString(),
    };

    await store.setJSON(id, payload);

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ok: true, id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal error',
        detail: String(err?.message || err),
      }),
    };
  }
};
