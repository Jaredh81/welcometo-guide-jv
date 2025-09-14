import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  try {
    const guideId = event.queryStringParameters.id;
    if (!guideId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing id" }),
      };
    }

    const store = getStore("guides");
    const data = await store.get(guideId);

    if (!data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Guide not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
