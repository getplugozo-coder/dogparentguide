// ============================================================
// DogParentGuide - Main Application
// Premium Dog Care Authority Website
// Tech Stack: React + TypeScript + TailwindCSS
// CMS: Google Sheets
// Deployment: Cloudflare Pages
// ============================================================

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { DataProvider } from './contexts/DataContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { AdminPage } from './pages/AdminPage';
import { CategoryPage } from './pages/CategoryPage';
import { TagPage } from './pages/TagPage';
import { AuthorPage } from './pages/AuthorPage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { SitemapPage } from './pages/SitemapPage';
import { NewsletterPage } from './pages/NewsletterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <DataProvider>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <Header />
          <div className="flex-1">
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/newsletter" element={<NewsletterPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />

              {/* Articles */}
              <Route path="/articles/:slug" element={<ArticlePage />} />

              {/* Taxonomy */}
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/tag/:tag" element={<TagPage />} />
              <Route path="/author/:slug" element={<AuthorPage />} />

              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<LegalPage />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/cookie-policy" element={<LegalPage />} />
              <Route path="/disclaimer" element={<LegalPage />} />
              <Route path="/affiliate-disclosure" element={<LegalPage />} />
              <Route path="/editorial-policy" element={<LegalPage />} />
              <Route path="/dmca" element={<LegalPage />} />

              {/* Admin Panel (hidden - no public links point here) */}
              <Route path="/admin/*" element={<AdminPage />} />

              {/* 404 */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
        </DataProvider>
      </Router>
    </HelmetProvider>
  );
}
