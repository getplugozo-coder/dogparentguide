// ============================================================
// DogParentGuide - Sitemap & RSS Generator
// Run before build: node scripts/generate-xml.js
// ============================================================

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const SITE_URL = 'https://dogparentguide.com';

// Parse the articles data from the TypeScript source
function extractArticles() {
  const content = readFileSync(resolve(root, 'src/data/articles.ts'), 'utf-8');
  const articles = [];
  const slugRegex = /slug:\s*'([^']+)'/g;
  const titleRegex = /title:\s*'([^']+)'/g;
  const dateRegex = /published_date:\s*'([^']+)'/g;
  const excerptRegex = /excerpt:\s*'([^']+)'/g;
  const catRegex = /category:\s*'([^']+)'/g;
  const updatedRegex = /updated_date:\s*'([^']+)'/g;
  const slugs = extractAll(content, slugRegex);
  const titles = extractAll(content, titleRegex);
  const dates = extractAll(content, dateRegex);
  const excerpts = extractAll(content, excerptRegex);
  const cats = extractAll(content, catRegex);
  const updates = extractAll(content, updatedRegex);

  for (let i = 0; i < slugs.length; i++) {
    articles.push({
      slug: slugs[i],
      title: titles[i] || '',
      published_date: dates[i] || '2024-01-01',
      updated_date: updates[i] || dates[i] || '2024-01-01',
      excerpt: excerpts[i] || '',
      category: cats[i] || '',
    });
  }
  return articles;
}

function extractAll(text, regex) {
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    results.push(match[1]);
  }
  return results;
}

const articles = extractArticles();

// ─── Generate sitemap.xml ──────────────────────────────────
function generateSitemap() {
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/about', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.5', changefreq: 'monthly' },
    { loc: '/search', priority: '0.6', changefreq: 'weekly' },
    { loc: '/newsletter', priority: '0.6', changefreq: 'monthly' },
    { loc: '/sitemap', priority: '0.4', changefreq: 'monthly' },
    { loc: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
    { loc: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
    { loc: '/affiliate-disclosure', priority: '0.3', changefreq: 'yearly' },
    { loc: '/editorial-policy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/dmca', priority: '0.3', changefreq: 'yearly' },
  ];

  const categories = [ 'nutrition', 'training', 'health', 'grooming', 'breeds', 'puppy-care' ];
  categories.forEach(cat => {
    urls.push({ loc: `/category/${cat}`, priority: '0.8', changefreq: 'weekly' });
  });

  articles.forEach(a => {
    urls.push({
      loc: `/articles/${a.slug}`,
      priority: '0.9',
      changefreq: 'monthly',
      lastmod: a.updated_date,
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
${urls.map(u => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    ${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  writeFileSync(resolve(root, 'public/sitemap.xml'), xml, 'utf-8');
  console.log('✅ Generated public/sitemap.xml');
}

// ─── Generate rss.xml ──────────────────────────────────────
function generateRSS() {
  const items = articles.slice(0, 20).map(a => `
  <item>
    <title><![CDATA[${a.title}]]></title>
    <link>${SITE_URL}/articles/${a.slug}</link>
    <guid>${SITE_URL}/articles/${a.slug}</guid>
    <description><![CDATA[${a.excerpt}]]></description>
    <pubDate>${new Date(a.published_date).toUTCString()}</pubDate>
    <category>${a.category}</category>
  </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>DogParentGuide</title>
    <link>${SITE_URL}</link>
    <description>Expert advice for every dog parent. Nutrition, training, health, grooming, and breed guides from veterinarians and certified professionals.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/images/logo.png</url>
      <title>DogParentGuide</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  writeFileSync(resolve(root, 'public/rss.xml'), xml, 'utf-8');
  console.log('✅ Generated public/rss.xml');
}

// ─── Generate robots.txt (append sitemap + rss) ────────────
function updateRobots() {
  const existing = readFileSync(resolve(root, 'public/robots.txt'), 'utf-8');
  if (!existing.includes('rss.xml')) {
    const updated = existing + `\n# RSS Feed\nSitemap: ${SITE_URL}/rss.xml\n`;
    writeFileSync(resolve(root, 'public/robots.txt'), updated, 'utf-8');
    console.log('✅ Updated public/robots.txt with RSS feed link');
  }
}

generateSitemap();
generateRSS();
updateRobots();
console.log('\n🎉 XML generation complete! Run `npm run build` to deploy.');
