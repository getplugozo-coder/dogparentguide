import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../lib/adminAuth';
import { AdminLayout } from './AdminLayout';
import { dataService } from '../../lib/dataService';
import { authors as initialAuthors } from '../../data/authors';
import type { Author } from '../../data/types';

export function AuthorsManager() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Author[]>(() => {
    const stored = dataService.getAuthors();
    return stored.length ? stored : initialAuthors;
  });
  const [editing, setEditing] = useState<Author | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) navigate('/admin/login');
  }, [navigate]);

  const refresh = () => {
    const stored = dataService.getAuthors();
    setItems(stored.length ? stored : initialAuthors);
  };

  const handleDelete = (id: string) => {
    if (confirm('تأكيد الحذف؟')) { dataService.deleteAuthor(id); refresh(); }
  };

  if (editing) {
    return (
      <AdminLayout>
        <div className="max-w-lg">
          <h2 className="text-xl font-bold text-white mb-6">{editing.id === 'new' ? 'مؤلف جديد' : 'تعديل المؤلف'}</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            {(['name','slug','bio','avatar','role','credentials','twitter','instagram','email','post_count'] as const).map(field => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{field}</label>
                <input type="text" value={(editing as any)[field]?.toString() || ''} onChange={e => setEditing({...editing, [field]: field === 'post_count' ? parseInt(e.target.value) || 0 : e.target.value})}
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => { dataService.saveAuthor(editing); setEditing(null); refresh(); }} className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm">💾 حفظ</button>
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
        <div><h1 className="text-2xl font-bold text-white">✍️ المؤلفون</h1><p className="text-gray-400 text-sm">{items.length} مؤلف</p></div>
        <button onClick={() => setEditing({id: 'new', name: '', slug: '', bio: '', avatar: '', role: '', credentials: '', website: '', twitter: '', instagram: '', pinterest: '', facebook: '', email: '', post_count: 0, status: 'active'})}
          className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm">+ مؤلف جديد</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(author => (
          <div key={author.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="w-12 h-12 rounded-xl overflow-hidden mb-3 bg-gray-800">
              {author.avatar && <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />}
            </div>
            <h3 className="text-white font-bold text-sm">{author.name}</h3>
            <p className="text-gray-500 text-xs">{author.role}</p>
            <p className="text-gray-600 text-xs mt-1">{author.post_count} مقال</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setEditing({...author})} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs">تعديل</button>
              <button onClick={() => handleDelete(author.id)} className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
