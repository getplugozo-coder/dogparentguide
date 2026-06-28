// DogParentGuide - Worker API with D1 Database

export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD: string;
}

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...CORS } });
}

function auth(request: Request, env: Env) {
  const h = request.headers.get('Authorization');
  return h && h.startsWith('Bearer ') && h.slice(7) === env.ADMIN_PASSWORD;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');

    // ─── PUBLIC: GET articles ───
    if (path === '/api/articles' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        "SELECT id, title, slug, excerpt, featured_image, category_id, author_id, tags, reading_time, published_date, status, featured, trending, views, meta_title, meta_description, created_at, updated_at FROM articles WHERE status = 'published' ORDER BY published_date DESC"
      ).all();
      return json(results);
    }

    if (path === '/api/articles/all' && request.method === 'GET') {
      const { results } = await env.DB.prepare("SELECT * FROM articles ORDER BY published_date DESC").all();
      return json(results);
    }

    if (path.match(/^\/api\/articles\/(.+)$/) && request.method === 'GET') {
      const slug = path.match(/^\/api\/articles\/(.+)$/)?.[1];
      const article = await env.DB.prepare("SELECT * FROM articles WHERE slug = ?").bind(slug).first();
      return json(article || { error: 'Not found' }, article ? 200 : 404);
    }

    // ─── PUBLIC: GET categories ───
    if (path === '/api/categories' && request.method === 'GET') {
      const { results } = await env.DB.prepare("SELECT * FROM categories ORDER BY sort_order ASC").all();
      return json(results);
    }

    // ─── PUBLIC: GET authors ───
    if (path === '/api/authors' && request.method === 'GET') {
      const { results } = await env.DB.prepare("SELECT * FROM authors ORDER BY name ASC").all();
      return json(results);
    }

    // ─── PUBLIC: GET settings ───
    if (path === '/api/settings' && request.method === 'GET') {
      const { results } = await env.DB.prepare("SELECT key, value FROM settings").all();
      const obj: Record<string, string> = {};
      results.forEach((r: any) => obj[r.key] = r.value);
      return json(obj);
    }

    // ─── PUBLIC: GET ads (active only) ───
    if (path === '/api/ads' && request.method === 'GET') {
      const { results } = await env.DB.prepare("SELECT * FROM ads WHERE active = 1").all();
      return json(results);
    }

    // ═══════════════════════════════════════════
    //  ADMIN: Protected routes below
    // ═══════════════════════════════════════════

    if (!auth(request, env)) {
      return json({ error: 'Unauthorized' }, 401);
    }

    // ─── ADMIN: CRUD articles ───
    if (path === '/api/admin/articles' && request.method === 'POST') {
      const body: any = await request.json();
      const { id, title, slug, excerpt, content, featured_image, category_id, author_id, tags, reading_time, published_date, status, featured, trending, meta_title, meta_description } = body;
      await env.DB.prepare(
        `INSERT INTO articles (id, title, slug, excerpt, content, featured_image, category_id, author_id, tags, reading_time, published_date, status, featured, trending, meta_title, meta_description, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(id) DO UPDATE SET title=excluded.title, slug=excluded.slug, excerpt=excluded.excerpt, content=excluded.content, featured_image=excluded.featured_image, category_id=excluded.category_id, author_id=excluded.author_id, tags=excluded.tags, reading_time=excluded.reading_time, published_date=excluded.published_date, status=excluded.status, featured=excluded.featured, trending=excluded.trending, meta_title=excluded.meta_title, meta_description=excluded.meta_description, updated_at=datetime('now')`
      ).bind(id, title, slug, excerpt || '', content || '', featured_image || '', category_id || '', author_id || '', JSON.stringify(tags || []), reading_time || 5, published_date || '', status || 'draft', featured ? 1 : 0, trending ? 1 : 0, meta_title || '', meta_description || '').run();
      return json({ success: true });
    }

    if (path.match(/^\/api\/admin\/articles\/(.+)$/) && request.method === 'DELETE') {
      const id = path.match(/^\/api\/admin\/articles\/(.+)$/)?.[1];
      await env.DB.prepare("DELETE FROM articles WHERE id = ?").bind(id).run();
      return json({ success: true });
    }

    // ─── ADMIN: CRUD categories ───
    if (path === '/api/admin/categories' && request.method === 'POST') {
      const body: any = await request.json();
      await env.DB.prepare(
        "INSERT INTO categories (id, name, slug, description, icon, color, image, sort_order, meta_title, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, slug=excluded.slug, description=excluded.description, icon=excluded.icon, color=excluded.color, image=excluded.image, sort_order=excluded.sort_order, meta_title=excluded.meta_title, meta_description=excluded.meta_description"
      ).bind(body.id, body.name, body.slug, body.description || '', body.icon || '📂', body.color || '#22c55e', body.image || '', body.sort_order || 0, body.meta_title || '', body.meta_description || '').run();
      return json({ success: true });
    }

    if (path.match(/^\/api\/admin\/categories\/(.+)$/) && request.method === 'DELETE') {
      const id = path.match(/^\/api\/admin\/categories\/(.+)$/)?.[1];
      await env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();
      return json({ success: true });
    }

    // ─── ADMIN: CRUD authors ───
    if (path === '/api/admin/authors' && request.method === 'POST') {
      const body: any = await request.json();
      await env.DB.prepare(
        "INSERT INTO authors (id, name, slug, bio, avatar, role, credentials, email, twitter, instagram, facebook) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, slug=excluded.slug, bio=excluded.bio, avatar=excluded.avatar, role=excluded.role, credentials=excluded.credentials, email=excluded.email, twitter=excluded.twitter, instagram=excluded.instagram, facebook=excluded.facebook"
      ).bind(body.id, body.name, body.slug, body.bio || '', body.avatar || '', body.role || '', body.credentials || '', body.email || '', body.twitter || '', body.instagram || '', body.facebook || '').run();
      return json({ success: true });
    }

    if (path.match(/^\/api\/admin\/authors\/(.+)$/) && request.method === 'DELETE') {
      const id = path.match(/^\/api\/admin\/authors\/(.+)$/)?.[1];
      await env.DB.prepare("DELETE FROM authors WHERE id = ?").bind(id).run();
      return json({ success: true });
    }

    // ─── ADMIN: CRUD ads ───
    if (path === '/api/admin/ads' && request.method === 'POST') {
      const body: any = await request.json();
      await env.DB.prepare(
        "INSERT INTO ads (id, name, type, code, placement, active, start_date, end_date, pages) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, type=excluded.type, code=excluded.code, placement=excluded.placement, active=excluded.active, start_date=excluded.start_date, end_date=excluded.end_date, pages=excluded.pages"
      ).bind(body.id, body.name, body.type || 'custom', body.code || '', body.placement, body.active ? 1 : 0, body.start_date || '', body.end_date || '', body.pages || 'all').run();
      return json({ success: true });
    }

    if (path.match(/^\/api\/admin\/ads\/(.+)$/) && request.method === 'DELETE') {
      const id = path.match(/^\/api\/admin\/ads\/(.+)$/)?.[1];
      await env.DB.prepare("DELETE FROM ads WHERE id = ?").bind(id).run();
      return json({ success: true });
    }

    // ─── ADMIN: Update settings ───
    if (path === '/api/admin/settings' && request.method === 'POST') {
      const body: Record<string, string> = await request.json();
      for (const [key, value] of Object.entries(body)) {
        await env.DB.prepare("INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=datetime('now')").bind(key, value).run();
      }
      return json({ success: true });
    }

    // ─── ADMIN: Export all data ───
    if (path === '/api/admin/export' && request.method === 'GET') {
      const [articles, categories, authors, ads, settings] = await Promise.all([
        env.DB.prepare("SELECT * FROM articles").all(),
        env.DB.prepare("SELECT * FROM categories").all(),
        env.DB.prepare("SELECT * FROM authors").all(),
        env.DB.prepare("SELECT * FROM ads").all(),
        env.DB.prepare("SELECT key, value FROM settings").all(),
      ]);
      return json({ articles: articles.results, categories: categories.results, authors: authors.results, ads: ads.results, settings: settings.results });
    }

    // ─── ADMIN: Import all data ───
    if (path === '/api/admin/import' && request.method === 'POST') {
      const data: any = await request.json();
      if (data.articles) for (const a of data.articles) {
        await env.DB.prepare("INSERT OR REPLACE INTO articles (id, title, slug, excerpt, content, featured_image, category_id, author_id, tags, reading_time, published_date, status, featured, trending, views, meta_title, meta_description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(a.id, a.title, a.slug, a.excerpt, a.content, a.featured_image, a.category_id, a.author_id, JSON.stringify(a.tags || []), a.reading_time, a.published_date, a.status, a.featured ? 1 : 0, a.trending ? 1 : 0, a.views || 0, a.meta_title, a.meta_description).run();
      }
      if (data.categories) for (const c of data.categories) {
        await env.DB.prepare("INSERT OR REPLACE INTO categories (id, name, slug, description, icon, color, image, sort_order) VALUES (?,?,?,?,?,?,?,?)").bind(c.id, c.name, c.slug, c.description, c.icon, c.color, c.image, c.sort_order).run();
      }
      if (data.authors) for (const a of data.authors) {
        await env.DB.prepare("INSERT OR REPLACE INTO authors (id, name, slug, bio, avatar, role, credentials, email, twitter, instagram, facebook) VALUES (?,?,?,?,?,?,?,?,?,?,?)").bind(a.id, a.name, a.slug, a.bio, a.avatar, a.role, a.credentials, a.email, a.twitter, a.instagram, a.facebook).run();
      }
      if (data.ads) for (const a of data.ads) {
        await env.DB.prepare("INSERT OR REPLACE INTO ads (id, name, type, code, placement, active, start_date, end_date, pages) VALUES (?,?,?,?,?,?,?,?,?)").bind(a.id, a.name, a.type, a.code, a.placement, a.active ? 1 : 0, a.start_date, a.end_date, a.pages).run();
      }
      return json({ success: true });
    }

    return json({ error: 'Not found' }, 404);
  },
};
