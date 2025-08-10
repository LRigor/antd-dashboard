/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress specific warnings
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Suppress console warnings in production
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Webpack configuration to suppress specific warnings
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Suppress specific warnings in production
      config.ignoreWarnings = [
        /\[antd: compatible\]/,
        /antd v5 support React/,
        /see https:\/\/u\.ant\.design\/v5-for-19/,
      ];
    }
    return config;
  },
};

export default nextConfig;
