// Live API service - fetches data from Cloudflare Worker / Google Sheets
// Falls back to static data files when API is unavailable

import type { Article, Category, Author, Ad } from './types';
import { articles as staticArticles } from '../data/articles';
import { categories as staticCategories } from '../data/categories';
import { authors as staticAuthors } from '../data/authors';

const WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL || '';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

function getWorkerUrl(): string {
  if (WORKER_URL) return WORKER_URL;
  // Try local Pages Functions proxy
  return '/api';
}

async function fetchFromAPI<T>(range: string, fallback: T[]): Promise<T[]> {
  const baseUrl = getWorkerUrl();
  if (!baseUrl) return fallback;

  try {
    const url = `${baseUrl}/sheets?range=${encodeURIComponent(range)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    const rows: string[][] = data.values || [];
    if (rows.length < 2) return fallback;
    return rowsToObjects<T>(rows, fallback);
  } catch (err) {
    console.warn(`API fetch failed for ${range}, using static fallback:`, err);
    return fallback;
  }
}

function rowsToObjects<T>(rows: string[][], fallback: T[]): T[] {
  if (rows.length < 2) return fallback;
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj: Record<string, unknown> = {};
    headers.forEach((header, i) => {
      const value = row[i] || '';
      if (['tags', 'faq_json'].includes(header)) {
        try { obj[header] = JSON.parse(value); } catch { obj[header] = []; }
      } else if (['featured', 'trending', 'active'].includes(header)) {
        obj[header] = value.toLowerCase() === 'true' || value === '1';
      } else if (['reading_time', 'post_count', 'order', 'views'].includes(header)) {
        obj[header] = parseInt(value, 10) || 0;
      } else {
        obj[header] = value;
      }
    });
    return obj as T;
  });
}

// ─── Public API ───────────────────────────────────────────

export async function fetchArticles(): Promise<Article[]> {
  const api = await fetchFromAPI<Article>('Articles!A:U', staticArticles);
  return api.filter(a => a.status === 'published');
}

export async function fetchAllArticles(): Promise<Article[]> {
  return fetchFromAPI<Article>('Articles!A:U', staticArticles);
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchFromAPI<Category>('Categories!A:M', staticCategories);
}

export async function fetchAuthors(): Promise<Author[]> {
  return fetchFromAPI<Author>('Authors!A:P', staticAuthors);
}

// ─── Admin Write API ──────────────────────────────────────

async function writeToAPI(range: string, values: string[][]): Promise<boolean> {
  const baseUrl = getWorkerUrl();
  if (!baseUrl) return false;

  try {
    const res = await fetch(`${baseUrl}/sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_PASSWORD}`,
      },
      body: JSON.stringify({ range, values }),
    });
    return res.ok;
  } catch (err) {
    console.warn('API write failed:', err);
    return false;
  }
}

export async function saveArticleToAPI(article: Article, headers: string[]): Promise<boolean> {
  const values = headers.map(h => {
    const val = (article as any)[h];
    if (Array.isArray(val)) return JSON.stringify(val);
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    return String(val ?? '');
  });
  return writeToAPI('Articles!A:U', [headers, values]);
}

export async function saveCategoryToAPI(cat: Category, headers: string[]): Promise<boolean> {
  const values = headers.map(h => String((cat as any)[h] ?? ''));
  return writeToAPI('Categories!A:M', [headers, values]);
}

export async function saveAuthorToAPI(author: Author, headers: string[]): Promise<boolean> {
  const values = headers.map(h => String((author as any)[h] ?? ''));
  return writeToAPI('Authors!A:P', [headers, values]);
}

export async function saveAdToAPI(ad: Ad, headers: string[]): Promise<boolean> {
  const values = headers.map(h => String((ad as any)[h] ?? ''));
  return writeToAPI('Ads!A:H', [headers, values]);
}
