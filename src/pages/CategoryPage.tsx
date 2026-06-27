// ============================================================
// DogParentGuide - Category Page
// ============================================================

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SEOHead } from '../components/layout/SEOHead';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ArticleCard } from '../components/ui/ArticleCard';
import { Pagination } from '../components/ui/Pagination';
import { articles } from '../data/articles';
import { categories } from '../data/categories';
import { getArticlesByCategory, paginate } from '../utils/helpers';

const ARTICLES_PER_PAGE = 9;

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const category = categories.find(c => c.slug === slug);

  useEffect(() => {
    if (!category) {
      navigate('/404', { replace: true });
    }
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }, [category, navigate, slug]);

  if (!category) return null;

  const categoryArticles = getArticlesByCategory(articles, category.slug);
  const { items: paginatedArticles, totalPages } = paginate(categoryArticles, currentPage, ARTICLES_PER_PAGE);

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `https://dogparentguide.com/category/${category.slug}`,
  };

  return (
    <>
      <SEOHead
        title={category.seo_title}
        description={category.meta_description}
        image={category.featured_image}
        url={`/category/${category.slug}`}
        schema={categorySchema}
      />

      <main>
        {/* Category Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 py-16">
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${category.featured_image})` }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: category.name },
              ]}
            />
            <div className="mt-6 flex items-center gap-4">
              <span className="text-5xl">{category.icon}</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  {category.name}
                </h1>
                <p className="text-gray-300 mt-2 max-w-2xl">{category.description}</p>
                <p className="text-green-400 text-sm font-semibold mt-2">
                  {category.post_count} Expert Articles
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Articles Grid */}
            <div className="lg:col-span-2">
              {paginatedArticles.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500">
                      Showing{' '}
                      <span className="font-semibold text-gray-900">{categoryArticles.length}</span>{' '}
                      articles in <span className="font-semibold text-green-600">{category.name}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {paginatedArticles.map(article => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        variant="default"
                        showExcerpt={true}
                      />
                    ))}
                  </div>

                  <div className="mt-10">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <div className="text-4xl mb-4">🐾</div>
                  <p className="text-lg font-semibold">No articles found in this category yet.</p>
                  <p className="text-sm mt-2">Check back soon for expert content!</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
