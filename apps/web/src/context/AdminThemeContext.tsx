import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const AdminThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
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

export const useAdminTheme = (): ThemeContextType => {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider');
  }
  return context;
};
