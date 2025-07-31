'use client';

import React from 'react';
import { Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ size = 'middle', style = {} }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      size={size}
      style={style}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    />
  );
};

export default ThemeToggle; 