import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const guideId = event.queryStringParameters.id;
    if (!guideId) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing id" }) };
    }

    const body = JSON.parse(event.body || "{}");
    if (!body) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing body" }) };
    }

    const store = getStore("guides");
    await store.setJSON(guideId, { latest: body });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Saved!",
        id: guideId,
        data: body,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
