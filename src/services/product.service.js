

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

console.log('🔗 API Base URL:', API_BASE_URL);

// Helper function for fetch requests
const fetchRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  const fullUrl = `${API_BASE_URL}${url}`;
  
  try {
    const response = await fetch(fullUrl, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

export const productService = {
  async getAllProducts(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `/products${queryParams ? `?${queryParams}` : ''}`;
    return await fetchRequest(url, { method: 'GET' });
  },

  async getProductById(id) {
    return await fetchRequest(`/products/${id}`, { method: 'GET' });
  },

  // ✅ Fixed: Use /products/featured endpoint
  async getFeaturedProducts(limit = 8) {
    return await fetchRequest(`/products/featured?limit=${limit}`, { method: 'GET' });
  },

  // ✅ Fixed: Use /products with sort parameter
  async getNewArrivals(limit = 8) {
    return await fetchRequest(`/products?sort=-createdAt&limit=${limit}`, { method: 'GET' });
  },

  async searchProducts(query, category = '') {
    const params = { search: query };
    if (category) params.category = category;
    const queryParams = new URLSearchParams(params).toString();
    return await fetchRequest(`/products?${queryParams}`, { method: 'GET' });
  },

  async getProductsByCategory(category, page = 1, limit = 20) {
    const queryParams = new URLSearchParams({ category, page, limit }).toString();
    return await fetchRequest(`/products?${queryParams}`, { method: 'GET' });
  },

  async getProductsOnSale(limit = 8) {
    return await fetchRequest(`/products?onSale=true&limit=${limit}`, { method: 'GET' });
  },
};