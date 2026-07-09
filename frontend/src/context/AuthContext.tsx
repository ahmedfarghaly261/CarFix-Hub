import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loginUser, logoutUser } from '@/modules/auth/services/auth.service';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(false); // Start with false since we use localStorage

  useEffect(() => {
    //  just localStorage
    // This prevents 401 errors and reload loops on initial page load
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await loginUser(email, password);
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* eslint-disable-next-line react-refresh/only-export-components */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/* eslint-disable-next-line react-refresh/only-export-components */
export default AuthContext;

