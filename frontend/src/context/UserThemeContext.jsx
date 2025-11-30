import React, { createContext, useContext, useState, useEffect } from 'react';

const UserThemeContext = createContext();

export const UserThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
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

export const useUserTheme = () => {
  const context = useContext(UserThemeContext);
  if (!context) {
    throw new Error('useUserTheme must be used within UserThemeProvider');
  }
  return context;
};
