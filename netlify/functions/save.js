export const handler = async () => {
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      siteID: !!process.env.NETLIFY_SITE_ID,
      token: !!process.env.NETLIFY_AUTH_TOKEN
    })
  };
};
