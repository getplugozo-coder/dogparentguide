// ============================================================
// DogParentGuide - Sidebar Component
// ============================================================

import { Link } from 'react-router-dom';
import { ArticleCard } from '../ui/ArticleCard';
import { NewsletterBox } from '../ui/NewsletterBox';
import { Badge } from '../ui/Badge';
import { useData } from '../../contexts/DataContext';
import { getPopularArticles, getTrendingArticles, formatNumber } from '../../utils/helpers';

interface SidebarProps {
  currentArticleId?: string;
}

export function Sidebar({ currentArticleId }: SidebarProps) {
  const { articles, categories } = useData();
  const filteredArticles = articles.filter(a => a.id !== currentArticleId && a.status === 'published');
  const popularArticles = getPopularArticles(filteredArticles, 5);
  const trendingArticles = getTrendingArticles(filteredArticles, 4);

  // Collect all unique tags
  const allTags = [...new Set(articles.flatMap(a => a.tags))].slice(0, 20);

  return (
    <aside className="space-y-8">
      {/* Newsletter */}
      <NewsletterBox variant="inline" />

      {/* Popular Posts */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
          <span className="text-lg">🔥</span>
          <h3 className="font-bold text-gray-900">Popular Posts</h3>
        </div>
        <div className="p-5 space-y-5">
          {popularArticles.map((article, index) => (
            <div key={article.id} className="flex gap-3 group">
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                index === 0 ? 'bg-orange-500 text-white' :
                index === 1 ? 'bg-orange-100 text-orange-600' :
                index === 2 ? 'bg-orange-50 text-orange-500' :
                'bg-gray-100 text-gray-500'
              }`}>
                {index + 1}
              </span>
              <div className="min-w-0">
                <Link
                  to={`/articles/${article.slug}`}
                  className="text-sm font-medium text-gray-900 leading-snug group-hover:text-green-600 transition-colors duration-200 line-clamp-2 block"
                >
                  {article.title}
                </Link>
                <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {formatNumber(article.views || 0)} views
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
          <span className="text-lg">📂</span>
          <h3 className="font-bold text-gray-900">Browse Topics</h3>
        </div>
        <div className="p-5 space-y-2">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                  {cat.name}
                </span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {cat.post_count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Posts */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
          <span className="text-lg">📈</span>
          <h3 className="font-bold text-gray-900">Trending Now</h3>
        </div>
        <div className="p-5 space-y-4">
          {trendingArticles.map(article => (
            <ArticleCard key={article.id} article={article} variant="horizontal" showExcerpt={false} />
          ))}
        </div>
      </div>

      {/* Tags Cloud */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50">
          <span className="text-lg">🏷️</span>
          <h3 className="font-bold text-gray-900">Popular Tags</h3>
        </div>
        <div className="p-5 flex flex-wrap gap-2">
          {allTags.map(tag => (
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

      {/* Ad Space */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-dashed border-gray-200 p-6 text-center min-h-[250px] flex flex-col items-center justify-center">
        <div className="text-gray-300 text-3xl mb-2">📢</div>
        <p className="text-xs text-gray-400 font-medium">Advertisement</p>
        <p className="text-xs text-gray-300 mt-1">300×250</p>
        {/* Ad code inserted here from Google Sheets Ads tab */}
      </div>
    </aside>
  );
}
