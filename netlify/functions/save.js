import { createClient } from "@netlify/blobs";

const client = createClient();

export async function handler(event) {
  try {
    const { id } = event.queryStringParameters;
    const data = JSON.parse(event.body);

    const store = client.store("guides");
    await store.setJSON(id, data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved!", id })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
