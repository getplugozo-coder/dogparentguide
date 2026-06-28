import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../lib/adminAuth';
import { AdminLayout } from './AdminLayout';
import { dataService } from '../../lib/dataService';
import { useData } from '../../contexts/DataContext';
import { articles as initialArticles } from '../../data/articles';
import { categories } from '../../data/categories';
import type { Article } from '../../data/types';

export function ArticlesManager() {
  const navigate = useNavigate();
  const { refresh: refreshContext } = useData();
  const [items, setItems] = useState<Article[]>(() => {
    const stored = dataService.getArticles();
    return stored.length ? stored : initialArticles;
  });
  const [editing, setEditing] = useState<Article | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) navigate('/admin/login');
  }, [navigate]);

  const refresh = () => {
    const stored = dataService.getArticles();
    setItems(stored.length ? stored : initialArticles);
  };

  const handleDelete = (id: string) => {
    if (confirm('تأكيد حذف المقال؟')) {
      dataService.deleteArticle(id);
      refresh();
      refreshContext();
    }
  };

  const handleSave = async (article: Article) => {
    await dataService.saveArticle(article);
    setEditing(null);
    setIsNew(false);
    refresh();
    refreshContext();
  };

  const filtered = items.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  if (editing) {
    return <ArticleForm article={editing} isNew={isNew} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} categories={categories} />;
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📝 إدارة المقالات</h1>
          <p className="text-gray-400 text-sm mt-1">{items.length} مقال</p>
        </div>
        <button
          onClick={() => { setEditing(createEmpty()); setIsNew(true); }}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors text-sm"
        >
          + مقال جديد
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="🔍 بحث في المقالات..."
        className="w-full px-5 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6 text-sm"
      />

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs">
                <th className="text-right px-5 py-4 font-medium">العنوان</th>
                <th className="text-right px-5 py-4 font-medium">التصنيف</th>
                <th className="text-right px-5 py-4 font-medium">الحالة</th>
                <th className="text-right px-5 py-4 font-medium">التاريخ</th>
                <th className="text-right px-5 py-4 font-medium">المشاهدات</th>
                <th className="text-right px-5 py-4 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map(article => (
                <tr key={article.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-white font-semibold truncate max-w-xs">{article.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{article.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-300">{article.category}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      article.status === 'published' ? 'bg-green-900/50 text-green-400' :
                      article.status === 'draft' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {article.status === 'published' ? 'منشور' : article.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{article.published_date}</td>
                  <td className="px-5 py-4 text-gray-400">{article.views?.toLocaleString() || '0'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing({...article}); setIsNew(false); }} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 transition-colors">تعديل</button>
                      <button onClick={() => handleDelete(article.id)} className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30 transition-colors">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">لا توجد مقالات</div>
        )}
      </div>
    </AdminLayout>
  );
}

function ArticleForm({ article, isNew, onSave, onCancel, categories }: {
  article: Article; isNew: boolean; onSave: (a: Article) => void; onCancel: () => void; categories: any[];
}) {
  const [form, setForm] = useState<Article>(article);
  const [preview, setPreview] = useState(false);

  const handleChange = (field: keyof Article, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'title') {
      setForm(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '') }));
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{isNew ? '📝 مقال جديد' : '✏️ تعديل المقال'}</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors text-sm">إلغاء</button>
          <button onClick={() => onSave(form)} className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors text-sm">💾 حفظ</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">العنوان *</label>
              <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">الرابط (Slug)</label>
              <input type="text" value={form.slug} onChange={e => handleChange('slug', e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono" />
              <p className="text-gray-500 text-xs mt-1">/{form.slug}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">الوصف المختصر (Excerpt)</label>
              <textarea value={form.excerpt} onChange={e => handleChange('excerpt', e.target.value)} rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">المحتوى (HTML)</label>
              <textarea value={form.content_html} onChange={e => handleChange('content_html', e.target.value)} rows={15}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-xs leading-relaxed" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">الإعدادات</h3>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">التصنيف</label>
              <select value={form.category} onChange={e => handleChange('category', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">الحالة</label>
              <select value={form.status} onChange={e => handleChange('status', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
                <option value="archived">مؤرشف</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">المؤلف</label>
              <input type="text" value={form.author} onChange={e => handleChange('author', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">وقت القراءة (دقائق)</label>
              <input type="number" value={form.reading_time} onChange={e => handleChange('reading_time', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={form.featured} onChange={e => handleChange('featured', e.target.checked)}
                  className="rounded bg-gray-800 border-gray-600 text-green-500 focus:ring-green-500" />
                مميز
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={form.trending} onChange={e => handleChange('trending', e.target.checked)}
                  className="rounded bg-gray-800 border-gray-600 text-green-500 focus:ring-green-500" />
                رائج
              </label>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">🔍 SEO</h3>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">SEO Title</label>
              <input type="text" value={form.seo_title} onChange={e => handleChange('seo_title', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Meta Description</label>
              <textarea value={form.meta_description} onChange={e => handleChange('meta_description', e.target.value)} rows={3}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              <p className="text-gray-500 text-xs mt-1">{form.meta_description.length}/160 حرف</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">الكلمات المفتاحية (Tags)</label>
              <input type="text" value={form.tags.join(', ')} onChange={e => handleChange('tags', e.target.value.split(',').map(t => t.trim()))}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              <p className="text-gray-500 text-xs mt-1">مفصولة بفواصل</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">صورة المقال</label>
              <input type="text" value={form.featured_image} onChange={e => handleChange('featured_image', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">التاريخ</label>
              <input type="date" value={form.published_date} onChange={e => handleChange('published_date', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function createEmpty(): Article {
  return {
    id: Date.now().toString(),
    title: '',
    slug: '',
    seo_title: '',
    meta_description: '',
    excerpt: '',
    content_html: '',
    featured_image: '/images/hero-dog.jpg',
    category: 'nutrition',
    tags: [],
    author: 'dr-sarah-johnson',
    published_date: new Date().toISOString().split('T')[0],
    updated_date: new Date().toISOString().split('T')[0],
    featured: false,
    trending: false,
    faq_json: [],
    schema_type: 'Article',
    reading_time: 5,
    canonical: '',
    status: 'draft',
    views: 0,
  };
}
