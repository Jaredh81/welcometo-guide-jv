import { getStore } from "@netlify/blobs";

export async function handler(event) {
  const store = getStore({
    name: "guides",
    siteID: "e7e9d9c6-beb2-46a2-9d85-a094088467e6",   // your site ID
    token: "nfp_fHc585NwVggk6hGWxtgRYaGMvoaE1VgCb2dd",                 // <-- replace with new token
  });

  if (event.httpMethod === "POST") {
    const id = event.queryStringParameters.id || "default";
    const body = JSON.parse(event.body || "{}");
    await store.set("guides/" + id + ".json", JSON.stringify(body), {
      type: "text",
      contentType: "application/json",
    });
    return { statusCode: 200, body: JSON.stringify({ message: "Saved!", id, data: body }) };
  }

  if (event.httpMethod === "GET") {
    const id = event.queryStringParameters.id || "default";
    const text = await store.get("guides/" + id + ".json", { type: "text" }).catch(() => null);
    return { statusCode: 200, body: JSON.stringify({ id, latest: text ? JSON.parse(text) : null }) };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
}
