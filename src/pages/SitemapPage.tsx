// ============================================================
// DogParentGuide - HTML Sitemap Page
// ============================================================

import { Link } from 'react-router-dom';
import { SEOHead } from '../components/layout/SEOHead';
import { useData } from '../contexts/DataContext';
import { navigationMenus } from '../data/settings';
import { formatDate } from '../utils/helpers';

export function SitemapPage() {
  const { articles, categories, authors } = useData();
  const publishedArticles = articles.filter(a => a.status === 'published');

  return (
    <>
      <SEOHead
        title="HTML Sitemap | DogParentGuide"
        description="Complete sitemap of DogParentGuide - find all our dog care articles, categories, and pages."
        url="/sitemap"
        noindex
      />

      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl font-black text-gray-900 mb-2">HTML Sitemap</h1>
          <p className="text-gray-500 mb-10">Complete directory of all pages on DogParentGuide</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Main Pages */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center text-xs text-green-700">🏠</span>
                Main Pages
              </h2>
              <ul className="space-y-2">
                {navigationMenus.primary.map(item => (
                  <li key={item.id}>
                    <Link to={item.url} className="text-sm text-green-600 hover:text-green-700 hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/about" className="text-sm text-green-600 hover:text-green-700 hover:underline">About</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-green-600 hover:text-green-700 hover:underline">Contact</Link>
                </li>
                <li>
                  <Link to="/search" className="text-sm text-green-600 hover:text-green-700 hover:underline">Search</Link>
                </li>
                <li>
                  <Link to="/newsletter" className="text-sm text-green-600 hover:text-green-700 hover:underline">Newsletter</Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center text-xs text-orange-700">📂</span>
                Categories
              </h2>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      className="text-sm text-green-600 hover:text-green-700 hover:underline flex items-center gap-2"
                    >
                      {cat.icon} {cat.name}
                      <span className="text-gray-400 text-xs">({cat.post_count})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Authors */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-xs text-blue-700">✍️</span>
                Authors
              </h2>
              <ul className="space-y-2">
                {authors.filter(a => a.status === 'active').map(author => (
                  <li key={author.id}>
                    <Link
                      to={`/author/${author.slug}`}
                      className="text-sm text-green-600 hover:text-green-700 hover:underline"
                    >
                      {author.name}
                    </Link>
                    <span className="text-gray-400 text-xs ml-2">({author.post_count} articles)</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Pages */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center text-xs text-purple-700">📋</span>
                Legal
              </h2>
              <ul className="space-y-2">
                {navigationMenus.footer_legal.map(link => (
                  <li key={link.id}>
                    <Link to={link.url} className="text-sm text-green-600 hover:text-green-700 hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Articles */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center text-sm text-green-700">📰</span>
              All Articles ({publishedArticles.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {publishedArticles.map(article => (
                <div key={article.id} className="flex items-start gap-2">
                  <span className="text-gray-300 text-sm mt-0.5">›</span>
                  <div>
                    <Link
                      to={`/articles/${article.slug}`}
                      className="text-sm text-green-600 hover:text-green-700 hover:underline leading-snug"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{formatDate(article.published_date, 'MMM d, yyyy')}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <Link
                        to={`/category/${article.category}`}
                        className="text-xs text-gray-400 hover:text-green-600 capitalize"
                      >
                        {article.category}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
