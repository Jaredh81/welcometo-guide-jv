// netlify/functions/save.js
import { getStore } from "@netlify/blobs";

export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  const id = (event.queryStringParameters?.id || "host1").trim();

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Bad JSON" }) };
  }

  try {
    // Uses Netlify’s native env (no token/site id needed)
    const store = getStore("guides");
    await store.setJSON(id, data);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Saved!", id, data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: err.name || "Error", detail: err.message }),
    };
  }
}
