export const handler = async () => {
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      debug: "Env values inside function",
      siteID: process.env.NETLIFY_SITE_ID || null,
      token: process.env.NETLIFY_AUTH_TOKEN ? "present" : "missing"
    })
  }
}
