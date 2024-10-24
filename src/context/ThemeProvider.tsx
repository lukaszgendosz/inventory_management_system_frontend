
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextProps {
  themeMode: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);


export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState(localStorage.getItem('themeMode') ?? 'light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeMode(savedTheme);
    }
  }, []);
  
  useEffect(() => {
    if (themeMode) {
        localStorage.setItem('themeMode', themeMode);
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
