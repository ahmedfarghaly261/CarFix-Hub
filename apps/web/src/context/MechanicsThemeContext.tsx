import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const MechanicsThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const MechanicsThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
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

export const useMechanicsTheme = (): ThemeContextType => {
  const context = useContext(MechanicsThemeContext);
  if (!context) {
    throw new Error('useMechanicsTheme must be used within MechanicsThemeProvider');
  }
  return context;
};
