// ============================================================
// DogParentGuide - Cloudflare Worker: Google Sheets Proxy
// Supports: GET (read) + POST/PUT/DELETE (write via service account)
// ============================================================

export interface Env {
  SHEETS_API_KEY: string;
  SHEETS_ID: string;
  // For write operations (service account JWT)
  SHEETS_SERVICE_ACCOUNT_EMAIL?: string;
  SHEETS_SERVICE_ACCOUNT_PRIVATE_KEY?: string;
  // Admin auth
  ADMIN_PASSWORD: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const CACHE_TTL = 300;
const VALID_RANGES = [
  'Articles', 'Categories', 'Authors', 'Menus',
  'HomepageSections', 'Ads', 'SEO', 'LegalPages',
  'Footer', 'SocialLinks', 'Settings', 'FeaturedPosts',
  'TrendingPosts', 'Newsletter',
];

function verifyAuth(request: Request, env: Env): boolean {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return auth.slice(7) === env.ADMIN_PASSWORD;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const range = url.searchParams.get('range');

    // ─── READ: GET /api/sheets?range=Articles ─────────────
    if (request.method === 'GET') {
      if (!range) {
        return new Response(JSON.stringify({ error: 'Missing range parameter' }), {
          status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }

      // Validate range
      const sheetName = range.split('!')[0];
      if (!VALID_RANGES.some(r => sheetName.startsWith(r))) {
        return new Response(JSON.stringify({ error: 'Invalid range' }), {
          status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }

      // Cache check
      const cache = caches.default;
      const cacheKey = new Request(`https://cache/sheets/${encodeURIComponent(range)}`);
      const cached = await cache.match(cacheKey);
      if (cached) {
        return new Response(cached.body, {
          headers: { ...Object.fromEntries(cached.headers), ...CORS_HEADERS, 'X-Cache': 'HIT' },
        });
      }

      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.SHEETS_ID}/values/${encodeURIComponent(range)}?key=${env.SHEETS_API_KEY}`;

      try {
        const res = await fetch(sheetsUrl, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error(`Sheets API error: ${res.status}`);
        const data = await res.json();
        const response = new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${CACHE_TTL}`, ...CORS_HEADERS, 'X-Cache': 'MISS' },
        });
        _ctx.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
      } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), {
          status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
    }

    // ─── WRITE: POST /api/sheets (requires auth) ──────────
    if (request.method === 'POST' || request.method === 'PUT') {
      if (!verifyAuth(request, env)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }

      try {
        const body: { range: string; values: string[][] } = await request.json();

        if (!body.range || !body.values) {
          return new Response(JSON.stringify({ error: 'Missing range or values' }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          });
        }

        // Use service account if configured, otherwise try API key (append only)
        // For write operations, you need OAuth 2.0 or a service account
        if (env.SHEETS_SERVICE_ACCOUNT_EMAIL && env.SHEETS_SERVICE_ACCOUNT_PRIVATE_KEY) {
          const accessToken = await getAccessToken(
            env.SHEETS_SERVICE_ACCOUNT_EMAIL,
            env.SHEETS_SERVICE_ACCOUNT_PRIVATE_KEY
          );

          const method = request.method === 'PUT' ? 'update' : 'append';
          const sheetsUrl = method === 'update'
            ? `https://sheets.googleapis.com/v4/spreadsheets/${env.SHEETS_ID}/values/${encodeURIComponent(body.range)}?valueInputOption=USER_ENTERED`
            : `https://sheets.googleapis.com/v4/spreadsheets/${env.SHEETS_ID}/values/${encodeURIComponent(body.range)}:append?valueInputOption=USER_ENTERED`;

          const res = await fetch(sheetsUrl, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ values: body.values }),
          });

          if (!res.ok) throw new Error(`Sheets write error: ${res.status}`);
          const data = await res.json();

          // Invalidate cache
          const cache = caches.default;
          const cacheKey = new Request(`https://cache/sheets/${encodeURIComponent(body.range)}`);
          await cache.delete(cacheKey);

          return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          });
        } else {
          return new Response(JSON.stringify({
            error: 'Write operations require SHEETS_SERVICE_ACCOUNT_EMAIL and SHEETS_SERVICE_ACCOUNT_PRIVATE_KEY',
            hint: 'Set these as Worker secrets, or manually edit the Google Sheet directly.',
          }), {
            status: 501, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          });
        }
      } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), {
          status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
    }

    // ─── DELETE: DELETE /api/sheets (requires auth) ───────
    if (request.method === 'DELETE') {
      if (!verifyAuth(request, env)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
      return new Response(JSON.stringify({ error: 'Delete requires batchUpdate with service account. Use the Google Sheet directly or a future update.' }), {
        status: 501, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    return new Response('Not found', { status: 404, headers: CORS_HEADERS });
  },
};

// Get OAuth 2.0 access token using a service account JWT
async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const b64encode = (obj: any) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const message = `${b64encode(header)}.${b64encode(claim)}`;

  // Web Crypto API for RSA-SHA256 signing
  const keyData = str2ab(privateKey);
  const key = await crypto.subtle.importKey(
    'pkcs8', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  );
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(message));
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${message}.${signatureB64}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data: any = await res.json();
  return data.access_token;
}

function str2ab(str: string): ArrayBuffer {
  const binary = atob(str.replace(/\\n/g, '').replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
