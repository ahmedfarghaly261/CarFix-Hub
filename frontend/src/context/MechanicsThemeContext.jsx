import React, { createContext, useContext, useState, useEffect } from 'react';

const MechanicsThemeContext = createContext();

export const MechanicsThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('mechanicsDarkMode');
      return saved !== null ? JSON.parse(saved) : true; // Default to dark mode
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    localStorage.setItem('mechanicsDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <MechanicsThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </MechanicsThemeContext.Provider>
  );
};

export const useMechanicsTheme = () => {
  const context = useContext(MechanicsThemeContext);
  if (!context) {
    throw new Error('useMechanicsTheme must be used within MechanicsThemeProvider');
  }
  return context;
};
