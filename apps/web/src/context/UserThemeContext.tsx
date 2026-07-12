import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const UserThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const UserThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('userDarkMode');
      return saved !== null ? JSON.parse(saved) : false; // Default to light mode for User
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('userDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <UserThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </UserThemeContext.Provider>
  );
};

export const useUserTheme = (): ThemeContextType => {
  const context = useContext(UserThemeContext);
  if (!context) {
    throw new Error('useUserTheme must be used within UserThemeProvider');
  }
  return context;
};
