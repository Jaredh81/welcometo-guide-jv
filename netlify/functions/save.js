const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const id =
    (event.queryStringParameters && event.queryStringParameters.id) || "host1";
  const data = JSON.parse(event.body || "{}");

  const store = getStore("guides"); // uses Netlify env internally; no token in code
  await store.setJSON(id, data);

  return {
    statusCode: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify({ message: "Saved!", id, data }),
  };
};
