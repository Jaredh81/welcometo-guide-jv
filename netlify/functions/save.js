import { getStore } from "@netlify/blobs";

export async function handler(event) {
  try {
    const store = getStore({
      name: "guides",
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      await store.setJSON("guide.json", body);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Saved!", data: body }),
      };
    }

    if (event.httpMethod === "GET") {
      const latest = await store.getJSON("guide.json");
      return {
        statusCode: 200,
        body: JSON.stringify({ latest }),
      };
    }

    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
