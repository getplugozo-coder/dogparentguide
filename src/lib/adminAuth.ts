const SESSION_KEY = 'dpg_admin_session';
const SESSION_EXPIRY = 24 * 60 * 60 * 1000;

interface AdminSession {
  token: string;
  expiresAt: number;
}

export function isAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session: AdminSession = JSON.parse(raw);
    return session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function login(password: string): boolean {
  const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  if (password === validPassword) {
    const session: AdminSession = {
      token: btoa(`${password}:${Date.now()}`),
      expiresAt: Date.now() + SESSION_EXPIRY,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function requireAuth(navigate: (path: string) => void): void {
  if (!isAuthenticated()) {
    navigate('/admin/login');
  }
}
