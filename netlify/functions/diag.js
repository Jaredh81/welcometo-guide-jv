// netlify/functions/diag.js
exports.handler = async () => ({
  statusCode: 200,
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    hasSiteId: !!process.env.NETLIFY_SITE_ID,
    hasToken: !!process.env.NETLIFY_AUTH_TOKEN,
    node: process.version,
  }),
});
