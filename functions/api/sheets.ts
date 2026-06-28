// Cloudflare Pages Function - Google Sheets API Proxy
// Deploys automatically with `npm run build` → Cloudflare Pages

interface Env {
  SHEETS_API_KEY: string;
  SHEETS_ID: string;
  ADMIN_PASSWORD: string;
}

const VALID_RANGES = [
  'Articles', 'Categories', 'Authors', 'Menus',
  'HomepageSections', 'Ads', 'SEO', 'LegalPages',
  'Footer', 'SocialLinks', 'Settings', 'FeaturedPosts',
  'TrendingPosts', 'Newsletter',
];

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const range = url.searchParams.get('range') || '';

  // CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Validate range
  const sheetName = range.split('!')[0];
  if (!VALID_RANGES.some(r => sheetName.startsWith(r)) && !sheetName.includes('!')) {
    return new Response(JSON.stringify({ error: 'Invalid range' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  // ─── GET: Read from Google Sheets ─────────────────────
  if (request.method === 'GET') {
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.SHEETS_ID}/values/${encodeURIComponent(range)}?key=${env.SHEETS_API_KEY}`;

    try {
      const res = await fetch(sheetsUrl, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);
      const data = await res.json();

      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  // ─── POST: Write to Google Sheets (requires auth) ────
  if (request.method === 'POST') {
    const auth = request.headers.get('Authorization');
    if (!auth || !auth.startsWith('Bearer ') || auth.slice(7) !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    try {
      const body: { range: string; values: string[][] } = await request.json();
      if (!body.range || !body.values) {
        return new Response(JSON.stringify({ error: 'Missing range or values' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      // Try to append (for new rows) or update (for existing)
      const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.SHEETS_ID}/values/${encodeURIComponent(body.range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${env.SHEETS_API_KEY}`;

      const res = await fetch(appendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: body.values }),
      });

      if (!res.ok) throw new Error(`Sheets write error: ${res.status}`);
      const data = await res.json();

      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  return new Response('Method not allowed', { status: 405 });
};
