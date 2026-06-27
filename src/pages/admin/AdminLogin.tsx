import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../lib/adminAuth';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('كلمة المرور غير صحيحة');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
            <p className="text-gray-400 text-sm mt-1">تسجيل الدخول للإدارة</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm text-center"
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-800 text-red-300 text-sm rounded-xl p-3 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-colors"
            >
              دخول →
            </button>
          </form>

          <p className="text-gray-600 text-xs text-center mt-6">
            المسار: /admin/login
          </p>
        </div>
      </div>
    </div>
  );
}
