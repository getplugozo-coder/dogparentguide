// Live API service - fetches from Cloudflare Worker + D1 database
// Falls back to static data files when Worker is unavailable

import type { Article, Category, Author, Ad } from './types';
import { articles as staticArticles } from '../data/articles';
import { categories as staticCategories } from '../data/categories';
import { authors as staticAuthors } from '../data/authors';

const WORKER_URL = import.meta.env.VITE_WORKER_URL || '';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

async function apiGet<T>(path: string, fallback: T[]): Promise<T[]> {
  if (!WORKER_URL) return fallback;
  try {
    const res = await fetch(`${WORKER_URL}${path}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : fallback;
  } catch {
    return fallback;
  }
}

export async function fetchArticles(): Promise<Article[]> {
  return apiGet<Article>('/api/articles', staticArticles.filter(a => a.status === 'published'));
}

export async function fetchAllArticles(): Promise<Article[]> {
  return apiGet<Article>('/api/articles/all', staticArticles);
}

export async function fetchCategories(): Promise<Category[]> {
  return apiGet<Category>('/api/categories', staticCategories);
}

export async function fetchAuthors(): Promise<Author[]> {
  return apiGet<Author>('/api/authors', staticAuthors);
}

// ─── Admin Writes ───────────────────────────────

async function apiPost(path: string, body: unknown): Promise<boolean> {
  if (!WORKER_URL) return false;
  try {
    const res = await fetch(`${WORKER_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${ADMIN_PASSWORD}` },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function apiDelete(path: string): Promise<boolean> {
  if (!WORKER_URL) return false;
  try {
    const res = await fetch(`${WORKER_URL}${path}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${ADMIN_PASSWORD}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function saveArticle(article: Article): Promise<boolean> {
  return apiPost('/api/admin/articles', article);
}

export async function deleteArticle(id: string): Promise<boolean> {
  return apiDelete(`/api/admin/articles/${id}`);
}

export async function saveCategory(cat: Category): Promise<boolean> {
  return apiPost('/api/admin/categories', cat);
}

export async function deleteCategory(id: string): Promise<boolean> {
  return apiDelete(`/api/admin/categories/${id}`);
}

export async function saveAuthor(author: Author): Promise<boolean> {
  return apiPost('/api/admin/authors', author);
}

export async function deleteAuthor(id: string): Promise<boolean> {
  return apiDelete(`/api/admin/authors/${id}`);
}

export async function saveAd(ad: Ad): Promise<boolean> {
  return apiPost('/api/admin/ads', ad);
}

export async function deleteAd(id: string): Promise<boolean> {
  return apiDelete(`/api/admin/ads/${id}`);
}

export async function saveSettings(settings: Record<string, string>): Promise<boolean> {
  return apiPost('/api/admin/settings', settings);
}

export async function exportAll(): Promise<any> {
  if (!WORKER_URL) return null;
  try {
    const res = await fetch(`${WORKER_URL}/api/admin/export`, {
      headers: { 'Authorization': `Bearer ${ADMIN_PASSWORD}` },
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export async function importAll(data: any): Promise<boolean> {
  return apiPost('/api/admin/import', data);
}
