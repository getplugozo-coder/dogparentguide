// ============================================================
// DogParentGuide - Search Page (Static, No Server Required)
// Uses Fuse.js for fast client-side search
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import { SEOHead } from '../components/layout/SEOHead';
import { ArticleCard } from '../components/ui/ArticleCard';
import { Pagination } from '../components/ui/Pagination';
import { articles } from '../data/articles';
import { paginate } from '../utils/helpers';

const RESULTS_PER_PAGE = 9;

// Build search index
const searchIndex = articles
  .filter(a => a.status === 'published')
  .map(a => ({
    ...a,
    tagsString: a.tags.join(' '),
  }));

const fuse = new Fuse(searchIndex, {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'excerpt', weight: 1.5 },
    { name: 'tagsString', weight: 1.2 },
    { name: 'category', weight: 1 },
    { name: 'content_html', weight: 0.5 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
});

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);

  const searchResults = query
    ? fuse.search(query).map(r => r.item)
    : articles.filter(a => a.status === 'published');

  const { items: paginatedResults, totalPages } = paginate(searchResults, currentPage, RESULTS_PER_PAGE);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setInputValue(q);
    setCurrentPage(1);
  }, [searchParams]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    } else {
      setSearchParams({});
    }
    setCurrentPage(1);
  }, [inputValue, setSearchParams]);

  return (
    <>
      <SEOHead
        title={query ? `Search results for "${query}" | DogParentGuide` : 'Search | DogParentGuide'}
        description="Search thousands of expert dog care articles on nutrition, training, health, grooming, and more."
        url="/search"
        noindex={!!query}
      />

      <main>
        <div className="bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-3">
              🔍 Search DogParentGuide
            </h1>
            <p className="text-gray-500 mb-8">
              Search through {articles.length}+ expert dog care articles
            </p>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Search for dog training, nutrition, health tips..."
                className="w-full pl-6 pr-36 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-base shadow-sm bg-white"
                aria-label="Search articles"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-colors duration-200"
              >
                Search
              </button>
            </form>

            {/* Popular Searches */}
            {!query && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-gray-500">Popular:</span>
                {['dog training', 'puppy nutrition', 'dog health', 'golden retriever', 'grooming'].map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      setInputValue(term);
                      setSearchParams({ q: term });
                    }}
                    className="px-3 py-1 bg-white border border-gray-200 text-sm text-gray-600 rounded-full hover:border-green-300 hover:text-green-600 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Results header */}
          {query && (
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {searchResults.length > 0
                    ? `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'} for "${query}"`
                    : `No results found for "${query}"`
                  }
                </h2>
                {searchResults.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Try different keywords or browse our categories below.
                  </p>
                )}
              </div>
              {query && (
                <button
                  onClick={() => {
                    setInputValue('');
                    setSearchParams({});
                  }}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {!query && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">All Articles</h2>
              <p className="text-sm text-gray-500 mt-1">{articles.length} expert articles</p>
            </div>
          )}

          {/* Results Grid */}
          {paginatedResults.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedResults.map(article => (
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
          ) : query ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-8">
                We couldn't find anything matching "{query}". Try different keywords.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSearchParams({ q: 'dog nutrition' })}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Dog Nutrition
                </button>
                <button
                  onClick={() => setSearchParams({ q: 'dog training' })}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Dog Training
                </button>
                <button
                  onClick={() => setSearchParams({ q: 'dog health' })}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Dog Health
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
