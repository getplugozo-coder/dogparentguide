// ============================================================
// DogParentGuide - Google Sheets CMS Integration
// ============================================================
// This module handles fetching data from Google Sheets.
// It supports both direct Google Sheets API and Cloudflare Worker proxy.
//
// SETUP GUIDE:
// 1. Create a Google Sheet with the required tabs/sheets
// 2. Share the spreadsheet publicly (View access)
// 3. Enable Google Sheets API in Google Cloud Console
// 4. Create an API key (restrict to Sheets API)
// 5. Add environment variables to Cloudflare Pages:
//    VITE_GOOGLE_SHEETS_ID=your_spreadsheet_id
//    VITE_GOOGLE_SHEETS_API_KEY=your_api_key
//
// CLOUDFLARE WORKER SETUP (Optional, recommended for security):
// Deploy the worker in /worker/sheets-proxy.ts
// Set VITE_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
// ============================================================

import { googleSheetsConfig } from '../data/settings';
import type { Article, Category, Author } from '../data/types';

const SHEETS_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

interface SheetResponse {
  values: string[][];
}

async function fetchSheetData(range: string): Promise<string[][]> {
  const { spreadsheetId, apiKey, workerUrl } = googleSheetsConfig;

  // Use Cloudflare Worker if configured (recommended)
  if (workerUrl) {
    const response = await fetch(`${workerUrl}/sheets?range=${encodeURIComponent(range)}`);
    if (!response.ok) throw new Error(`Worker fetch failed: ${response.status}`);
    const data: SheetResponse = await response.json();
    return data.values || [];
  }

  // Direct Google Sheets API
  if (spreadsheetId && apiKey) {
    const url = `${SHEETS_BASE_URL}/${spreadsheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Sheets API fetch failed: ${response.status}`);
    const data: SheetResponse = await response.json();
    return data.values || [];
  }

  throw new Error('No Google Sheets configuration found. Set VITE_GOOGLE_SHEETS_ID and VITE_GOOGLE_SHEETS_API_KEY');
}

function rowsToObjects<T>(rows: string[][]): T[] {
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj: Record<string, unknown> = {};
    headers.forEach((header, i) => {
      const value = row[i] || '';
      // Parse JSON fields
      if (header === 'tags' || header === 'faq_json') {
        try {
          obj[header] = JSON.parse(value);
        } catch {
          obj[header] = header === 'tags' ? value.split(',').map(t => t.trim()) : [];
        }
      } else if (header === 'featured' || header === 'trending' || header === 'active') {
        obj[header] = value.toLowerCase() === 'true' || value === '1';
      } else if (header === 'reading_time' || header === 'post_count' || header === 'order' || header === 'position') {
        obj[header] = parseInt(value, 10) || 0;
      } else if (header === 'views') {
        obj[header] = parseInt(value, 10) || 0;
      } else {
        obj[header] = value;
      }
    });
    return obj as T;
  });
}

// Fetch all articles from Google Sheets
export async function fetchArticlesFromSheets(): Promise<Article[]> {
  const rows = await fetchSheetData(googleSheetsConfig.ranges.articles);
  return rowsToObjects<Article>(rows).filter(a => a.status === 'published');
}

// Fetch categories from Google Sheets
export async function fetchCategoriesFromSheets(): Promise<Category[]> {
  const rows = await fetchSheetData(googleSheetsConfig.ranges.categories);
  return rowsToObjects<Category>(rows).filter(c => c.status === 'active');
}

// Fetch authors from Google Sheets
export async function fetchAuthorsFromSheets(): Promise<Author[]> {
  const rows = await fetchSheetData(googleSheetsConfig.ranges.authors);
  return rowsToObjects<Author>(rows).filter(a => a.status === 'active');
}

// Build search index from articles
export function buildSearchIndex(articles: Article[]) {
  return articles.map(article => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    tags: article.tags,
    author: article.author,
    published_date: article.published_date,
    featured_image: article.featured_image,
    reading_time: article.reading_time,
  }));
}
