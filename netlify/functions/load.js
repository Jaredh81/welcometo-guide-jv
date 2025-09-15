// netlify/functions/load.js (CommonJS)
const { createClient } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "GET") {
      return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    const id = (event.queryStringParameters && event.queryStringParameters.id) || "host1";

    const client = createClient({
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });

    const store = client.store("guides");
    const latest = await store.getJSON(id); // null if not found

    return {
      statusCode: 200,
      body: JSON.stringify({ id, latest }),
      headers: { "content-type": "application/json" },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ errorType: err.name, errorMessage: err.message, stack: err.stack }),
      headers: { "content-type": "application/json" },
    };
  }
};
