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

// Console suppression removed for cleaner code 