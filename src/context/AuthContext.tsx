import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AuthSession,
  clearSession,
  loadSession,
  loginUser,
  registerUser,
} from '@/storage/appStorage';

type AuthContextValue = {
  isReady: boolean;
  user: AuthSession | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<AuthSession | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const session = await loadSession();
      if (!active) return;
      setUser(session);
      setIsReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser({ email, password });
    if (!result.ok) return { ok: false, message: result.message };
    setUser(result.session);
    return { ok: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const result = await registerUser({ name, email, password });
    if (!result.ok) return { ok: false, message: result.message };
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      user,
      isLoggedIn: !!user,
      login,
      signup,
      logout,
    }),
    [isReady, user, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
