'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Save theme preference to localStorage and update HTML attribute
  useEffect(() => {
    const themeValue = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', themeValue);
    
    // Set data-theme attribute on html element
    document.documentElement.setAttribute('data-theme', themeValue);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setTheme = (theme) => {
    setIsDarkMode(theme === 'dark');
  };

  // Ant Design theme configuration
  const antdTheme = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
    components: {
      Layout: {
        bodyBg: isDarkMode ? '#1f1f1f' : '#ffffff',
        headerBg: isDarkMode ? '#001529' : '#ffffff',
        siderBg: isDarkMode ? '#001529' : '#ffffff',
      },
      Menu: {
        darkItemBg: isDarkMode ? '#001529' : '#ffffff',
        darkItemSelectedBg: isDarkMode ? '#1890ff' : '#e6f7ff',
      },
      Card: {
        headerBg: isDarkMode ? '#1f1f1f' : '#fafafa',
      },
      Table: {
        headerBg: isDarkMode ? '#1f1f1f' : '#fafafa',
      },
    },
  };

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme,
    theme: isDarkMode ? 'dark' : 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antdTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}; 