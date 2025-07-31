'use client';

import { useTheme } from '../contexts/ThemeContext';

export const useThemeMode = () => {
  const { isDarkMode, toggleTheme, setTheme, theme } = useTheme();
  
  return {
    isDark: isDarkMode,
    isLight: !isDarkMode,
    theme,
    toggle: toggleTheme,
    setLight: () => setTheme('light'),
    setDark: () => setTheme('dark'),
  };
}; 