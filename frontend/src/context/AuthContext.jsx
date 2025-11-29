import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, logoutUser, getCurrentUser } from '../services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false); // Start with false since we use localStorage

  useEffect(() => {
    //  just localStorage
    // This prevents 401 errors and reload loops on initial page load
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
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

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
