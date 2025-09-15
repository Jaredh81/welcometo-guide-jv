// netlify/functions/load.js
import { getStore } from "@netlify/blobs";

export async function handler(event) {
  // Only allow GET
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  const id = (event.queryStringParameters?.id || "host1").trim();

  try {
    const store = getStore("guides");
    const data = await store.getJSON(id); // null if not found

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, latest: data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: err.name || "Error", detail: err.message }),
    };
  }
}
