const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const id = event.queryStringParameters?.id || "host1";

  const store = getStore("guides");        // uses your env automatically
  const latest = await store.getJSON(id);  // returns null if not found

  return {
    statusCode: latest ? 200 : 404,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify({ id, latest: latest || null }),
  };
};
