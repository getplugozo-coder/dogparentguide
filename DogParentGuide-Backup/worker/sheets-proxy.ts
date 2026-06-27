// ============================================================
// DogParentGuide - Cloudflare Worker: Google Sheets Proxy
// ============================================================
// This Cloudflare Worker acts as a secure proxy for Google Sheets API.
// It keeps your API key server-side and adds caching for performance.
//
// DEPLOYMENT:
// 1. Install Wrangler: npm install -g wrangler
// 2. Authenticate: wrangler login
// 3. Set secrets: wrangler secret put SHEETS_API_KEY
// 4. Set secrets: wrangler secret put SHEETS_ID
// 5. Deploy: wrangler deploy
//
// The worker URL should be set as VITE_CLOUDFLARE_WORKER_URL
// ============================================================

export interface Env {
  SHEETS_API_KEY: string;
  SHEETS_ID: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://dogparentguide.com',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CACHE_TTL = 300; // 5 minutes cache

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const range = url.searchParams.get('range');

    if (!range) {
      return new Response(JSON.stringify({ error: 'Missing range parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // Validate range parameter to prevent abuse
    const validRanges = [
      'Articles', 'Categories', 'Authors', 'Menus',
      'HomepageSections', 'Ads', 'SEO', 'LegalPages',
      'Footer', 'SocialLinks', 'Settings', 'FeaturedPosts',
      'TrendingPosts', 'Newsletter',
    ];

    const sheetName = range.split('!')[0];
    if (!validRanges.some(r => sheetName.startsWith(r))) {
      return new Response(JSON.stringify({ error: 'Invalid range' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    // Check cache first
    const cache = caches.default;
    const cacheKey = new Request(`https://cache.dogparentguide.com/sheets/${encodeURIComponent(range)}`);
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      return new Response(cachedResponse.body, {
        headers: {
          ...Object.fromEntries(cachedResponse.headers),
          ...CORS_HEADERS,
          'X-Cache': 'HIT',
        },
      });
    }

    // Fetch from Google Sheets API
    const sheetsUrl = new URL(
      `https://sheets.googleapis.com/v4/spreadsheets/${env.SHEETS_ID}/values/${encodeURIComponent(range)}`
    );
    sheetsUrl.searchParams.set('key', env.SHEETS_API_KEY);

    try {
      const sheetsResponse = await fetch(sheetsUrl.toString(), {
        headers: { 'Accept': 'application/json' },
        cf: { cacheTtl: CACHE_TTL, cacheEverything: true },
      });

      if (!sheetsResponse.ok) {
        throw new Error(`Sheets API error: ${sheetsResponse.status}`);
      }

      const data = await sheetsResponse.json();
      const responseBody = JSON.stringify(data);

      const response = new Response(responseBody, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${CACHE_TTL}`,
          ...CORS_HEADERS,
          'X-Cache': 'MISS',
        },
      });

      // Store in cache
      await cache.put(cacheKey, response.clone());

      return response;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch data', details: String(error) }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        }
      );
    }
  },
};
