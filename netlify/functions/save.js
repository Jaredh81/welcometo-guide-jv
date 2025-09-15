// netlify/functions/save.js (CommonJS)
const { createClient } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    const idFromQuery = (event.queryStringParameters && event.queryStringParameters.id) || "";
    const body = event.body ? JSON.parse(event.body) : {};
    const id = idFromQuery || body.id || "host1";
    const data = body.data || body;

    const client = createClient({
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });

    const store = client.store("guides");
    await store.setJSON(id, data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved!", id, data }),
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
