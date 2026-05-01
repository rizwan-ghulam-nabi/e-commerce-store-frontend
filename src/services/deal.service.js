const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const dealService = {
  // Get all active deals
  getDeals: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/deals?${queryString}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  // Get single deal
  getDeal: async (id) => {
    const response = await fetch(`${API_URL}/deals/${id}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  // Get featured deals
  getFeaturedDeals: async (limit = 4) => {
    const response = await fetch(`${API_URL}/deals?featured=true&limit=${limit}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  // Get active deals only
  getActiveDeals: async (limit = 4) => {
    const response = await fetch(`${API_URL}/deals?isActive=true&limit=${limit}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },
};