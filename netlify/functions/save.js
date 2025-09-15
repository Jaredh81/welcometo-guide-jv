// CommonJS – force options into getStore and support both siteID/siteId
const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const id = event.queryStringParameters?.id || "host1";
    const data = JSON.parse(event.body || "{}");

    const siteID = process.env.NETLIFY_SITE_ID;
    const token  = process.env.NETLIFY_AUTH_TOKEN;

    let store;
    try {
      store = getStore("guides", { siteID, token });
    } catch (e1) {
      // some SDK builds expect siteId (lowercase d)
      store = getStore("guides", { siteId: siteID, token });
    }

    await store.setJSON(id, data);

    // Optional: lightweight debug flags (no secrets)
    if (event.queryStringParameters?.debug === "1") {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json", "cache-control": "no-store" },
        body: JSON.stringify({ message: "Saved!", id, hasSiteID: !!siteID, hasToken: !!token })
      };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify({ message: "Saved!", id })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ errorType: err.name, errorMessage: err.message })
    };
  }
};
