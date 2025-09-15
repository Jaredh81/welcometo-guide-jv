// netlify/functions/diag.js
exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify({
      hasSiteId: Boolean(process.env.NETLIFY_SITE_ID),
      hasToken: Boolean(process.env.NETLIFY_AUTH_TOKEN),
      node: process.version
    })
  };
};
