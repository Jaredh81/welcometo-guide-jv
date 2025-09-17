import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function handler(event) {
  try {
    const id = event.queryStringParameters && event.queryStringParameters.id;
    if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'Missing id' }) };

    const { data, error } = await supabase
      .from('guides')
      .select('data, updated_at')
      .eq('id', id)
      .single();

    if (error) return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify(data) // { data: {...}, updated_at: ... }
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
