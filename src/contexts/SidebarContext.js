'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create the sidebar context
const SidebarContext = createContext();

// Custom hook to use the sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Sidebar provider component
export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState([]);

  // Initialize collapse state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCollapsed = localStorage.getItem('sidebar-collapsed');
      if (savedCollapsed !== null) {
        setCollapsed(JSON.parse(savedCollapsed));
      }
      
      const savedExpandedKeys = localStorage.getItem('sidebar-expanded-keys');
      if (savedExpandedKeys !== null) {
        setExpandedKeys(JSON.parse(savedExpandedKeys));
      }
      
      // Check initial screen size
      checkScreenSize();
      
      // Add resize listener
      window.addEventListener('resize', checkScreenSize);
      
      return () => {
        window.removeEventListener('resize', checkScreenSize);
      };
    }
  }, []);

  // Check screen size and handle responsive behavior
  const checkScreenSize = () => {
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-collapse on mobile if not already collapsed
      if (mobile && !collapsed) {
        setCollapsed(true);
      }
    }
  };

  // Save collapse state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
    }
  }, [collapsed]);

  // Save expanded keys to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-expanded-keys', JSON.stringify(expandedKeys));
    }
  }, [expandedKeys]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const setCollapsedState = (newCollapsed) => {
    setCollapsed(newCollapsed);
    
    // Clear expanded keys when collapsing the sidebar
    if (newCollapsed) {
      setExpandedKeys([]);
    }
  };

  const setExpandedKeysState = (keys) => {
    setExpandedKeys(keys);
  };

  const value = {
    collapsed,
    isMobile,
    expandedKeys,
    toggleCollapsed,
    setCollapsed: setCollapsedState,
    setExpandedKeys: setExpandedKeysState,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}; 