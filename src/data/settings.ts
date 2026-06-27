// ============================================================
// DogParentGuide - Site Settings & Configuration
// In production: fetched from Google Sheets API
// ============================================================

export const siteSettings = {
  name: 'DogParentGuide',
  tagline: 'Expert Advice for Every Dog Parent',
  description: 'DogParentGuide is the premium authority resource for dog parents. Expert-backed articles on nutrition, training, health, grooming, and breeds.',
  url: 'https://dogparentguide.com',
  logo: '/images/logo.png',
  logo_alt: 'DogParentGuide',
  favicon: '/favicon.ico',
  og_image: '/images/hero-dog.jpg',
  twitter_handle: '@dogparentguide',
  facebook_url: 'https://facebook.com/dogparentguide',
  instagram_url: 'https://instagram.com/dogparentguide',
  pinterest_url: 'https://pinterest.com/dogparentguide',
  youtube_url: 'https://youtube.com/dogparentguide',
  email: 'hello@dogparentguide.com',
  phone: '',
  address: '',
  google_analytics_id: '',
  google_sheets_id: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms',
  articles_per_page: 9,
  theme_color: '#22c55e',
  secondary_color: '#f97316',
  founded_year: 2024,
};

export const socialLinks = [
  { platform: 'Facebook', url: 'https://facebook.com/dogparentguide', icon: 'facebook', active: true },
  { platform: 'Instagram', url: 'https://instagram.com/dogparentguide', icon: 'instagram', active: true },
  { platform: 'Pinterest', url: 'https://pinterest.com/dogparentguide', icon: 'pinterest', active: true },
  { platform: 'Twitter', url: 'https://twitter.com/dogparentguide', icon: 'twitter', active: true },
  { platform: 'YouTube', url: 'https://youtube.com/dogparentguide', icon: 'youtube', active: true },
];

export const navigationMenus = {
  primary: [
    { id: '1', label: 'Home', url: '/', order: 1 },
    { id: '2', label: 'Nutrition', url: '/category/nutrition', order: 2 },
    { id: '3', label: 'Training', url: '/category/training', order: 3 },
    { id: '4', label: 'Health', url: '/category/health', order: 4 },
    { id: '5', label: 'Grooming', url: '/category/grooming', order: 5 },
    { id: '6', label: 'Breeds', url: '/category/breeds', order: 6 },
    { id: '7', label: 'Puppy Care', url: '/category/puppy-care', order: 7 },
  ],
  footer_legal: [
    { id: '1', label: 'Privacy Policy', url: '/privacy-policy' },
    { id: '2', label: 'Terms of Service', url: '/terms' },
    { id: '3', label: 'Cookie Policy', url: '/cookie-policy' },
    { id: '4', label: 'Disclaimer', url: '/disclaimer' },
    { id: '5', label: 'Affiliate Disclosure', url: '/affiliate-disclosure' },
    { id: '6', label: 'Editorial Policy', url: '/editorial-policy' },
    { id: '7', label: 'DMCA', url: '/dmca' },
  ],
  footer_company: [
    { id: '1', label: 'About Us', url: '/about' },
    { id: '2', label: 'Contact', url: '/contact' },
    { id: '3', label: 'HTML Sitemap', url: '/sitemap' },
    { id: '4', label: 'Write For Us', url: '/write-for-us' },
  ]
};

// Google Sheets API Configuration
// ============================================================
// PRODUCTION SETUP:
// 1. Create a Google Sheet with the required columns
// 2. Make the sheet publicly readable or use a service account
// 3. Set VITE_GOOGLE_SHEETS_ID in your .env file
// 4. Optionally use a Cloudflare Worker to proxy API calls
//
// Environment Variables Required:
// VITE_GOOGLE_SHEETS_ID=your_spreadsheet_id
// VITE_GOOGLE_SHEETS_API_KEY=your_api_key (for public sheets)
// or
// VITE_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev
// ============================================================

export const googleSheetsConfig = {
  spreadsheetId: import.meta.env.VITE_GOOGLE_SHEETS_ID || '',
  apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '',
  workerUrl: import.meta.env.VITE_CLOUDFLARE_WORKER_URL || '',
  ranges: {
    articles: 'Articles!A:U',
    categories: 'Categories!A:M',
    authors: 'Authors!A:P',
    menus: 'Menus!A:H',
    homepageSections: 'HomepageSections!A:H',
    ads: 'Ads!A:H',
    seo: 'SEO!A:H',
    legalPages: 'LegalPages!A:F',
    footer: 'Footer!A:D',
    socialLinks: 'SocialLinks!A:E',
    settings: 'Settings!A:B',
    featuredPosts: 'FeaturedPosts!A:D',
    trendingPosts: 'TrendingPosts!A:D',
    newsletter: 'Newsletter!A:H',
  }
};
