// // components/FeaturedProducts.js
// 'use client';
// import { useState, useEffect, useRef, useCallback } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// if (typeof window !== 'undefined') {
//   gsap.registerPlugin(ScrollTrigger);
// }

// const FeaturedProducts = () => {
//   const router = useRouter();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [addingToCart, setAddingToCart] = useState(null);
//   const [wishlistItems, setWishlistItems] = useState([]);
//   const [wishlistLoading, setWishlistLoading] = useState(null);
  
//   const sectionRef = useRef(null);
//   const headerRef = useRef(null);
//   const productsGridRef = useRef(null);
//   const viewAllRef = useRef(null);

//   const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

//   const fetchFeaturedProducts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('🔄 Fetching featured products from:', API_BASE);
      
//       let response = await fetch(`${API_BASE}/products/featured`);
      
//       if (!response.ok) {
//         console.log('Featured endpoint failed, trying all products...');
//         response = await fetch(`${API_BASE}/products?limit=8&sort=-createdAt`);
//       }
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('📦 API Response:', data);
      
//       let productList = [];
      
//       if (data.data?.products) {
//         productList = data.data.products;
//       } else if (data.data) {
//         productList = Array.isArray(data.data) ? data.data : [data.data];
//       } else if (data.products) {
//         productList = data.products;
//       } else if (Array.isArray(data)) {
//         productList = data;
//       }
      
//       const validProducts = productList
//         .filter(p => p && p._id && p.isActive !== false)
//         .slice(0, 8);
      
//       console.log('✅ Found products:', validProducts.length);
//       setProducts(validProducts);
      
//       // Fetch wishlist status if authenticated
//       fetchWishlistStatus();
      
//     } catch (err) {
//       console.error('❌ Error:', err.message);
//       setError(err.message);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Check wishlist status - UPDATED
//   const fetchWishlistStatus = async () => {
//     const token = localStorage.getItem('token');
//     const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
//     if (!isAuth || !token) {
//       console.log('🔒 Not authenticated, skipping wishlist fetch');
//       return;
//     }
    
//     try {
//       console.log('🔄 Fetching wishlist status...');
//       const response = await fetch(`${API_BASE}/wishlist`, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         credentials: 'include',
//       });
      
//       if (!response.ok) {
//         console.log('❌ Wishlist fetch failed with status:', response.status);
//         // If unauthorized, clear auth state
//         if (response.status === 401 || response.status === 403) {
//           localStorage.removeItem('isAuthenticated');
//           localStorage.removeItem('token');
//           localStorage.removeItem('userData');
//         }
//         return;
//       }
      
//       const data = await response.json();
//       console.log('📋 Wishlist API Response:', data);
      
//       // Handle various response structures
//       let items = [];
      
//       if (data.data?.wishlist?.products) {
//         items = data.data.wishlist.products;
//       } else if (data.data?.wishlist) {
//         items = data.data.wishlist;
//       } else if (data.wishlist?.products) {
//         items = data.wishlist.products;
//       } else if (Array.isArray(data.data)) {
//         items = data.data;
//       } else if (Array.isArray(data)) {
//         items = data;
//       }
      
//       console.log('📝 Extracted items:', items);
      
//       if (Array.isArray(items)) {
//         // Handle populated objects
//         const itemIds = items.map(item => {
//           // If item has product._id (populated)
//           if (item.product?._id) {
//             return item.product._id;
//           }
//           // If item has _id directly
//           if (item._id) {
//             return item._id;
//           }
//           return null;
//         }).filter(Boolean);
        
//         console.log('✅ Setting wishlist IDs:', itemIds);
//         setWishlistItems(itemIds);
//       }
//     } catch (error) {
//       console.error('❌ Wishlist fetch error:', error);
//     }
//   };

//   useEffect(() => {
//     fetchFeaturedProducts();
//   }, []);
  

//   useEffect(() => {
//     if (!loading && products.length > 0) {
//       ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: 'top 80%',
//           toggleActions: 'play none none reverse'
//         }
//       });

//       if (headerRef.current) {
//         tl.fromTo(headerRef.current,
//           { y: 50, opacity: 0 },
//           { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }
//         );
//       }
      
//       if (productsGridRef.current?.children?.length > 0) {
//         tl.fromTo(productsGridRef.current.children,
//           { y: 60, opacity: 0, scale: 0.9 },
//           { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.2)' },
//           '-=0.4'
//         );
//       }
      
//       if (viewAllRef.current) {
//         tl.fromTo(viewAllRef.current,
//           { y: 30, opacity: 0 },
//           { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
//           '-=0.3'
//         );
//       }
//     }
    
//     return () => {
//       ScrollTrigger.getAll().forEach(trigger => trigger.kill());
//     };
//   }, [loading, products]);

//   const formatPrice = useCallback((price) => {
//     if (!price || isNaN(price)) return 'PKR 0';
//     const pkrPrice = price * 280;
//     return new Intl.NumberFormat('en-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(pkrPrice);
//   }, []);

//   const getProductImage = useCallback((product) => {
//     if (product?.images?.[0]?.url) return product.images[0].url;
//     if (product?.image) return product.image;
//     return null;
//   }, []);

//   const getCategoryName = useCallback((product) => {
//     const cat = product?.category;
//     if (!cat) return 'Uncategorized';
//     return typeof cat === 'object' ? cat.name : String(cat);
//   }, []);

//   const showToast = (message, type = 'success') => {
//     const toast = document.createElement('div');
//     toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 animate-slideUp font-medium text-sm ${
//       type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
//     }`;
//     toast.textContent = message;
//     document.body.appendChild(toast);
//     setTimeout(() => {
//       toast.style.opacity = '0';
//       toast.style.transform = 'translateY(20px)';
//       toast.style.transition = 'all 0.3s ease';
//       setTimeout(() => toast.remove(), 300);
//     }, 2000);
//   };

//   // ✅ Add to Cart handler
//   const handleAddToCart = async (e, product) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     const token = localStorage.getItem('token');
//     const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
//     if (!isAuth || !token) {
//       router.push('/signin?redirect=/');
//       return;
//     }
    
//     setAddingToCart(product._id);
    
//     try {
//       const response = await fetch(`${API_BASE}/cart/add`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         credentials: 'include',
//         body: JSON.stringify({ productId: product._id, quantity: 1 }),
//       });
      
//       if (response.ok) {
//         window.dispatchEvent(new Event('cartUpdated'));
//         showToast('Added to cart!', 'success');
//       }
//     } catch (error) {
//       console.error('Add to cart error:', error);
//     } finally {
//       setAddingToCart(null);
//     }
//   };

//   // ✅ Wishlist toggle handler
//   const handleWishlistToggle = async (e, product) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     const token = localStorage.getItem('token');
//     const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
//     if (!isAuth || !token) {
//       router.push('/signin?redirect=/');
//       return;
//     }
    
//     setWishlistLoading(product._id);
    
//     const isInWishlist = wishlistItems.includes(product._id);
    
//     try {
//       if (isInWishlist) {
//         // Remove from wishlist
//         const response = await fetch(`${API_BASE}/wishlist/${product._id}`, {
//           method: 'DELETE',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           credentials: 'include',
//         });
        
//         if (response.ok) {
//           setWishlistItems(prev => prev.filter(id => id !== product._id));
//           window.dispatchEvent(new Event('wishlistUpdated'));
//           showToast('Removed from wishlist', 'success');
//         }
//       } else {
//         // Add to wishlist
//         const response = await fetch(`${API_BASE}/wishlist`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           credentials: 'include',
//           body: JSON.stringify({ productId: product._id }),
//         });
        
//         if (response.ok) {
//           setWishlistItems(prev => [...prev, product._id]);
//           window.dispatchEvent(new Event('wishlistUpdated'));
//           showToast('Added to wishlist!', 'success');
//         }
//       }
//     } catch (error) {
//       console.error('Wishlist error:', error);
//     } finally {
//       setWishlistLoading(null);
//     }
//   };

//   // Loading State
//   if (loading) {
//     return (
//       <section className="relative py-20 min-h-[400px]">
//         <div className="flex items-center justify-center min-h-[300px]">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-700 dark:text-gray-300 text-lg">Discovering products...</p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Error State
//   if (error && products.length === 0) {
//     return (
//       <section className="relative py-20">
//         <div className="max-w-md mx-auto text-center">
//           <div className="text-6xl mb-4">😕</div>
//           <h3 className="text-gray-800 dark:text-white text-xl font-semibold mb-2">Unable to load products</h3>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
//           <button onClick={fetchFeaturedProducts} className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">Try Again</button>
//         </div>
//       </section>
//     );
//   }

//   // Empty State
//   if (products.length === 0) {
//     return (
//       <section className="relative py-20">
//         <div className="max-w-md mx-auto text-center">
//           <div className="text-6xl mb-4">📦</div>
//           <h3 className="text-gray-800 dark:text-white text-xl font-semibold mb-2">No Products Yet</h3>
//           <p className="text-gray-600 dark:text-gray-400 mb-4">Create products in your admin panel and mark them as featured!</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section ref={sectionRef} className="relative py-20 overflow-hidden">
//       {/* REMOVED: bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 */}
      
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div ref={headerRef} className="text-center mb-12">
//           <h2 className="text-4xl sm:text-5xl font-bold mb-4">
//             <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">Featured Products</span>
//           </h2>
//           <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4 rounded-full"></div>
//           <p className="text-gray-600 dark:text-gray-400 text-lg">Handpicked just for you</p>
//         </div>

//         <div ref={productsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products.map((product) => {
//             const imageUrl = getProductImage(product);
//             const category = getCategoryName(product);
//             const discount = product.comparePrice && product.comparePrice > product.price
//               ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
//             const inStock = (product.stock || 0) > 0;
//             const isInWishlist = wishlistItems.includes(product._id);

//             return (
//               <Link
//                 key={product._id}
//                 href={`/products/${product._id}`}
//                 className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 hover:transform hover:-translate-y-2 transition-all duration-500 shadow-lg hover:shadow-xl"
//               >
//                 <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
//                   {imageUrl ? (
//                     <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <span className="text-5xl font-bold text-gray-400">{(product.name || 'P').charAt(0)}</span>
//                     </div>
//                   )}
                  
//                   {/* Badges */}
//                   {discount > 0 && (
//                     <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">-{discount}%</span>
//                   )}
//                   {product.stock <= 5 && product.stock > 0 && (
//                     <span className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Only {product.stock}</span>
//                   )}
//                   {!inStock && (
//                     <span className="absolute top-3 left-3 px-2 py-1 bg-red-500/90 text-white text-xs font-semibold rounded-full">Sold Out</span>
//                   )}

//                   {/* ✅ Wishlist Heart Button - Top Right */}
//                   <div className="absolute top-3 right-3 z-10">
//                     <button
//                       onClick={(e) => handleWishlistToggle(e, product)}
//                       disabled={wishlistLoading === product._id}
//                       className={`flex items-center justify-center w-9 h-9 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
//                         isInWishlist 
//                           ? 'bg-rose-500 text-white' 
//                           : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white'
//                       }`}
//                     >
//                       {wishlistLoading === product._id ? (
//                         <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                         </svg>
//                       ) : (
//                         <svg className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                         </svg>
//                       )}
//                     </button>
//                   </div>

//                   {/* ✅ Add to Cart Button - Bottom Right (appears on hover) */}
//                   {inStock && (
//                     <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
//                       <button
//                         onClick={(e) => handleAddToCart(e, product)}
//                         disabled={addingToCart === product._id}
//                         className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
//                       >
//                         {addingToCart === product._id ? (
//                           <svg className="w-5 h-5 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                           </svg>
//                         ) : (
//                           <svg className="w-5 h-5 text-gray-700 dark:text-gray-700 hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-5">
//                   <p className="text-xs text-purple-500 dark:text-purple-400 mb-1">{category}</p>
//                   <h3 className="text-gray-800 dark:text-white font-semibold mb-2 truncate">{product.name}</h3>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
//                     {product.comparePrice > product.price && (
//                       <span className="text-sm text-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
//                     )}
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>

//         <div ref={viewAllRef} className="text-center mt-12">
//           <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-lg hover:shadow-xl">
//             View All Products
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//             </svg>
//           </Link>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes slideUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-slideUp { animation: slideUp 0.3s ease-out; }
//       `}</style>
//     </section>
//   );
// };

// export default FeaturedProducts;






































// components/FeaturedProducts.js
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FeaturedProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(null);
  
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const productsGridRef = useRef(null);
  const viewAllRef = useRef(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response = await fetch(`${API_BASE}/products/featured`);
      
      if (!response.ok) {
        response = await fetch(`${API_BASE}/products?limit=8&sort=-createdAt`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      let productList = [];
      
      if (data.data?.products) {
        productList = data.data.products;
      } else if (data.data) {
        productList = Array.isArray(data.data) ? data.data : [data.data];
      } else if (data.products) {
        productList = data.products;
      } else if (Array.isArray(data)) {
        productList = data;
      }
      
      const validProducts = productList
        .filter(p => p && p._id && p.isActive !== false)
        .slice(0, 8);
      
      setProducts(validProducts);
      fetchWishlistStatus();
      
    } catch (err) {
      console.error('❌ Error:', err.message);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlistStatus = async () => {
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuth || !token) return;
    
    try {
      const response = await fetch(`${API_BASE}/wishlist`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
        }
        return;
      }
      
      const data = await response.json();
      let items = [];
      
      if (data.data?.wishlist?.products) items = data.data.wishlist.products;
      else if (data.data?.wishlist) items = data.data.wishlist;
      else if (data.wishlist?.products) items = data.wishlist.products;
      else if (Array.isArray(data.data)) items = data.data;
      else if (Array.isArray(data)) items = data;
      
      if (Array.isArray(items)) {
        const itemIds = items.map(item => {
          if (item.product?._id) return item.product._id;
          if (item._id) return item._id;
          return null;
        }).filter(Boolean);
        
        setWishlistItems(itemIds);
      }
    } catch (error) {
      console.error('❌ Wishlist fetch error:', error);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);
  
  useEffect(() => {
    if (!loading && products.length > 0) {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      if (headerRef.current) {
        tl.fromTo(headerRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }
        );
      }
      
      if (productsGridRef.current?.children?.length > 0) {
        tl.fromTo(productsGridRef.current.children,
          { y: 60, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.2)' },
          '-=0.4'
        );
      }
      
      if (viewAllRef.current) {
        tl.fromTo(viewAllRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );
      }
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading, products]);

  const formatPrice = useCallback((price) => {
    if (!price || isNaN(price)) return 'PKR 0';
    const pkrPrice = price * 280;
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(pkrPrice);
  }, []);

  const getProductImage = useCallback((product) => {
    if (product?.images?.[0]?.url) return product.images[0].url;
    if (product?.image) return product.image;
    return null;
  }, []);

  const getCategoryName = useCallback((product) => {
    const cat = product?.category;
    if (!cat) return 'Uncategorized';
    return typeof cat === 'object' ? cat.name : String(cat);
  }, []);

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 animate-slideUp font-medium text-sm ${
      type === 'success' ? 'bg-aurora text-black' : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuth || !token) {
      router.push('/signin?redirect=/');
      return;
    }
    
    setAddingToCart(product._id);
    
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      
      if (response.ok) {
        window.dispatchEvent(new Event('cartUpdated'));
        showToast('Added to cart!', 'success');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuth || !token) {
      router.push('/signin?redirect=/');
      return;
    }
    
    setWishlistLoading(product._id);
    
    const isInWishlist = wishlistItems.includes(product._id);
    
    try {
      if (isInWishlist) {
        const response = await fetch(`${API_BASE}/wishlist/${product._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          setWishlistItems(prev => prev.filter(id => id !== product._id));
          window.dispatchEvent(new Event('wishlistUpdated'));
          showToast('Removed from wishlist', 'success');
        }
      } else {
        const response = await fetch(`${API_BASE}/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({ productId: product._id }),
        });
        
        if (response.ok) {
          setWishlistItems(prev => [...prev, product._id]);
          window.dispatchEvent(new Event('wishlistUpdated'));
          showToast('Added to wishlist!', 'success');
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
    } finally {
      setWishlistLoading(null);
    }
  };

  if (loading) {
    return (
      <section className="w-full py-20 min-h-[400px]">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-aurora/30 border-t-aurora rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Discovering products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className="w-full py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-white text-xl font-semibold mb-2">Unable to load products</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={fetchFeaturedProducts} className="px-6 py-3 bg-aurora text-black rounded-full hover:bg-emerald transition font-medium">Try Again</button>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-white text-xl font-semibold mb-2">No Products Yet</h3>
          <p className="text-gray-400 mb-4">Create products in your admin panel and mark them as featured!</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="w-full py-20 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aurora/10 border border-aurora/20 text-aurora text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-aurora rounded-full animate-pulse" />
            ✨ Premium Collection
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-aurora to-amethyst bg-clip-text text-transparent">
              Featured Products
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-aurora to-amethyst mx-auto mb-4 rounded-full" />
          <p className="text-gray-400 text-lg">Handpicked just for you</p>
        </div>

        <div ref={productsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const imageUrl = getProductImage(product);
            const category = getCategoryName(product);
            const discount = product.comparePrice && product.comparePrice > product.price
              ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
            const inStock = (product.stock || 0) > 0;
            const isInWishlist = wishlistItems.includes(product._id);

            return (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group relative bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-aurora/40 hover:transform hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-aurora/10"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl font-bold text-gray-600">{(product.name || 'P').charAt(0)}</span>
                    </div>
                  )}
                  
                  {discount > 0 && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-coral to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">-{discount}%</span>
                  )}
                  
                  {!inStock && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-gray-700 text-white text-xs font-semibold rounded-full shadow-lg">Sold Out</span>
                  )}

                  {/* Wishlist Button */}
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={(e) => handleWishlistToggle(e, product)}
                      disabled={wishlistLoading === product._id}
                      className={`flex items-center justify-center w-9 h-9 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
                        isInWishlist 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-black/50 backdrop-blur-sm text-gray-300 hover:text-white hover:bg-black/70'
                      }`}
                    >
                      {wishlistLoading === product._id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  {inStock && (
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={addingToCart === product._id}
                        className="flex items-center justify-center w-10 h-10 bg-black/70 backdrop-blur-sm hover:bg-aurora rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                      >
                        {addingToCart === product._id ? (
                          <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs text-aurora mb-1 font-medium">{category}</p>
                  <h3 className="text-white font-semibold mb-2 truncate group-hover:text-aurora transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">{formatPrice(product.price)}</span>
                    {product.comparePrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">{formatPrice(product.comparePrice)}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div ref={viewAllRef} className="text-center mt-12">
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-aurora to-amethyst text-white font-semibold rounded-full hover:shadow-lg hover:shadow-aurora/20 transition-all">
            View All Products
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;