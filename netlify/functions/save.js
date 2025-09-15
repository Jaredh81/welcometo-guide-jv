// CommonJS version for @netlify/blobs v10+
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const id = event.queryStringParameters?.id || "host1";
    const data = JSON.parse(event.body || "{}");

    // Pass env vars explicitly (works in all contexts)
    const store = getStore("guides", {
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });

    await store.setJSON(id, data);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify({ message: "Saved!", id, data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ errorType: err.name, errorMessage: err.message }),
    };
  }
};
