// ============================================================
// DogParentGuide - Type Definitions
// Google Sheets CMS Architecture Types
// ============================================================

export interface Article {
  id: string;
  title: string;
  slug: string;
  seo_title: string;
  meta_description: string;
  excerpt: string;
  content_html: string;
  featured_image: string;
  category: string;
  tags: string[];
  author: string;
  published_date: string;
  updated_date: string;
  featured: boolean;
  trending: boolean;
  faq_json: FAQ[];
  schema_type: string;
  reading_time: number;
  canonical: string;
  status: 'published' | 'draft' | 'archived';
  pinterest_title?: string;
  pinterest_description?: string;
  pinterest_image?: string;
  views?: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  featured_image: string;
  seo_title: string;
  meta_description: string;
  parent_category: string;
  post_count: number;
  order: number;
  status: 'active' | 'inactive';
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  role: string;
  credentials: string;
  website: string;
  twitter: string;
  instagram: string;
  pinterest: string;
  facebook: string;
  email: string;
  post_count: number;
  status: 'active' | 'inactive';
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  parent_id: string;
  order: number;
  menu_location: 'primary' | 'footer' | 'mobile';
  target: '_self' | '_blank';
  icon: string;
}

export interface HomepageSection {
  id: string;
  section_type: string;
  title: string;
  subtitle: string;
  content: string;
  order: number;
  active: boolean;
  config_json: Record<string, unknown>;
}

export interface Ad {
  id: string;
  name: string;
  placement: AdPlacement;
  ad_code: string;
  active: boolean;
  start_date: string;
  end_date: string;
  pages: string;
}

export type AdPlacement =
  | 'header_banner'
  | 'below_header'
  | 'sidebar_top'
  | 'sidebar_bottom'
  | 'inside_article'
  | 'middle_article'
  | 'before_conclusion'
  | 'after_article'
  | 'footer'
  | 'mobile_sticky';

export interface SEOSettings {
  page: string;
  title_template: string;
  meta_description: string;
  og_image: string;
  twitter_card: string;
  robots: string;
  canonical_base: string;
}

export interface LegalPage {
  id: string;
  title: string;
  slug: string;
  content_html: string;
  last_updated: string;
  status: 'published' | 'draft';
}

export interface FooterSection {
  id: string;
  section_title: string;
  links: FooterLink[];
  order: number;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  active: boolean;
}

export interface SiteSettings {
  key: string;
  value: string;
}

export interface FeaturedPost {
  article_id: string;
  position: number;
  featured_label: string;
  active: boolean;
}

export interface TrendingPost {
  article_id: string;
  position: number;
  trend_label: string;
  active: boolean;
}

export interface NewsletterSettings {
  provider: string;
  list_id: string;
  api_key: string;
  form_title: string;
  form_subtitle: string;
  success_message: string;
  active: boolean;
}

export interface SearchIndex {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  published_date: string;
  featured_image: string;
  reading_time: number;
}
