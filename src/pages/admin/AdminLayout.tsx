import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../lib/adminAuth';

const navItems = [
  { path: '/admin', label: '📊 الإحصائيات', icon: 'dashboard' },
  { path: '/admin/articles', label: '📝 المقالات', icon: 'articles' },
  { path: '/admin/categories', label: '📂 التصنيفات', icon: 'categories' },
  { path: '/admin/authors', label: '✍️ المؤلفون', icon: 'authors' },
  { path: '/admin/ads', label: '💰 الإعلانات', icon: 'ads' },
  { path: '/admin/settings', label: '⚙️ الإعدادات', icon: 'settings' },
  { path: '/admin/export', label: '📦 تصدير/استيراد', icon: 'export' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-l border-gray-800 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-800">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <span className="font-bold text-white text-sm">
              Dog<span className="text-green-500">Parent</span><span className="text-orange-500">Guide</span>
            </span>
          </Link>
          <p className="text-gray-500 text-xs mt-1">لوحة التحكم</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-green-600/20 text-green-400 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full"
          >
            🌐 عرض الموقع
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors w-full"
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
