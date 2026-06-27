// ============================================================
// DogParentGuide - Home Page
// ============================================================

import { Link } from 'react-router-dom';
import { SEOHead } from '../components/layout/SEOHead';
import { Sidebar } from '../components/layout/Sidebar';
import { ArticleCard } from '../components/ui/ArticleCard';
import { NewsletterBox } from '../components/ui/NewsletterBox';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { articles } from '../data/articles';
import { categories } from '../data/categories';
import { siteSettings } from '../data/settings';
import {
  getFeaturedArticles,
  getTrendingArticles,
  getLatestArticles,
  getArticlesByCategory,
} from '../utils/helpers';
import { authors } from '../data/authors';

export function HomePage() {
  const featuredArticles = getFeaturedArticles(articles, 4);
  const trendingArticles = getTrendingArticles(articles, 4);
  const latestArticles = getLatestArticles(articles, 6);
  const heroArticle = featuredArticles[0];
  const secondaryFeatured = featuredArticles.slice(1, 4);



  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteSettings.name,
    url: siteSettings.url,
    description: siteSettings.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteSettings.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <SEOHead
        title="DogParentGuide - Expert Dog Care Advice for Every Dog Parent"
        description="Your trusted source for dog nutrition, training, health, and grooming advice. Expert-backed guides from veterinarians and certified trainers."
        type="website"
        schema={websiteSchema}
      />

      <main>
        {/* ─── Hero Section ─────────────────────────────────────── */}
        {heroArticle && (
          <section className="bg-gradient-to-b from-gray-50 to-white py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Hero Article */}
                <div className="lg:col-span-2">
                  <ArticleCard article={heroArticle} variant="large" />
                </div>

                {/* Secondary Featured */}
                <div className="flex flex-col gap-4">
                  {secondaryFeatured.map(article => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="horizontal"
                      showExcerpt={false}
                    />
                  ))}

                  {/* Trust Banner */}
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mt-2">
                    <p className="text-sm font-bold text-green-800 mb-3">Why Trust Us?</p>
                    <div className="space-y-2">
                      {[
                        { icon: '🏥', text: 'Reviewed by licensed veterinarians' },
                        { icon: '🎓', text: 'Written by certified experts' },
                        { icon: '📊', text: 'Evidence-based information' },
                        { icon: '🔄', text: 'Regularly updated content' },
                      ].map(item => (
                        <div key={item.text} className="flex items-center gap-2 text-sm text-green-700">
                          <span>{item.icon}</span>
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── Stats Bar ─────────────────────────────────────────── */}
        <section className="bg-gray-900 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '500+', label: 'Expert Articles' },
                { value: '50K+', label: 'Dog Parents' },
                { value: '15+', label: 'Veterinary Experts' },
                { value: '100%', label: 'Evidence-Based' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-black text-green-400">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Main Content + Sidebar ────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">

              {/* Trending Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-7 bg-orange-500 rounded-full" />
                    <h2 className="text-xl font-bold text-gray-900">🔥 Trending Now</h2>
                  </div>
                  <Link to="/search?trending=true" className="text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1">
                    View All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {trendingArticles.map(article => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="default"
                      showExcerpt={false}
                    />
                  ))}
                </div>
              </section>

              {/* Browse by Category */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-7 bg-green-500 rounded-full" />
                  <h2 className="text-xl font-bold text-gray-900">📂 Browse by Topic</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 hover:border-green-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="text-3xl mb-3">{cat.icon}</div>
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-green-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
                      <div className="flex items-center gap-1 mt-3">
                        <span className="text-xs text-green-600 font-semibold">{cat.post_count} articles</span>
                        <svg className="w-3 h-3 text-green-500 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Latest Articles */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-7 bg-blue-500 rounded-full" />
                    <h2 className="text-xl font-bold text-gray-900">📰 Latest Articles</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {latestArticles.map(article => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="default"
                      showExcerpt={true}
                    />
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button href="/search" variant="outline" size="lg">
                    View All Articles
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </div>
              </section>

              {/* Featured Category Blocks */}
              {categories.slice(0, 3).map(cat => {
                const catArticles = getArticlesByCategory(articles, cat.slug).slice(0, 3);
                if (catArticles.length === 0) return null;

                return (
                  <section key={cat.id}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-7 rounded-full" style={{ backgroundColor: cat.color }} />
                        <h2 className="text-xl font-bold text-gray-900">
                          {cat.icon} {cat.name}
                        </h2>
                      </div>
                      <Link
                        to={`/category/${cat.slug}`}
                        className="text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1"
                      >
                        More {cat.name}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {catArticles.map(article => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          variant="horizontal"
                          showExcerpt={false}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}

              {/* Newsletter Banner */}
              <NewsletterBox variant="banner" />

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>

        {/* ─── CTA Section ────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="text-5xl mb-6">🐕</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Every Dog Deserves the Best Care
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Join over 50,000 dog parents who trust DogParentGuide for expert, vet-approved advice on nutrition, training, health, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/category/health" variant="secondary" size="lg">
                Explore Health Guides
              </Button>
              <Button href="/newsletter" className="bg-white text-green-600 hover:bg-green-50" size="lg">
                📧 Get Weekly Tips
              </Button>
            </div>
          </div>
        </section>

        {/* ─── Expert Authors ─────────────────────────────────────── */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <Badge variant="featured" className="mb-4">Our Experts</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Advice You Can Trust
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                Our content is written and reviewed by veterinarians, certified trainers, and dog care specialists.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {authors.filter(a => a.status === 'active').map(author => (
                <Link
                  key={author.id}
                  to={`/author/${author.slug}`}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center"
                >
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-green-100 mb-4"
                  />
                  <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {author.name}
                  </h3>
                  <p className="text-xs text-green-600 font-semibold mb-1">{author.credentials}</p>
                  <p className="text-sm text-orange-500 font-medium mb-3">{author.role}</p>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{author.bio}</p>
                  <span className="mt-4 text-xs text-gray-400">{author.post_count} articles</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
