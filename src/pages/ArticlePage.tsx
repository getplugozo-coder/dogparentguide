// ============================================================
// DogParentGuide - Article Detail Page
// ============================================================

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { SEOHead } from '../components/layout/SEOHead';
import { Sidebar } from '../components/layout/Sidebar';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Badge } from '../components/ui/Badge';
import { ArticleCard } from '../components/ui/ArticleCard';
import { ShareButtons } from '../components/ui/ShareButtons';
import { TableOfContents } from '../components/ui/TableOfContents';
import { FAQSection } from '../components/ui/FAQSection';
import { NewsletterBox } from '../components/ui/NewsletterBox';
import { articles } from '../data/articles';
import { authors } from '../data/authors';
import { categories } from '../data/categories';
import { siteSettings } from '../data/settings';
import {
  formatDate,
  getReadingTimeText,
  getRelatedArticles,
  addHeadingIds,
  createArticleSchema,
  createFAQSchema,
} from '../utils/helpers';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = articles.find(a => a.slug === slug && a.status === 'published');

  useEffect(() => {
    if (!article) {
      navigate('/404', { replace: true });
    }
    window.scrollTo(0, 0);
  }, [article, navigate, slug]);

  if (!article) return null;

  const author = authors.find(a => a.slug === article.author);
  const category = categories.find(c => c.slug === article.category);
  const relatedArticles = getRelatedArticles(article, articles, 3);
  const processedContent = addHeadingIds(article.content_html);

  const prevArticle = articles.find((_, i) => {
    const currentIndex = articles.findIndex(a => a.id === article.id);
    return i === currentIndex - 1;
  });
  const nextArticle = articles.find((_, i) => {
    const currentIndex = articles.findIndex(a => a.id === article.id);
    return i === currentIndex + 1;
  });

  const articleSchema = createArticleSchema(article, siteSettings.url);
  const faqSchema = article.faq_json?.length > 0
    ? createFAQSchema(article.faq_json)
    : null;

  const schemas = faqSchema ? [articleSchema, faqSchema] : [articleSchema];

  return (
    <>
      <SEOHead
        title={article.seo_title || article.title}
        description={article.meta_description}
        image={article.featured_image}
        url={`/articles/${article.slug}`}
        type="article"
        publishedTime={article.published_date}
        modifiedTime={article.updated_date}
        author={author?.name}
        tags={article.tags}
        schema={schemas as unknown as Record<string, unknown>}
        canonical={article.canonical}
      />

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: category?.name || article.category, href: `/category/${article.category}` },
              { label: article.title },
            ]}
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Article Content */}
            <article className="lg:col-span-2">
              {/* Category & Meta */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {category && (
                  <Badge href={`/category/${article.category}`} variant="category">
                    {category.icon} {category.name}
                  </Badge>
                )}
                {article.trending && <Badge variant="trending">🔥 Trending</Badge>}
                {article.featured && <Badge variant="featured">⭐ Featured</Badge>}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
                {article.title}
              </h1>

              {/* Author & Meta Bar */}
              <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-gray-100">
                {author && (
                  <Link to={`/author/${author.slug}`} className="flex items-center gap-3 group">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-green-100"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        {author.name}
                      </p>
                      <p className="text-xs text-gray-500">{author.credentials}</p>
                    </div>
                  </Link>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 ml-auto flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(article.published_date)}
                  </span>
                  {article.updated_date !== article.published_date && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Updated {formatDate(article.updated_date)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getReadingTimeText(article.reading_time)}
                  </span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="rounded-2xl overflow-hidden mb-8 shadow-md">
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full aspect-[16/9] object-cover"
                  loading="eager"
                />
              </div>

              {/* Share Buttons - Top */}
              <div className="mb-6">
                <ShareButtons
                  url={`/articles/${article.slug}`}
                  title={article.pinterest_title || article.title}
                  description={article.meta_description}
                  image={article.featured_image}
                />
              </div>

              {/* Table of Contents */}
              <TableOfContents content={processedContent} />

              {/* Article Body */}
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-24
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-1
                  prose-li:text-gray-700
                  prose-strong:text-gray-900 prose-strong:font-bold
                  prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:border-green-400 prose-blockquote:bg-green-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-700
                "
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 mr-1">Tags:</span>
                    {article.tags.map(tag => (
                      <Badge
                        key={tag}
                        href={`/tag/${tag.replace(/\s+/g, '-').toLowerCase()}`}
                        variant="tag"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Buttons - Bottom */}
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                <p className="text-sm font-bold text-gray-900 mb-4">
                  Found this helpful? Share it with fellow dog parents! 🐾
                </p>
                <ShareButtons
                  url={`/articles/${article.slug}`}
                  title={article.pinterest_title || article.title}
                  description={article.meta_description}
                  image={article.featured_image}
                />
              </div>

              {/* FAQ Section */}
              {article.faq_json && article.faq_json.length > 0 && (
                <FAQSection faqs={article.faq_json} />
              )}

              {/* Author Box */}
              {author && (
                <div className="mt-10 bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-6 md:p-8">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                    About the Author
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-5">
                    <Link to={`/author/${author.slug}`} className="flex-shrink-0">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-20 h-20 rounded-2xl object-cover ring-4 ring-green-100"
                      />
                    </Link>
                    <div>
                      <Link to={`/author/${author.slug}`}>
                        <h4 className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors">
                          {author.name}
                        </h4>
                      </Link>
                      <p className="text-sm text-green-600 font-semibold">{author.credentials}</p>
                      <p className="text-sm text-orange-500 mb-3">{author.role}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{author.bio}</p>
                      <div className="flex items-center gap-3 mt-4">
                        {author.twitter && (
                          <a
                            href={`https://twitter.com/${author.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                          >
                            {author.twitter}
                          </a>
                        )}
                        <Link
                          to={`/author/${author.slug}`}
                          className="text-xs text-green-600 font-semibold hover:text-green-700"
                        >
                          View All Articles →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="mt-10">
                <NewsletterBox variant="card" />
              </div>

              {/* Prev / Next Navigation */}
              {(prevArticle || nextArticle) && (
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prevArticle ? (
                    <Link
                      to={`/articles/${prevArticle.slug}`}
                      className="group flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-green-200 hover:shadow-sm transition-all duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">Previous</p>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                          {prevArticle.title}
                        </p>
                      </div>
                    </Link>
                  ) : <div />}

                  {nextArticle && (
                    <Link
                      to={`/articles/${nextArticle.slug}`}
                      className="group flex items-center justify-end gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-green-200 hover:shadow-sm transition-all duration-200 text-right"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">Next</p>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                          {nextArticle.title}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              )}

              {/* Related Posts */}
              {relatedArticles.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span>📚</span> Related Articles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {relatedArticles.map(related => (
                      <ArticleCard
                        key={related.id}
                        article={related}
                        variant="default"
                        showExcerpt={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Sidebar currentArticleId={article.id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
