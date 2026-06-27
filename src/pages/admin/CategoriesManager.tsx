import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../lib/adminAuth';
import { AdminLayout } from './AdminLayout';
import { dataService } from '../../lib/dataService';
import { categories as initialCats } from '../../data/categories';
import type { Category } from '../../data/types';

export function CategoriesManager() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Category[]>(() => {
    const stored = dataService.getCategories();
    return stored.length ? stored : initialCats;
  });
  const [editing, setEditing] = useState<Category | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) navigate('/admin/login');
  }, [navigate]);

  const refresh = () => {
    const stored = dataService.getCategories();
    setItems(stored.length ? stored : initialCats);
  };

  const handleDelete = (id: string) => {
    if (confirm('تأكيد الحذف؟')) { dataService.deleteCategory(id); refresh(); }
  };

  const emptyCat = (): Category => ({
    id: Date.now().toString(), name: '', slug: '', description: '', icon: '📂', color: '#22c55e',
    featured_image: '', seo_title: '', meta_description: '', parent_category: '', post_count: 0, order: 0, status: 'active',
  });

  if (editing) {
    return (
      <AdminLayout>
        <div className="max-w-lg">
          <h2 className="text-xl font-bold text-white mb-6">{editing.id === 'new' ? 'تصنيف جديد' : 'تعديل التصنيف'}</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            {(['name','slug','description','icon','color','seo_title','meta_description'] as const).map(field => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{field}</label>
                <input type="text" value={(editing as any)[field]} onChange={e => setEditing({...editing, [field]: e.target.value})}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => { dataService.saveCategory(editing); setEditing(null); refresh(); }} className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors text-sm">💾 حفظ</button>
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm">إلغاء</button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">📂 التصنيفات</h1><p className="text-gray-400 text-sm">{items.length} تصنيف</p></div>
        <button onClick={() => setEditing({...emptyCat(), id: 'new'})} className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm">+ تصنيف جديد</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(cat => (
          <div key={cat.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="text-2xl mb-2">{cat.icon}</div>
            <h3 className="text-white font-bold text-sm">{cat.name}</h3>
            <p className="text-gray-500 text-xs mt-1">{cat.post_count} مقال</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditing({...cat})} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs hover:bg-blue-600/30 transition-colors">تعديل</button>
              <button onClick={() => handleDelete(cat.id)} className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30 transition-colors">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
