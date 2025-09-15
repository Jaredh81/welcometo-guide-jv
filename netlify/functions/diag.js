// netlify/functions/diag.js
export async function handler() {
  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      node: process.version,
      // These being false is OK when using getStore()
      hasSiteId: !!process.env.NETLIFY_SITE_ID,
      hasToken: !!process.env.NETLIFY_AUTH_TOKEN,
    }),
  };
}
