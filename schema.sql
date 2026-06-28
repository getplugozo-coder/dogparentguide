-- DogParentGuide - D1 Database Schema
-- Run: npx wrangler d1 execute dpg --file=schema.sql

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT DEFAULT '/images/hero-dog.jpg',
  category_id TEXT,
  author_id TEXT,
  tags TEXT DEFAULT '[]',
  reading_time INTEGER DEFAULT 5,
  published_date TEXT,
  status TEXT DEFAULT 'draft',
  featured INTEGER DEFAULT 0,
  trending INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📂',
  color TEXT DEFAULT '#22c55e',
  image TEXT,
  parent_id TEXT,
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar TEXT,
  role TEXT,
  credentials TEXT,
  email TEXT,
  twitter TEXT,
  instagram TEXT,
  facebook TEXT,
  post_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'custom',
  code TEXT,
  placement TEXT NOT NULL,
  active INTEGER DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  pages TEXT DEFAULT 'all',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value) VALUES
  ('site_name', 'DogParentGuide'),
  ('site_tagline', 'Expert Advice for Every Dog Parent'),
  ('site_description', 'Your trusted source for dog care advice.'),
  ('site_url', 'https://dogparentguide.pages.dev'),
  ('contact_email', 'ihoum24@gmail.com'),
  ('theme_color', '#22c55e'),
  ('articles_per_page', '9');
