import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../lib/adminAuth';
import { AdminLayout } from './AdminLayout';
import { siteSettings, socialLinks, navigationMenus } from '../../data/settings';

export function SettingsManager() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) navigate('/admin/login');
  }, [navigate]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">⚙️ الإعدادات</h1>
        <p className="text-gray-400 text-sm mt-1">إعدادات الموقع العامة</p>
      </div>

      {/* Site Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">🌐 معلومات الموقع</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'اسم الموقع', value: siteSettings.name, key: 'name' },
            { label: 'الشعار', value: siteSettings.tagline, key: 'tagline' },
            { label: 'الوصف', value: siteSettings.description, key: 'description' },
            { label: 'الرابط', value: siteSettings.url, key: 'url' },
            { label: 'البريد الإلكتروني', value: siteSettings.email, key: 'email' },
            { label: 'لون العلامة', value: siteSettings.theme_color, key: 'theme_color' },
          ].map(item => (
            <div key={item.key}>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">{item.label}</label>
              <div className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 text-sm cursor-not-allowed opacity-70">
                {item.value}
              </div>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-4">💡 عدّل هذه القيم في <code className="text-green-400">src/data/settings.ts</code></p>
      </div>

      {/* Social Links */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">🔗 روابط التواصل</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialLinks.filter(s => s.active).map(social => (
            <div key={social.platform} className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-xl">
              <span className="text-lg">{social.platform === 'Facebook' ? '📘' : social.platform === 'Instagram' ? '📸' : social.platform === 'Pinterest' ? '📌' : social.platform === 'Twitter' ? '🐦' : '📺'}</span>
              <span className="text-gray-300 text-sm">{social.platform}</span>
              <span className="text-gray-500 text-xs ml-auto truncate">{social.url}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">📋 القوائم</h2>
        <div className="space-y-3">
          {navigationMenus.primary.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-xl">
              <span className="text-gray-400 text-xs">{item.order}</span>
              <span className="text-gray-300 text-sm font-semibold">{item.label}</span>
              <span className="text-gray-500 text-xs ml-auto">{item.url}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Environment */}
      <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-2xl p-5 mt-6">
        <h3 className="text-sm font-bold text-yellow-400 mb-2">⚙️ متغيرات البيئة</h3>
        <p className="text-yellow-300/70 text-xs">أنشئ ملف <code className="text-yellow-400">.env</code> في جذر المشروع:</p>
        <pre className="mt-2 bg-gray-950 rounded-xl p-4 text-yellow-200 text-xs font-mono leading-relaxed overflow-x-auto">
{`VITE_ADMIN_PASSWORD=your_password_here
VITE_GOOGLE_SHEETS_ID=your_sheet_id
VITE_GOOGLE_SHEETS_API_KEY=your_api_key
VITE_CLOUDFLARE_WORKER_URL=https://your-worker.workers.dev`}
        </pre>
      </div>
    </AdminLayout>
  );
}
