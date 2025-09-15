const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  const id =
    (event.queryStringParameters && event.queryStringParameters.id) || "host1";

  const store = getStore("guides"); // no manual token/siteID passed
  const latest = await store.getJSON(id);

  if (!latest) {
    return {
      statusCode: 404,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify({ id, latest: null }),
    };
  }

  return {
    statusCode: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify({ id, latest }),
  };
};
