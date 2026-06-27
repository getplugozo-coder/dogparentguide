// ============================================================
// DogParentGuide - Author Page
// ============================================================

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SEOHead } from '../components/layout/SEOHead';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { ArticleCard } from '../components/ui/ArticleCard';
import { Pagination } from '../components/ui/Pagination';
import { articles } from '../data/articles';
import { authors } from '../data/authors';
import { getArticlesByAuthor, paginate } from '../utils/helpers';

const ARTICLES_PER_PAGE = 9;

export function AuthorPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const author = authors.find(a => a.slug === slug);

  useEffect(() => {
    if (!author) {
      navigate('/404', { replace: true });
    }
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }, [author, navigate, slug]);

  if (!author) return null;

  const authorArticles = getArticlesByAuthor(articles, author.slug);
  const { items: paginatedArticles, totalPages } = paginate(authorArticles, currentPage, ARTICLES_PER_PAGE);

  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.bio,
    image: `https://dogparentguide.com${author.avatar}`,
    url: `https://dogparentguide.com/author/${author.slug}`,
    jobTitle: author.role,
    sameAs: [
      author.twitter ? `https://twitter.com/${author.twitter.replace('@', '')}` : '',
      author.instagram ? `https://instagram.com/${author.instagram.replace('@', '')}` : '',
    ].filter(Boolean),
  };

  return (
    <>
      <SEOHead
        title={`${author.name} - ${author.role} | DogParentGuide`}
        description={author.bio}
        image={author.avatar}
        url={`/author/${author.slug}`}
        schema={authorSchema}
      />

      <main>
        {/* Author Hero */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Authors' },
                { label: author.name },
              ]}
            />

            <div className="mt-8 flex flex-col md:flex-row items-center md:items-start gap-8">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-32 h-32 rounded-2xl object-cover ring-4 ring-white/20 flex-shrink-0"
              />
              <div className="text-center md:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-3">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                    {author.credentials}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white">{author.name}</h1>
                <p className="text-orange-400 font-semibold mt-1">{author.role}</p>
                <p className="text-gray-400 mt-4 max-w-2xl leading-relaxed">{author.bio}</p>

                <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{authorArticles.length}</p>
                    <p className="text-xs text-gray-400">Articles</p>
                  </div>
                  {author.twitter && (
                    <a
                      href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-colors"
                    >
                      {author.twitter}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Articles by {author.name}
              </h2>

              {paginatedArticles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {paginatedArticles.map(article => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        variant="default"
                        showExcerpt={true}
                        showAuthor={false}
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
                  <div className="text-4xl mb-4">✍️</div>
                  <p>No articles published yet.</p>
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
