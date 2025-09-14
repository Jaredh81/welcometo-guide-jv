import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  const store = getStore({ name: "guides" });

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body);

      // Save the data under "latest"
      await store.setJSON("latest", body);

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Saved!",
          data: body
        }),
      };
    } catch (err) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  if (event.httpMethod === "GET") {
    try {
      const latest = await store.getJSON("latest");
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Fetched latest",
          latest_raw: latest
        }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: err.message }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Method Not Allowed" }),
  };
};
