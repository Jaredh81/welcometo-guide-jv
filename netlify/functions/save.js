import { getStore } from "@netlify/blobs";

export async function handler(event) {
  const store = getStore({
    name: "guides",
    siteID: "e7e9d9c6-beb2-46a2-9d85-a094088467e6", // your site ID
    token: "nfp_xxxxxxx", // your personal auth token
  });

  if (event.httpMethod === "POST") {
    const id = event.queryStringParameters.id || "default";
    const body = JSON.parse(event.body);

    await store.setJSON(id, body);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved!", id, data: body }),
    };
  }

  if (event.httpMethod === "GET") {
    const id = event.queryStringParameters.id || "default";
    const latest = await store.getJSON(id);
    return {
      statusCode: 200,
      body: JSON.stringify({ id, latest }),
    };
  }

  return { statusCode: 405, body: "Method not allowed" };
}
