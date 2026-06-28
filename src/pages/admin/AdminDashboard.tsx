import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../lib/adminAuth';
import { AdminLayout } from './AdminLayout';
import { useData } from '../../contexts/DataContext';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { allArticles: articles, categories, authors, loading } = useData();

  useEffect(() => {
    if (!isAuthenticated()) navigate('/admin/login');
  }, [navigate]);

  const stats = [
    { label: 'المقالات', value: articles.filter(a => a.status === 'published').length, icon: '📝', color: 'green' },
    { label: 'المسودات', value: articles.filter(a => a.status === 'draft').length, icon: '📄', color: 'yellow' },
    { label: 'التصنيفات', value: categories.length, icon: '📂', color: 'blue' },
    { label: 'المؤلفون', value: authors.length, icon: '✍️', color: 'purple' },
    { label: 'إجمالي المشاهدات', value: articles.reduce((s, a) => s + (a.views || 0), 0).toLocaleString(), icon: '👁️', color: 'orange' },
    { label: 'ذاكرة التخزين', value: loading ? '...' : `${articles.length} مقال`, icon: '💾', color: 'pink' },
  ];

  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">📊 لوحة الإحصائيات</h1>
        <p className="text-gray-400">نظرة عامة على محتوى الموقع</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {stats.map(stat => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-white">📰 أحدث المقالات</h2>
          <span className="text-xs text-gray-500">{articles.length} مقال</span>
        </div>
        <div className="divide-y divide-gray-800">
          {recentArticles.map(article => (
            <div key={article.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{article.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {article.category} · {new Date(article.published_date).toLocaleDateString('ar-MA')} · {article.views?.toLocaleString()} 👁️
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                article.status === 'published' ? 'bg-green-900/50 text-green-400' :
                article.status === 'draft' ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-gray-800 text-gray-400'
              }`}>
                {article.status === 'published' ? 'منشور' : article.status === 'draft' ? 'مسودة' : 'مؤرشف'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-900/20 border border-green-800/30 rounded-2xl text-sm text-green-400">
        💡 تم تحميل {articles.length} مقال، {categories.length} تصنيف، {authors.length} مؤلف
      </div>
    </AdminLayout>
  );
}
