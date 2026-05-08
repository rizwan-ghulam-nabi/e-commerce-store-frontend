// 'use client';

// import { useState, useEffect } from 'react';
// import { categoriesStore } from '../lib/categoriesStore';         


// export function useCategoriesData() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [mounted, setMounted] = useState(false);
//   const initializedRef = useRef(false);

//   useEffect(() => {
//     setMounted(true);
    
//     // Only fetch once
//     if (!initializedRef.current) {
//       initializedRef.current = true;
//       loadCategories(false);
//     }

//     const unsubscribe = categoriesStore.subscribe((newCategories) => {
//       if (Array.isArray(newCategories)) {
//         setCategories(newCategories);
//         setLoading(false);
//         setError(null);
//       }
//     });

//     const handleCacheClear = () => {
//       categoriesStore.invalidateCache();
//       loadCategories(true);
//     };

//     window.addEventListener('categoriesCacheClear', handleCacheClear);

//     return () => {
//       unsubscribe();
//       window.removeEventListener('categoriesCacheClear', handleCacheClear);
//     };
//   }, []);

//   const loadCategories = async (force = false) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await categoriesStore.fetchCategories(force);
//       if (Array.isArray(data)) {
//         setCategories(data);
//       }
//     } catch (err) {
//       console.error('Hook error:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };


//   if (!mounted) {
//     return { 
//       categories: [], 
//       loading: true, 
//       error: null, 
//       refetch: () => {} 
//     };
//   }

//   return { 
//     categories: Array.isArray(categories) ? categories : [], 
//     loading, 
//     error, 
//     refetch: () => loadCategories(true) 
//   };
// }






// 'use client';

// import { useState, useEffect, useRef } from 'react'; // Added useRef here
// import { categoriesStore } from '../lib/categoriesStore';

// export function useCategoriesData() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [mounted, setMounted] = useState(false);
//   const initializedRef = useRef(false);

//   useEffect(() => {
//     setMounted(true);
    
//     // Only fetch once
//     if (!initializedRef.current) {
//       initializedRef.current = true;
//       loadCategories(false);
//     }

//     const unsubscribe = categoriesStore.subscribe((newCategories) => {
//       if (Array.isArray(newCategories)) {
//         setCategories(newCategories);
//         setLoading(false);
//         setError(null);
//       }
//     });

//     const handleCacheClear = () => {
//       categoriesStore.invalidateCache();
//       loadCategories(true);
//     };

//     window.addEventListener('categoriesCacheClear', handleCacheClear);

//     return () => {
//       unsubscribe();
//       window.removeEventListener('categoriesCacheClear', handleCacheClear);
//     };
//   }, []);

//   const loadCategories = async (force = false) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await categoriesStore.fetchCategories(force);
//       if (Array.isArray(data)) {
//         setCategories(data);
//       }
//     } catch (err) {
//       console.error('Hook error:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!mounted) {
//     return { 
//       categories: [], 
//       loading: true, 
//       error: null, 
//       refetch: () => {} 
//     };
//   }

//   return { 
//     categories: Array.isArray(categories) ? categories : [], 
//     loading, 
//     error, 
//     refetch: () => loadCategories(true) 
//   };
// }













































'use client';

import { useState, useEffect, useRef } from 'react';
import { categoriesStore } from '../lib/categoriesStore';

export function useCategoriesData() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    
    if (!initializedRef.current) {
      initializedRef.current = true;
      loadCategories(false);
    }

    const unsubscribe = categoriesStore.subscribe((newCategories) => {
      if (Array.isArray(newCategories)) {
        setCategories(newCategories);
        setLoading(false);
        setError(null);
      }
    });

    const handleCacheClear = () => {
      categoriesStore.invalidateCache();
      loadCategories(true);
    };

    window.addEventListener('categoriesCacheClear', handleCacheClear);

    return () => {
      unsubscribe();
      window.removeEventListener('categoriesCacheClear', handleCacheClear);
    };
  }, []);

  const loadCategories = async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesStore.fetchCategories(force);
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Hook error:', err);
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return { 
      categories: [], 
      loading: true, 
      error: null, 
      refetch: () => {} 
    };
  }

  return { 
    categories: Array.isArray(categories) ? categories : [], 
    loading, 
    error, 
    refetch: () => loadCategories(true) 
  };
}