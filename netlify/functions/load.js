// netlify/functions/load.js
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  try {
    const id =
      (event.queryStringParameters && event.queryStringParameters.id) ||
      'host1';

    const store = getStore('guides'); // same bucket used by save.js
    // Ask Blobs to JSON-decode for us; returns null if not found
    const data = await store.get(`guides/${id}.json`, { type: 'json' });

    if (!data) {
      return {
        statusCode: 404,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'not found', id }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, latest: data }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        errorType: e.name || 'Error',
        errorMessage: e.message,
      }),
    };
  }
};
