import { blobs } from "@netlify/blobs";

export const handler = async (event) => {
  try {
    // Hard-coded values (⚠️ only for testing!)
    const siteID = "ceb7e2c6-43f6-41f2-8cec-1455df7bb177"; // your Site ID
    const token = "nfp_XXXXXXXXXXXXXXXXXXXXXXXXXXXX";      // your personal token

    // Create a store
    const store = blobs({ name: "guides", siteID, token });

    // Parse incoming body
    const body = JSON.parse(event.body);

    // Save data (just overwrites "latest" each time for now)
    await store.setJSON("latest", body);

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, saved: body }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
