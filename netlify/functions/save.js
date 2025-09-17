import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

export async function handler(event) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    const body = event.body ? JSON.parse(event.body) : {};
    // accept id from query OR body
    const id = (event.queryStringParameters && event.queryStringParameters.id) || body.id;
    const data = body.data ?? body; // allow {data:{...}} or raw {...}

    if (!id || !data) return { statusCode: 400, body: JSON.stringify({ error: 'Missing id or data' }) };

    const { error } = await supabase
      .from('guides')
      .upsert({ id, data, updated_at: new Date().toISOString() });

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ ok: true, id })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
