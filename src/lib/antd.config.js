import { theme } from 'antd';

// Ant Design configuration for React 18+ compatibility
export const antdConfig = {
  theme: {
    algorithm: theme.defaultAlgorithm,
    token: {
      // Customize your theme tokens here
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  },
  // Suppress compatibility warnings
  legacy: false,
  // Component size configuration
  componentSize: 'middle',
  // Suppress specific warnings
  warning: false,
};

// Suppress console warnings for Ant Design compatibility
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Suppress Ant Design compatibility warnings
    if (args[0] && typeof args[0] === 'string') {
      const message = args[0];
      if (message.includes('[antd: compatible]') || 
          message.includes('antd v5 support React') ||
          message.includes('see https://u.ant.design/v5-for-19')) {
        return; // Suppress these specific warnings
      }
    }
    originalWarn.apply(console, args);
  };
  
  // Also suppress error warnings that might be related
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string') {
      const message = args[0];
      if (message.includes('[antd: compatible]') || 
          message.includes('antd v5 support React')) {
        return; // Suppress these specific errors
      }
    }
    originalError.apply(console, args);
  };
} 