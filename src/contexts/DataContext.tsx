import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Article, Category, Author } from '../data/types';
import { fetchArticles, fetchAllArticles, fetchCategories, fetchAuthors } from '../lib/api';

interface DataContextValue {
  articles: Article[];
  allArticles: Article[];
  categories: Category[];
  authors: Author[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue>({
  articles: [],
  allArticles: [],
  categories: [],
  authors: [],
  loading: true,
  error: null,
  refresh: async () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [arts, allArts, cats, auths] = await Promise.all([
        fetchArticles(),
        fetchAllArticles(),
        fetchCategories(),
        fetchAuthors(),
      ]);
      setArticles(arts);
      setAllArticles(allArts);
      setCategories(cats);
      setAuthors(auths);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <DataContext.Provider value={{
      articles, allArticles, categories, authors,
      loading, error, refresh: load,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
