// ============================================================
// DogParentGuide - Utility Helper Functions
// ============================================================

import { format, parseISO, formatDistanceToNow } from 'date-fns';
import type { Article } from '../data/types';

// Format date for display
export function formatDate(dateString: string, formatStr = 'MMMM d, yyyy'): string {
  try {
    return format(parseISO(dateString), formatStr);
  } catch {
    return dateString;
  }
}

// Format relative date
export function formatRelativeDate(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Slugify text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Get reading time text
export function getReadingTimeText(minutes: number): string {
  return `${minutes} min read`;
}

// Get related articles
export function getRelatedArticles(
  currentArticle: Article,
  allArticles: Article[],
  limit = 3
): Article[] {
  return allArticles
    .filter(a => a.id !== currentArticle.id && a.status === 'published')
    .map(a => ({
      article: a,
      score: calculateRelevanceScore(currentArticle, a),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.article);
}

function calculateRelevanceScore(current: Article, candidate: Article): number {
  let score = 0;
  if (current.category === candidate.category) score += 10;
  const sharedTags = current.tags.filter(tag => candidate.tags.includes(tag));
  score += sharedTags.length * 3;
  if (current.author === candidate.author) score += 2;
  return score;
}

// Get articles by category
export function getArticlesByCategory(articles: Article[], categorySlug: string): Article[] {
  return articles.filter(a => a.category === categorySlug && a.status === 'published');
}

// Get articles by tag
export function getArticlesByTag(articles: Article[], tag: string): Article[] {
  return articles.filter(a => a.tags.includes(tag) && a.status === 'published');
}

// Get articles by author
export function getArticlesByAuthor(articles: Article[], authorSlug: string): Article[] {
  return articles.filter(a => a.author === authorSlug && a.status === 'published');
}

// Get featured articles
export function getFeaturedArticles(articles: Article[], limit = 5): Article[] {
  return articles.filter(a => a.featured && a.status === 'published').slice(0, limit);
}

// Get trending articles
export function getTrendingArticles(articles: Article[], limit = 5): Article[] {
  return articles.filter(a => a.trending && a.status === 'published').slice(0, limit);
}

// Get latest articles
export function getLatestArticles(articles: Article[], limit = 9): Article[] {
  return [...articles]
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
    .slice(0, limit);
}

// Get popular articles by views
export function getPopularArticles(articles: Article[], limit = 5): Article[] {
  return [...articles]
    .filter(a => a.status === 'published')
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
}

// Generate table of contents from HTML content
export function generateTOC(htmlContent: string): Array<{ id: string; title: string; level: number }> {
  const headingRegex = /<h([2-4])[^>]*>(.*?)<\/h[2-4]>/gi;
  const toc: Array<{ id: string; title: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10);
    const title = match[2].replace(/<[^>]*>/g, '');
    const id = slugify(title);
    toc.push({ id, title, level });
  }

  return toc;
}

// Add IDs to headings in HTML content
export function addHeadingIds(htmlContent: string): string {
  return htmlContent.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h[2-4]>/gi,
    (_, level, attrs, title) => {
      const cleanTitle = title.replace(/<[^>]*>/g, '');
      const id = slugify(cleanTitle);
      return `<h${level}${attrs} id="${id}">${title}</h${level}>`;
    }
  );
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Get category color
export const categoryColors: Record<string, string> = {
  nutrition: 'green',
  training: 'orange',
  health: 'blue',
  grooming: 'purple',
  breeds: 'amber',
  'puppy-care': 'pink',
};

// Get category icon
export const categoryIcons: Record<string, string> = {
  nutrition: '🥗',
  training: '🎯',
  health: '🏥',
  grooming: '✂️',
  breeds: '🐕',
  'puppy-care': '🐾',
};

// Create schema JSON-LD
export function createArticleSchema(article: Article, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': article.schema_type || 'Article',
    headline: article.seo_title || article.title,
    description: article.meta_description,
    image: `${siteUrl}${article.featured_image}`,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'DogParentGuide',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
    datePublished: article.published_date,
    dateModified: article.updated_date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${article.slug}`,
    },
    url: `${siteUrl}/articles/${article.slug}`,
    articleSection: article.category,
    keywords: article.tags.join(', '),
  };
}

// Create FAQ schema
export function createFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Paginate array
export function paginate<T>(items: T[], page: number, perPage: number): {
  items: T[];
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const totalPages = Math.ceil(items.length / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  return {
    items: items.slice(start, end),
    totalPages,
    currentPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

// Generate RSS feed XML
export function generateRSSFeed(articles: Article[], siteUrl: string, siteName: string): string {
  const items = articles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
    .slice(0, 20)
    .map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/articles/${article.slug}</link>
      <guid>${siteUrl}/articles/${article.slug}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${new Date(article.published_date).toUTCString()}</pubDate>
      <category>${article.category}</category>
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>Expert advice for every dog parent</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}
