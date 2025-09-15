// CommonJS – force options into getStore and support both siteID/siteId
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    const id = event.queryStringParameters?.id || "host1";

    const siteID = process.env.NETLIFY_SITE_ID;
    const token  = process.env.NETLIFY_AUTH_TOKEN;

    let store;
    try {
      store = getStore("guides", { siteID, token });
    } catch (e1) {
      store = getStore("guides", { siteId: siteID, token });
    }

    const latest = await store.getJSON(id); // null if not found

    // Optional: debug flags
    if (event.queryStringParameters?.debug === "1") {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json", "cache-control": "no-store" },
        body: JSON.stringify({ id, hasSiteID: !!siteID, hasToken: !!token, latest: latest || null })
      };
    }

    return {
      statusCode: latest ? 200 : 404,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify({ id, latest: latest || null })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ errorType: err.name, errorMessage: err.message })
    };
  }
};
