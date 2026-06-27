import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { ArticlesManager } from './admin/ArticlesManager';
import { CategoriesManager } from './admin/CategoriesManager';
import { AuthorsManager } from './admin/AuthorsManager';
import { AdsManager } from './admin/AdsManager';
import { SettingsManager } from './admin/SettingsManager';
import { ExportImport } from './admin/ExportImport';
import { isAuthenticated } from '../lib/adminAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

export function AdminPage() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="/" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="articles" element={<ProtectedRoute><ArticlesManager /></ProtectedRoute>} />
      <Route path="categories" element={<ProtectedRoute><CategoriesManager /></ProtectedRoute>} />
      <Route path="authors" element={<ProtectedRoute><AuthorsManager /></ProtectedRoute>} />
      <Route path="ads" element={<ProtectedRoute><AdsManager /></ProtectedRoute>} />
      <Route path="settings" element={<ProtectedRoute><SettingsManager /></ProtectedRoute>} />
      <Route path="export" element={<ProtectedRoute><ExportImport /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
