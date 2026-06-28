// ============================================================
// DogParentGuide - Tag Page
// ============================================================

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SEOHead } from '../components/layout/SEOHead';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ArticleCard } from '../components/ui/ArticleCard';
import { Pagination } from '../components/ui/Pagination';
import { useData } from '../contexts/DataContext';
import { getArticlesByTag, paginate } from '../utils/helpers';

const ARTICLES_PER_PAGE = 9;

export function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const navigate = useNavigate();
  const { articles } = useData();
  const [currentPage, setCurrentPage] = useState(1);

  const decodedTag = tag ? decodeURIComponent(tag.replace(/-/g, ' ')) : '';
  const tagArticles = decodedTag ? getArticlesByTag(articles, decodedTag) : [];

  useEffect(() => {
    if (decodedTag && tagArticles.length === 0) {
      // Tag exists but no articles - still render empty state
    }
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }, [tag]);

  if (!decodedTag) {
    navigate('/404', { replace: true });
    return null;
  }

  const { items: paginatedArticles, totalPages } = paginate(tagArticles, currentPage, ARTICLES_PER_PAGE);

  return (
    <>
      <SEOHead
        title={`Articles tagged "${decodedTag}" | DogParentGuide`}
        description={`Browse ${tagArticles.length} expert dog care articles tagged with "${decodedTag}". Find advice from veterinarians and certified professionals.`}
        url={`/tag/${tag}`}
      />

      <main>
        {/* Tag Hero */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Tags', href: '/search' },
                { label: `#${decodedTag}` },
              ]}
            />
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/60 text-sm mb-4">
                🏷️ Tag
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                #{decodedTag}
              </h1>
              <p className="text-gray-400 mt-2">
                {tagArticles.length} article{tagArticles.length === 1 ? '' : 's'} found
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {paginatedArticles.length > 0 ? (
                <>
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
                  <div className="text-4xl mb-4">🏷️</div>
                  <p className="text-lg font-semibold">No articles found for this tag.</p>
                </div>
              )}
            </div>

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
