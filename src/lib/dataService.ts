// Service layer - writes to Worker API + localStorage fallback

import type { Article, Category, Author, Ad } from '../data/types';
import * as api from './api';

const STORAGE_KEYS = {
  articles: 'dpg_articles',
  categories: 'dpg_categories',
  authors: 'dpg_authors',
  ads: 'dpg_ads',
};

function getLocal<T>(key: string, fallback: T[]): T[] {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}

function setLocal<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const dataService = {
  getArticles: () => getLocal<Article>(STORAGE_KEYS.articles, []),
  getArticle: (id: string) => dataService.getArticles().find(a => a.id === id),
  async saveArticle(article: Article) {
    const list = this.getArticles();
    const idx = list.findIndex(a => a.id === article.id);
    if (idx >= 0) list[idx] = article; else list.push(article);
    setLocal(STORAGE_KEYS.articles, list);
    await api.saveArticle(article);
  },
  deleteArticle(id: string) {
    setLocal(STORAGE_KEYS.articles, this.getArticles().filter(a => a.id !== id));
    api.deleteArticle(id);
  },

  getCategories: () => getLocal<Category>(STORAGE_KEYS.categories, []),
  async saveCategory(cat: Category) {
    const list = this.getCategories();
    const idx = list.findIndex(c => c.id === cat.id);
    if (idx >= 0) list[idx] = cat; else list.push(cat);
    setLocal(STORAGE_KEYS.categories, list);
    await api.saveCategory(cat);
  },
  deleteCategory(id: string) {
    setLocal(STORAGE_KEYS.categories, this.getCategories().filter(c => c.id !== id));
    api.deleteCategory(id);
  },

  getAuthors: () => getLocal<Author>(STORAGE_KEYS.authors, []),
  async saveAuthor(author: Author) {
    const list = this.getAuthors();
    const idx = list.findIndex(a => a.id === author.id);
    if (idx >= 0) list[idx] = author; else list.push(author);
    setLocal(STORAGE_KEYS.authors, list);
    await api.saveAuthor(author);
  },
  deleteAuthor(id: string) {
    setLocal(STORAGE_KEYS.authors, this.getAuthors().filter(a => a.id !== id));
    api.deleteAuthor(id);
  },

  getAds: () => getLocal<Ad>(STORAGE_KEYS.ads, []),
  async saveAd(ad: Ad) {
    const list = this.getAds();
    const idx = list.findIndex(a => a.id === ad.id);
    if (idx >= 0) list[idx] = ad; else list.push(ad);
    setLocal(STORAGE_KEYS.ads, list);
    await api.saveAd(ad);
  },
  deleteAd(id: string) {
    setLocal(STORAGE_KEYS.ads, this.getAds().filter(a => a.id !== id));
    api.deleteAd(id);
  },

  exportAll: () => JSON.stringify({
    articles: dataService.getArticles(),
    categories: dataService.getCategories(),
    authors: dataService.getAuthors(),
    ads: dataService.getAds(),
  }, null, 2),

  importAll(json: string) {
    try {
      const data = JSON.parse(json);
      if (data.articles) setLocal(STORAGE_KEYS.articles, data.articles);
      if (data.categories) setLocal(STORAGE_KEYS.categories, data.categories);
      if (data.authors) setLocal(STORAGE_KEYS.authors, data.authors);
      if (data.ads) setLocal(STORAGE_KEYS.ads, data.ads);
      return true;
    } catch { return false; }
  },
};
