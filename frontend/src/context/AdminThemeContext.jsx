import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminThemeContext = createContext();

export const AdminThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('adminDarkMode');
      return saved !== null ? JSON.parse(saved) : false; // Default to light mode for Admin
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('adminDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AdminThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider');
  }
  return context;
};
