// // src/lib/categoriesStore.js
// let categories = [];
// let listeners = [];
// let lastFetchTimestamp = null;
// let fetchPromise = null;
// const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
// const MIN_FETCH_INTERVAL = 5000; // 5 seconds between calls

// // Default categories as fallback when API is unavailable
// const DEFAULT_CATEGORIES = [
//   { _id: '1', name: 'Electronics', slug: 'electronics' },
//   { _id: '2', name: 'Fashion', slug: 'fashion' },
//   { _id: '3', name: 'Home & Kitchen', slug: 'home-kitchen' },
//   { _id: '4', name: 'Beauty', slug: 'beauty' },
//   { _id: '5', name: 'Sports', slug: 'sports' },
//   { _id: '6', name: 'Books', slug: 'books' },
// ];

// export const categoriesStore = {
//   getCategories() {
//     return categories.length > 0 ? categories : DEFAULT_CATEGORIES;
//   },
  
//   setCategories(newCategories) {
//     if (Array.isArray(newCategories) && newCategories.length > 0) {
//       categories = newCategories;
//       lastFetchTimestamp = Date.now();
//       listeners.forEach(listener => listener(categories));
//     }
//   },
  
//   subscribe(listener) {
//     listeners.push(listener);
//     return () => {
//       listeners = listeners.filter(l => l !== listener);
//     };
//   },
  
//   async fetchCategories(force = false) {
//     // If already fetching, return the existing promise
//     if (fetchPromise) {
//       return fetchPromise;
//     }
    
//     // Don't fetch if we fetched recently
//     if (!force && lastFetchTimestamp && (Date.now() - lastFetchTimestamp < MIN_FETCH_INTERVAL)) {
//       return this.getCategories();
//     }
    
//     // Return cached if fresh enough
//     if (!force && categories.length > 0 && lastFetchTimestamp && (Date.now() - lastFetchTimestamp < CACHE_DURATION)) {
//       return categories;
//     }
    
//     fetchPromise = this._doFetch();
    
//     try {
//       const result = await fetchPromise;
//       return result;
//     } finally {
//       fetchPromise = null;
//     }
//   },
  
//   async _doFetch() {
//     try {
//       const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
//       const response = await fetch(`${API_BASE}/categories`, {
//         headers: { 
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//       });
      
//       // If rate limited, return current categories or defaults
//       if (response.status === 429) {
//         console.warn('Categories API rate limited (429), using cached/default data');
//         return this.getCategories();
//       }
      
//       if (!response.ok) {
//         console.warn(`Categories API returned ${response.status}`);
//         return this.getCategories();
//       }
      
//       const data = await response.json();
//       let categoriesData = [];
      
//       // Handle different response formats
//       if (data.data?.categories) {
//         categoriesData = data.data.categories;
//       } else if (data.categories) {
//         categoriesData = data.categories;
//       } else if (data.data && Array.isArray(data.data)) {
//         categoriesData = data.data;
//       } else if (Array.isArray(data)) {
//         categoriesData = data;
//       }
      
//       if (Array.isArray(categoriesData) && categoriesData.length > 0) {
//         this.setCategories(categoriesData);
//         return categoriesData;
//       }
      
//       return this.getCategories();
      
//     } catch (error) {
//       console.error('Error fetching categories:', error.message);
//       return this.getCategories();
//     }
//   },
  
//   invalidateCache() {
//     lastFetchTimestamp = null;
//     categories = [];
//   }
// };

// export function clearCategoriesCache() {
//   categoriesStore.invalidateCache();
//   if (typeof window !== 'undefined') {
//     window.dispatchEvent(new Event('categoriesCacheClear'));
//   }
// }






























// src/lib/categoriesStore.js
let categories = [];
let listeners = [];
let lastFetchTimestamp = null;
let fetchPromise = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const MIN_FETCH_INTERVAL = 5000; // 5 seconds between calls

// NO DEFAULT CATEGORIES - only real data from products

export const categoriesStore = {
  getCategories() {
    return categories;
  },
  
  setCategories(newCategories) {
    if (Array.isArray(newCategories) && newCategories.length > 0) {
      categories = newCategories;
      lastFetchTimestamp = Date.now();
      listeners.forEach(listener => listener(categories));
    }
  },
  
  subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  
  async fetchCategories(force = false) {
    // If already fetching, return the existing promise
    if (fetchPromise) {
      return fetchPromise;
    }
    
    // Don't fetch if we fetched recently
    if (!force && lastFetchTimestamp && (Date.now() - lastFetchTimestamp < MIN_FETCH_INTERVAL)) {
      return this.getCategories();
    }
    
    // Return cached if fresh enough
    if (!force && categories.length > 0 && lastFetchTimestamp && (Date.now() - lastFetchTimestamp < CACHE_DURATION)) {
      return categories;
    }
    
    fetchPromise = this._doFetch();
    
    try {
      const result = await fetchPromise;
      return result;
    } finally {
      fetchPromise = null;
    }
  },
  
  async _doFetch() {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      
      // Fetch products to extract real categories
      const response = await fetch(`${API_BASE}/products?limit=200`, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      
      if (!response.ok) {
        console.warn(`Products API returned ${response.status}`);
        return [];
      }
      
      const data = await response.json();
      
      // Extract products array
      let products = [];
      if (data.data?.products) products = data.data.products;
      else if (data.data && Array.isArray(data.data)) products = data.data;
      else if (data.products && Array.isArray(data.products)) products = data.products;
      else if (Array.isArray(data)) products = data;
      
      if (products.length === 0) {
        console.warn('No products found to extract categories');
        return [];
      }
      
      // Extract unique categories from products
      const categoryMap = new Map();
      
      products.forEach(product => {
        // Check if product has category
        if (product.category) {
          const category = product.category;
          
          // Handle different category formats
          let categoryId, categoryName, categorySlug;
          
          if (typeof category === 'object') {
            categoryId = category._id || category.id;
            categoryName = category.name;
            categorySlug = category.slug || categoryName?.toLowerCase().replace(/ /g, '-');
          } else if (typeof category === 'string') {
            categoryId = category;
            categoryName = category;
            categorySlug = category.toLowerCase().replace(/ /g, '-');
          }
          
          if (categoryId && categoryName) {
            if (!categoryMap.has(categoryId)) {
              categoryMap.set(categoryId, {
                _id: categoryId,
                name: categoryName,
                slug: categorySlug,
                productCount: 1
              });
            } else {
              const existing = categoryMap.get(categoryId);
              existing.productCount += 1;
              categoryMap.set(categoryId, existing);
            }
          }
        }
      });
      
      const extractedCategories = Array.from(categoryMap.values());
      
      if (extractedCategories.length > 0) {
        console.log(`✅ Extracted ${extractedCategories.length} categories from products`);
        this.setCategories(extractedCategories);
        return extractedCategories;
      }
      
      console.warn('No categories found in products');
      return [];
      
    } catch (error) {
      console.error('Error fetching categories from products:', error.message);
      return [];
    }
  },
  
  invalidateCache() {
    lastFetchTimestamp = null;
    categories = [];
  }
};

export function clearCategoriesCache() {
  categoriesStore.invalidateCache();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('categoriesCacheClear'));
  }
}