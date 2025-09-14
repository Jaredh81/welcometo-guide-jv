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
      // save as JSON string explicitly
      await store.set("guide.json", JSON.stringify(body), {
        contentType: "application/json",
      });
      return { statusCode: 200, body: JSON.stringify({ message: "Saved!", data: body }) };
    }

    if (event.httpMethod === "GET") {
      // read raw text, then JSON.parse ourselves
      const text = await store.get("guide.json", { type: "text" });
      const latest = text ? JSON.parse(text) : null;
      return { statusCode: 200, body: JSON.stringify({ latest }) };
    }

    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
