import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../lib/adminAuth';
import { AdminLayout } from './AdminLayout';
import { dataService } from '../../lib/dataService';

export function ExportImport() {
  const navigate = useNavigate();
  const [json, setJson] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) navigate('/admin/login');
  }, [navigate]);

  const handleExport = () => {
    const exported = dataService.exportAll();
    setJson(exported);
    const blob = new Blob([exported], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dogparentguide-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('✅ تم التصدير بنجاح');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImport = () => {
    if (!json.trim()) { setMessage('⚠️ الرجاء لصق البيانات أولاً'); return; }
    if (dataService.importAll(json)) {
      setMessage('✅ تم الاستيراد بنجاح');
    } else {
      setMessage('❌ فشل الاستيراد. تأكد من صيغة JSON');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">📦 تصدير واستيراد البيانات</h1>
        <p className="text-gray-400 text-sm mt-1">تصدير جميع البيانات إلى JSON أو استيرادها</p>
      </div>

      {message && (
        <div className="mb-6 px-5 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-white">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <button onClick={handleExport} className="bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl p-8 text-center transition-colors">
          <div className="text-3xl mb-3">📥</div>
          <p className="text-lg">تصدير البيانات</p>
          <p className="text-green-200 text-sm mt-1">تحميل ملف JSON يحتوي على كل المقالات والتصنيفات</p>
        </button>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="text-3xl mb-3">📤</div>
          <p className="text-lg font-bold text-white mb-4">استيراد البيانات</p>
          <textarea
            value={json}
            onChange={e => setJson(e.target.value)}
            placeholder="الصق محتوى JSON هنا..."
            rows={6}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          />
          <button onClick={handleImport} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-sm">
            استيراد
          </button>
        </div>
      </div>

      {/* Google Sheets Instructions */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">📊 Google Sheets - تعليمات الربط</h2>
        <ol className="space-y-3 text-sm text-gray-300" dir="rtl">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</span>
            <span>أنشئ Google Sheet جديد وسمّ الأوراق (Sheets) بالأسماء: <code className="text-green-400">Articles</code>، <code className="text-green-400">Categories</code>، <code className="text-green-400">Authors</code>، <code className="text-green-400">Ads</code>، <code className="text-green-400">Settings</code></span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
            <span>اجعل الـ Sheet عاماً للقراءة (Share → Anyone with link → Viewer)</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
            <span>فعّل Google Sheets API في Google Cloud Console وأنشئ API Key</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">4</span>
            <span>أضف المتغيرات في Cloudflare Pages Dashboard: Settings → Environment Variables</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">5</span>
            <span>أعد بناء الموقع: <code className="text-green-400">npm run build</code> أو انتظر Cloudflare Pages rebuild</span>
          </li>
        </ol>
      </div>
    </AdminLayout>
  );
}
