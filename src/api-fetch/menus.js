import { apiClient, buildQueryString } from './client';

// Menu management API endpoints
export const menusAPI = {
  // Get menus list
  getMenusList: async () => {
    try {
      const response = await apiClient.get('/api/menu/list');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get menu by ID
  getMenuById: async (id) => {
    try {
      const response = await apiClient.get(`/api/menu?id=${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new menu
  createMenu: async (menuData) => {
    try {
      const response = await apiClient.post('/api/menu', menuData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update existing menu
  updateMenu: async (menuData) => {
    try {
      const response = await apiClient.put('/api/menu', menuData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete menu
  deleteMenu: async (id) => {
    try {
      const response = await apiClient.put('/api/menu/del', { ids: [id] });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get menu tree structure
  getMenuTree: async () => {
    try {
      const response = await apiClient.get('/api/menu/list');
      // Assuming the API returns a flat list that needs to be converted to tree
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user accessible menus
  getUserMenus: async () => {
    try {
      const response = await apiClient.get('/api/menu/user');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default menusAPI; 