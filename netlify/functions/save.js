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
      // Save as proper JSON
      await store.set("guide.json", body, { type: "json" });
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "Saved!", data: body }),
      };
    }

    if (event.httpMethod === "GET") {
      // Read back as JSON
      const latest = await store.get("guide.json", { type: "json" });
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ latest }),
      };
    }

    return {
      statusCode: 405,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
