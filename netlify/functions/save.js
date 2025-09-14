import { getStore } from "@netlify/blobs";

export async function handler(event) {
  try {
    const store = getStore({
      name: "guides", // choose a store name
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_AUTH_TOKEN,
    });

    const body = JSON.parse(event.body);

    await store.setJSON("guide.json", body);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved!", data: body }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
