import type { Article, Category, Author, Ad } from '../data/types';
import {
  saveArticleToAPI,
  saveCategoryToAPI,
  saveAuthorToAPI,
  saveAdToAPI,
} from './api';

const STORAGE_KEYS = {
  articles: 'dpg_articles',
  categories: 'dpg_categories',
  authors: 'dpg_authors',
  ads: 'dpg_ads',
};

function getItem<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Column headers matching Google Sheets template
const ARTICLE_HEADERS = ['id','title','slug','excerpt','content','featured_image','category_id','author_id','tags','reading_time','published_date','status','featured','trending','views','meta_title','meta_description','meta_keywords','canonical_url','faq_json','language'];
const CATEGORY_HEADERS = ['id','name','slug','description','icon','color','image','parent_id','order','meta_title','meta_description','meta_keywords','language'];
const AUTHOR_HEADERS = ['id','name','slug','avatar','bio','role','email','website','twitter','facebook','instagram','youtube','credentials','specialization','language'];
const AD_HEADERS = ['id','name','type','code','placement','active','start_date','end_date'];

export const dataService = {
  // Articles
  getArticles(): Article[] {
    return getItem<Article>(STORAGE_KEYS.articles, []);
  },
  setArticles(articles: Article[]): void {
    setItem(STORAGE_KEYS.articles, articles);
  },
  getArticle(id: string): Article | undefined {
    return this.getArticles().find(a => a.id === id);
  },
  async saveArticle(article: Article): Promise<void> {
    const articles = this.getArticles();
    const idx = articles.findIndex(a => a.id === article.id);
    if (idx >= 0) articles[idx] = article;
    else articles.push(article);
    this.setArticles(articles);
    await saveArticleToAPI(article, ARTICLE_HEADERS);
  },
  deleteArticle(id: string): void {
    this.setArticles(this.getArticles().filter(a => a.id !== id));
  },

  // Categories
  getCategories(): Category[] {
    return getItem<Category>(STORAGE_KEYS.categories, []);
  },
  setCategories(cats: Category[]): void {
    setItem(STORAGE_KEYS.categories, cats);
  },
  async saveCategory(cat: Category): Promise<void> {
    const cats = this.getCategories();
    const idx = cats.findIndex(c => c.id === cat.id);
    if (idx >= 0) cats[idx] = cat;
    else cats.push(cat);
    this.setCategories(cats);
    await saveCategoryToAPI(cat, CATEGORY_HEADERS);
  },
  deleteCategory(id: string): void {
    this.setCategories(this.getCategories().filter(c => c.id !== id));
  },

  // Authors
  getAuthors(): Author[] {
    return getItem<Author>(STORAGE_KEYS.authors, []);
  },
  setAuthors(authors: Author[]): void {
    setItem(STORAGE_KEYS.authors, authors);
  },
  async saveAuthor(author: Author): Promise<void> {
    const authors = this.getAuthors();
    const idx = authors.findIndex(a => a.id === author.id);
    if (idx >= 0) authors[idx] = author;
    else authors.push(author);
    this.setAuthors(authors);
    await saveAuthorToAPI(author, AUTHOR_HEADERS);
  },
  deleteAuthor(id: string): void {
    this.setAuthors(this.getAuthors().filter(a => a.id !== id));
  },

  // Ads
  getAds(): Ad[] {
    return getItem<Ad>(STORAGE_KEYS.ads, []);
  },
  setAds(ads: Ad[]): void {
    setItem(STORAGE_KEYS.ads, ads);
  },
  async saveAd(ad: Ad): Promise<void> {
    const ads = this.getAds();
    const idx = ads.findIndex(a => a.id === ad.id);
    if (idx >= 0) ads[idx] = ad;
    else ads.push(ad);
    this.setAds(ads);
    await saveAdToAPI(ad, AD_HEADERS);
  },
  deleteAd(id: string): void {
    this.setAds(this.getAds().filter(a => a.id !== id));
  },

  // Export all as JSON
  exportAll(): string {
    return JSON.stringify({
      articles: this.getArticles(),
      categories: this.getCategories(),
      authors: this.getAuthors(),
      ads: this.getAds(),
    }, null, 2);
  },

  // Import from JSON
  importAll(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (data.articles) this.setArticles(data.articles);
      if (data.categories) this.setCategories(data.categories);
      if (data.authors) this.setAuthors(data.authors);
      if (data.ads) this.setAds(data.ads);
      return true;
    } catch {
      return false;
    }
  },
};
