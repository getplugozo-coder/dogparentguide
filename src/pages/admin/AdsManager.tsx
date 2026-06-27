import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../lib/adminAuth';
import { AdminLayout } from './AdminLayout';
import { dataService } from '../../lib/dataService';
import type { Ad, AdPlacement } from '../../data/types';

const placements: AdPlacement[] = [
  'header_banner', 'below_header', 'sidebar_top', 'sidebar_bottom',
  'inside_article', 'middle_article', 'before_conclusion', 'after_article',
  'footer', 'mobile_sticky',
];

const placementLabels: Record<AdPlacement, string> = {
  header_banner: 'رأس الصفحة - Banner',
  below_header: 'أسفل الرأس',
  sidebar_top: 'الشريط الجانبي - أعلى',
  sidebar_bottom: 'الشريط الجانبي - أسفل',
  inside_article: 'داخل المقالة',
  middle_article: 'وسط المقالة',
  before_conclusion: 'قبل الخاتمة',
  after_article: 'بعد المقالة',
  footer: 'التذييل',
  mobile_sticky: 'ثابت للجوال',
};

const networkOptions = [
  { id: 'adsense', label: 'Google AdSense' },
  { id: 'ezoic', label: 'Ezoic' },
  { id: 'mediavine', label: 'Mediavine' },
  { id: 'adsterra', label: 'Adsterra' },
  { id: 'propellerads', label: 'PropellerAds' },
  { id: 'custom', label: 'كود مخصص (HTML)' },
];

export function AdsManager() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Ad[]>(() => dataService.getAds());
  const [editing, setEditing] = useState<Ad | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) navigate('/admin/login');
  }, [navigate]);

  const refresh = () => setItems(dataService.getAds());

  const handleDelete = (id: string) => {
    if (confirm('تأكيد الحذف؟')) { dataService.deleteAd(id); refresh(); }
  };

  const emptyAd = (): Ad => ({
    id: Date.now().toString(), name: '', placement: 'sidebar_top', ad_code: '', active: false,
    start_date: '', end_date: '', pages: 'all',
  });

  if (editing) {
    return (
      <AdminLayout>
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-6">{editing.id === 'new' ? 'إعلان جديد' : 'تعديل الإعلان'}</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">اسم الإعلان</label>
              <input type="text" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">شبكة الإعلانات</label>
              <select value={editing.ad_code.includes('adsense') ? 'adsense' : editing.ad_code.includes('ezoic') ? 'ezoic' : 'custom'}
                onChange={e => setEditing({...editing, ad_code: e.target.value === 'adsense' ? '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto"></ins>' : e.target.value === 'ezoic' ? '<!--Ezoic ad placeholder-->' : ''})}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {networkOptions.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">الموضع</label>
              <select value={editing.placement} onChange={e => setEditing({...editing, placement: e.target.value as AdPlacement})}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {placements.map(p => <option key={p} value={p}>{placementLabels[p]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">كود الإعلان (HTML)</label>
              <textarea value={editing.ad_code} onChange={e => setEditing({...editing, ad_code: e.target.value})} rows={5}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-xs" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={editing.active} onChange={e => setEditing({...editing, active: e.target.checked})}
                className="rounded bg-gray-800 border-gray-600 text-green-500 focus:ring-green-500" />
              مفعل
            </label>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { dataService.saveAd(editing); setEditing(null); refresh(); }} className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm">💾 حفظ</button>
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
        <div><h1 className="text-2xl font-bold text-white">💰 إدارة الإعلانات</h1><p className="text-gray-400 text-sm">{items.length} إعلان · {items.filter(a => a.active).length} مفعل</p></div>
        <button onClick={() => setEditing({...emptyAd(), id: 'new'})} className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl text-sm">+ إعلان جديد</button>
      </div>

      <div className="grid gap-4">
        {items.map(ad => (
          <div key={ad.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-white font-bold text-sm">{ad.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ad.active ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                  {ad.active ? 'مفعل' : 'معطل'}
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-1">{placementLabels[ad.placement]} · {ad.pages === 'all' ? 'جميع الصفحات' : ad.pages}</p>
              <div className="mt-2 bg-gray-800 rounded-lg p-2 text-gray-400 text-xs font-mono truncate max-w-xl">{ad.ad_code.substring(0, 100)}...</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing({...ad})} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs">تعديل</button>
              <button onClick={() => handleDelete(ad.id)} className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs">حذف</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center text-gray-500">
            <div className="text-3xl mb-3">📢</div>
            <p>لا توجد إعلانات بعد. أضف إعلانك الأول!</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
