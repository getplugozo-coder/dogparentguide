// ============================================================
// DogParentGuide - 404 Not Found Page
// ============================================================

import { Link } from 'react-router-dom';
import { SEOHead } from '../components/layout/SEOHead';
import { Button } from '../components/ui/Button';
import { ArticleCard } from '../components/ui/ArticleCard';
import { getLatestArticles } from '../utils/helpers';
import { articles } from '../data/articles';

export function NotFoundPage() {
  const latestArticles = getLatestArticles(articles, 3);

  return (
    <>
      <SEOHead
        title="404 - Page Not Found | DogParentGuide"
        description="The page you're looking for doesn't exist. Let's find you some great dog care content instead."
        url="/404"
        noindex
      />

      <main>
        <div className="min-h-[60vh] flex items-center justify-center py-20">
          <div className="text-center max-w-2xl mx-auto px-4">
            <div className="text-8xl mb-6">🐾</div>
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              404
            </h1>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Oops! This page ran away like a puppy off-leash.
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              The page you're looking for doesn't exist or may have been moved. Let's get you back on track!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button href="/" size="lg">
                🏠 Go to Homepage
              </Button>
              <Button href="/search" variant="outline" size="lg">
                🔍 Search Articles
              </Button>
            </div>

            {/* Quick Links */}
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                Popular Sections
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: '🥗 Nutrition', href: '/category/nutrition' },
                  { label: '🎯 Training', href: '/category/training' },
                  { label: '🏥 Health', href: '/category/health' },
                  { label: '✂️ Grooming', href: '/category/grooming' },
                  { label: '🐕 Breeds', href: '/category/breeds' },
                  { label: '🐾 Puppy Care', href: '/category/puppy-care' },
                ].map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-4 py-2.5 bg-gray-50 hover:bg-green-50 hover:border-green-200 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:text-green-700 transition-all duration-200 text-center"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Latest Articles */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Latest Articles You Might Like
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestArticles.map(article => (
                <ArticleCard key={article.id} article={article} variant="default" showExcerpt={false} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
