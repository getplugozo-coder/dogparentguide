// ============================================================
// DogParentGuide - Article Card Component
// ============================================================

import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import { formatDate, getReadingTimeText } from '../../utils/helpers';
import type { Article } from '../../data/types';
import { useData } from '../../contexts/DataContext';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'horizontal' | 'minimal' | 'large';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  variant = 'default',
  showExcerpt = true,
  showAuthor = true,
  className = '',
}: ArticleCardProps) {
  const { authors, categories } = useData();
  const author = authors.find(a => a.slug === article.author);
  const category = categories.find(c => c.slug === article.category);

  if (variant === 'horizontal') {
    return (
      <div className={`flex gap-4 group ${className}`}>
        <Link to={`/articles/${article.slug}`} className="flex-shrink-0">
          <div className="w-24 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden">
            <img
              src={article.featured_image}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-center min-w-0">
          {category && (
            <Badge href={`/category/${article.category}`} variant="category" className="mb-1 self-start">
              {category.name}
            </Badge>
          )}
          <Link to={`/articles/${article.slug}`}>
            <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">{formatDate(article.published_date, 'MMM d, yyyy')}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400">{getReadingTimeText(article.reading_time)}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`group ${className}`}>
        <Link to={`/articles/${article.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200 line-clamp-2 leading-snug mb-1">
            {article.title}
          </h3>
        </Link>
        <span className="text-xs text-gray-400">{formatDate(article.published_date, 'MMM d')}</span>
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className={`group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}>
        <Link to={`/articles/${article.slug}`} className="block">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={article.featured_image}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {article.trending && (
              <Badge variant="trending" className="mb-2">🔥 Trending</Badge>
            )}
            {category && (
              <span className="inline-block px-3 py-1 bg-green-500/90 text-white text-xs font-semibold rounded-full mb-3">
                {category.name}
              </span>
            )}
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight mb-2">
              {article.title}
            </h2>
            <div className="flex items-center gap-3 text-white/70 text-xs">
              {showAuthor && author && (
                <span className="flex items-center gap-1">
                  <img src={author.avatar} alt={author.name} className="w-5 h-5 rounded-full object-cover" />
                  {author.name}
                </span>
              )}
              <span>{formatDate(article.published_date, 'MMM d, yyyy')}</span>
              <span>· {getReadingTimeText(article.reading_time)}</span>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Default card
  return (
    <article className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 hover:border-green-100 transition-all duration-300 flex flex-col ${className}`}>
      <Link to={`/articles/${article.slug}`} className="block overflow-hidden">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={article.featured_image}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <Badge href={`/category/${article.category}`} variant="category">
              {category.name}
            </Badge>
          )}
          {article.trending && <Badge variant="trending">🔥 Hot</Badge>}
          {article.featured && <Badge variant="featured">⭐ Featured</Badge>}
        </div>

        <Link to={`/articles/${article.slug}`} className="flex-1">
          <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
            {article.title}
          </h3>
          {showExcerpt && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </Link>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            {showAuthor && author && (
              <>
                <img
                  src={author.avatar}
                  alt={author.name}
                  loading="lazy"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                />
                <span className="text-xs font-medium text-gray-700">{author.name.split(' ')[0]}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{formatDate(article.published_date, 'MMM d')}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {getReadingTimeText(article.reading_time)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
