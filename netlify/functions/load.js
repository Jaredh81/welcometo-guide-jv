// CommonJS version for @netlify/blobs v10+
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    const id = event.queryStringParameters?.id || "host1";

    const store = getStore("guides", {
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });

    const latest = await store.getJSON(id); // null if not found

    return {
      statusCode: latest ? 200 : 404,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify({ id, latest: latest || null }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ errorType: err.name, errorMessage: err.message }),
    };
  }
};
