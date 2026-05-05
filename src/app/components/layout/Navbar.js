
// 'use client';

// import { useState, useEffect, useRef, useCallback } from 'react';
// import Link from 'next/link';
// import { useRouter, usePathname } from 'next/navigation';
// import { useCategoriesData } from "../../../hooks/useCategoriesData"

// const cache = {
//   cart: null,
//   wishlist: null,
//   setCart(data) { this.cart = { data, timestamp: Date.now() }; },
//   getCart() {
//     if (this.cart && Date.now() - this.cart.timestamp < 2 * 60 * 1000) return this.cart.data;
//     return null;
//   },
//   setWishlist(data) { this.wishlist = { data, timestamp: Date.now() }; },
//   getWishlist() {
//     if (this.wishlist && Date.now() - this.wishlist.timestamp < 2 * 60 * 1000) return this.wishlist.data;
//     return null;
//   }
// };

// function AnimatedLogo() {
//   return (
//     <div className="flex items-center gap-2 group">
//       <div className="relative w-9 h-9 lg:w-10 lg:h-10 flex-shrink-0 flex items-center justify-center">
//         <svg className="w-full h-full" style={{ animation: 'spin-slow 4s linear infinite' }} viewBox="0 0 40 40">
//           {[...Array(6)].map((_, i) => (
//             <ellipse key={i} cx="20" cy="10" rx="6" ry="11" fill="url(#petalGradient)" transform={`rotate(${i * 60} 20 20)`} opacity="0.9" />
//           ))}
//           <defs>
//             <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//               <stop offset="0%" stopColor="#ff006e" /><stop offset="50%" stopColor="#8338ec" /><stop offset="100%" stopColor="#3a86ff" />
//             </linearGradient>
//           </defs>
//         </svg>
//         <div className="absolute w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full" style={{ background: 'radial-gradient(circle, #ff006e, #8338ec)', boxShadow: '0 0 10px rgba(255, 0, 110, 0.8)' }} />
//       </div>
//       <span className="hidden sm:block text-lg lg:text-xl font-bold text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #3a86ff, #8338ec, #ff006e, #fb5607)', backgroundSize: '300% 300%', animation: 'gradientShift 3s ease infinite' }}>SwiftCart.PK</span>
//       <style jsx>{`
//         @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
//       `}</style>
//     </div>
//   );
// }

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [cartCount, setCartCount] = useState(0);
//   const [wishlistCount, setWishlistCount] = useState(0);
//   const [showCategories, setShowCategories] = useState(false);
//   const [scrollY, setScrollY] = useState(0);
//   const [scrollDirection, setScrollDirection] = useState('up');
//   const [searchSuggestions, setSearchSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [mounted, setMounted] = useState(false);
  
//   const categoriesRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const searchRef = useRef(null);
//   const prevScrollY = useRef(0);
//   const router = useRouter();
//   const pathname = usePathname();

//   const { categories, loading: loadingCategories, refetch: refetchCategories } = useCategoriesData();

//   const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
//   const API = {
//     products: `${API_BASE}/products`,
//     cart: `${API_BASE}/cart`,
//     wishlist: `${API_BASE}/wishlist`,
//     auth: { logout: `${API_BASE}/auth/logout` }
//   };

//   useEffect(() => { setMounted(true); }, []);

//   const getCategoryIcon = (categoryName) => {
//     const name = (categoryName || '').toLowerCase();
//     if (name.includes('electronic')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
//     if (name.includes('fashion') || name.includes('cloth')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>);
//     if (name.includes('home') || name.includes('kitchen')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
//     if (name.includes('beauty') || name.includes('makeup')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>);
//     if (name.includes('sport') || name.includes('fitnes')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9.172 9.172a4 4 0 015.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
//     if (name.includes('book')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
//     return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>);
//   };

//   const categoryColors = [
//     'from-blue-600 to-cyan-600', 'from-pink-600 to-rose-600', 'from-amber-600 to-orange-600',
//     'from-purple-600 to-violet-600', 'from-emerald-600 to-green-600', 'from-red-600 to-pink-600',
//     'from-indigo-600 to-blue-600', 'from-teal-600 to-emerald-600', 'from-orange-600 to-red-600',
//     'from-cyan-600 to-teal-600',
//   ];

//   const fetchCartAndWishlist = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     const isAuth = localStorage.getItem('isAuthenticated') === 'true';
//     if (!isAuth || !token) {
//       console.log('🔍 fetchCartAndWishlist: Not authenticated, skipping');
//       return;
//     }
    
//     console.log('🔍 fetchCartAndWishlist: Fetching cart and wishlist counts...');
    
//     try {
//       const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
//       const [cartRes, wishlistRes] = await Promise.allSettled([
//         fetch(API.cart, { credentials: 'include', headers }),
//         fetch(API.wishlist, { credentials: 'include', headers }),
//       ]);
      
//       if (cartRes.status === 'fulfilled' && cartRes.value.ok) {
//         const cartData = await cartRes.value.json();
//         const cartItems = cartData.data?.cart?.items || cartData.data?.items || cartData.cart?.items || [];
//         if (Array.isArray(cartItems)) {
//           const total = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
//           console.log('🛒 Cart count updated:', total);
//           setCartCount(total); 
//           cache.setCart(total);
//         }
//       } else {
//         console.log('❌ Cart fetch failed:', cartRes.status === 'fulfilled' ? cartRes.value.status : 'rejected');
//       }
      
//       if (wishlistRes.status === 'fulfilled' && wishlistRes.value.ok) {
//         const wishlistData = await wishlistRes.value.json();
//         let items = wishlistData.data?.wishlist?.products || wishlistData.data?.wishlist || wishlistData.data || [];
//         if (items && !Array.isArray(items) && items.products) items = items.products;
//         if (Array.isArray(items)) { 
//           console.log('❤️ Wishlist count updated:', items.length);
//           setWishlistCount(items.length); 
//           cache.setWishlist(items.length); 
//         }
//       } else {
//         console.log('❌ Wishlist fetch failed:', wishlistRes.status === 'fulfilled' ? wishlistRes.value.status : 'rejected');
//       }
//     } catch (error) {
//       console.error('❌ fetchCartAndWishlist error:', error);
//     }
//   }, [API.cart, API.wishlist]);

//   const fetchSearchSuggestions = async (query) => {
//     if (query.length < 2) { setSearchSuggestions([]); setShowSuggestions(false); return; }
//     try {
//       const response = await fetch(`${API.products}?search=${encodeURIComponent(query)}&limit=5`, { credentials: 'include' });
//       if (response.ok) {
//         const data = await response.json();
//         const products = data.data?.products || data.products || [];
//         setSearchSuggestions(Array.isArray(products) ? products.slice(0, 5) : []);
//         setShowSuggestions(products.length > 0);
//       }
//     } catch (error) {}
//   };

//   const searchTimeoutRef = useRef(null);
//   const handleSearchInput = (value) => {
//     setSearchQuery(value);
//     if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//     if (value.length >= 2) searchTimeoutRef.current = setTimeout(() => fetchSearchSuggestions(value), 300);
//     else { setSearchSuggestions([]); setShowSuggestions(false); }
//   };

//   useEffect(() => {
//     if (!mounted) return;
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       setScrollY(currentScrollY);
//       if (currentScrollY > prevScrollY.current && currentScrollY > 80) {
//         setScrollDirection('down'); setShowCategories(false); setShowSuggestions(false);
//       } else if (currentScrollY < prevScrollY.current) { setScrollDirection('up'); }
//       prevScrollY.current = currentScrollY;
//     };
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [mounted]);

//   useEffect(() => {
//     if (!mounted) return;
//     const checkAuth = () => {
//       const isAuth = localStorage.getItem('isAuthenticated') === 'true';
//       const token = localStorage.getItem('token');
//       const userData = localStorage.getItem('userData');
//       console.log('🔐 checkAuth:', { isAuth, hasToken: !!token, hasUserData: !!userData });
//       setIsAuthenticated(isAuth && !!token);
//       if (isAuth && token && userData) {
//         try { setUser(JSON.parse(userData)); } catch (e) {}
//         fetchCartAndWishlist();
//       }
//     };
//     checkAuth();
//     const handleCartUpdate = () => { 
//       console.log('🛒 Cart updated event received!');
//       cache.setCart(null); 
//       cache.setWishlist(null); 
//       fetchCartAndWishlist(); 
//     };
//     window.addEventListener('cartUpdated', handleCartUpdate);
//     window.addEventListener('wishlistUpdated', handleCartUpdate);
//     window.addEventListener('storage', (e) => { if (e.key === 'isAuthenticated' || e.key === 'userData') checkAuth(); });
//     return () => {
//       window.removeEventListener('cartUpdated', handleCartUpdate);
//       window.removeEventListener('wishlistUpdated', handleCartUpdate);
//     };
//   }, [mounted, fetchCartAndWishlist]);

//   useEffect(() => { 
//     if (isOpen) setIsOpen(false);
//     if (showCategories) setShowCategories(false);
//     if (showSuggestions) setShowSuggestions(false);
//   }, [pathname]);

//   useEffect(() => {
//     if (!mounted) return;
//     const handleClickOutside = (event) => {
//       if (categoriesRef.current && !categoriesRef.current.contains(event.target)) setShowCategories(false);
//       if (searchRef.current && !searchRef.current.contains(event.target)) setShowSuggestions(false);
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [mounted]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery(''); setShowSuggestions(false); searchInputRef.current?.blur();
//     }
//   };

//   const handleCategoryClick = (categoryId) => { router.push(`/products?category=${categoryId}`); setShowCategories(false); };
//   const handleAllProducts = () => { router.push('/products'); setShowCategories(false); };

//   const handleLogout = async () => {
//     try { await fetch(API.auth.logout, { method: 'POST', credentials: 'include' }); } catch (error) {}
//     localStorage.removeItem('isAuthenticated'); localStorage.removeItem('userData'); localStorage.removeItem('token');
//     setIsAuthenticated(false); setUser(null); setCartCount(0); setWishlistCount(0);
//     cache.setCart(null); cache.setWishlist(null);
//     router.push('/');
//   };

//   const isScrolled = scrollY > 20;

//   const getUserDisplayName = () => {
//     if (user?.name) return user.name;
//     if (user?.username) return user.username;
//     if (user?.email) return user.email.split('@')[0];
//     return 'User';
//   };

//   const getUserInitials = () => {
//     const name = getUserDisplayName();
//     const parts = name.split(' ');
//     if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
//     return name.substring(0, 2).toUpperCase();
//   };

//   if (!mounted) {
//     return (
//       <div className="h-16 lg:h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-transparent">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 lg:h-20">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl"></div>
//               <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const formattedCategories = Array.isArray(categories) ? categories.map((cat, index) => ({
//     _id: cat._id || cat.id, name: cat.name || 'Uncategorized',
//     icon: getCategoryIcon(cat.name), color: categoryColors[index % categoryColors.length],
//     productCount: cat.productCount || 0,
//   })) : [];

//   return (
//     <>
//       <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${scrollDirection === 'down' && !isOpen ? '-translate-y-full' : 'translate-y-0'}`}>
//         <div className={`backdrop-blur-xl border-b transition-all duration-500 ${isScrolled || isOpen ? 'bg-white/90 dark:bg-gray-900/90 shadow-lg border-gray-200/50 dark:border-gray-800/50' : 'bg-white/80 dark:bg-gray-900/80 border-transparent'}`}>
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between h-16 lg:h-20">
//               <Link href="/" className="flex-shrink-0 mr-6 lg:mr-10"><AnimatedLogo /></Link>

//               <div className="hidden lg:flex items-center gap-1 xl:gap-4">
//                 <div className="relative" ref={categoriesRef}>
//                   <button onClick={() => setShowCategories(!showCategories)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${showCategories ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>Categories
//                   </button>
//                   {showCategories && (
//                     <div className="absolute top-full left-0 mt-2 w-[640px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
//                       {loadingCategories ? (
//                         <div className="p-8 text-center"><svg className="w-8 h-8 animate-spin text-violet-600 mx-auto" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
//                       ) : formattedCategories.length === 0 ? (
//                         <div className="p-8 text-center"><div className="text-4xl mb-3">📂</div><p className="text-gray-500">No categories found</p></div>
//                       ) : (
//                         <>
//                           <div className="grid grid-cols-2 gap-1 p-3 max-h-[400px] overflow-y-auto">
//                             {formattedCategories.map((cat, idx) => (
//                               <button key={cat._id || idx} onClick={() => handleCategoryClick(cat._id)} className="group/item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-left w-full">
//                                 <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg group-hover/item:scale-110 transition-transform flex-shrink-0`}>{cat.icon}</div>
//                                 <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{cat.name}</div><div className="text-xs text-gray-500 mt-0.5">{cat.productCount > 0 ? `${cat.productCount} products` : 'Browse products'}</div></div>
//                               </button>
//                             ))}
//                           </div>
//                           <div className="border-t p-4 bg-gray-50/50 dark:bg-gray-800/50">
//                             <button onClick={handleAllProducts} className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 transition">View All Products</button>
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//                 <Link href="/products" className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${pathname === '/products' ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>All Products</Link>
//                 <Link href="/products?sort=-discount" className="px-4 py-2.5 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">Deals</Link>
//               </div>

//               <div ref={searchRef} className="hidden lg:flex items-center flex-1 max-w-md lg:max-w-lg xl:max-w-xl mx-4 lg:mx-6 xl:mx-8 relative">
//                 <form onSubmit={handleSearch} className="w-full">
//                   <div className="relative">
//                     <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
//                     <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => handleSearchInput(e.target.value)} onFocus={() => { if (searchSuggestions.length > 0) setShowSuggestions(true); }} placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-violet-500 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all" />
//                   </div>
//                 </form>
//                 {showSuggestions && searchSuggestions.length > 0 && (
//                   <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border overflow-hidden z-50">
//                     {searchSuggestions.map((item) => (
//                       <Link key={item._id} href={`/products/${item._id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" onClick={() => { setShowSuggestions(false); setSearchQuery(''); }}>
//                         <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
//                         <div className="flex-1 min-w-0"><div className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</div></div>
//                         <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">PKR {((item.price || 0) * 280).toLocaleString()}</span>
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="flex items-center gap-1 sm:gap-2 ml-4 lg:ml-6">
//                 <Link href="/wishlist" className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hidden sm:block">
//                   <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
//                   {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg px-1">{wishlistCount > 99 ? '99+' : wishlistCount}</span>}
//                 </Link>
//                 <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
//                   <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
//                   {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg px-1">{cartCount > 99 ? '99+' : cartCount}</span>}
//                 </Link>
                
//                 {!isAuthenticated ? (
//                   <Link href="/signup" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white rounded-xl font-medium text-sm shadow-lg">Sign Up</Link>
//                 ) : (
//                   <div className="hidden sm:block relative group">
//                     <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
//                       <div className="w-8 h-8 bg-violet-600 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-lg">{getUserInitials()}</div>
//                       <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block max-w-[100px] truncate">{getUserDisplayName()}</span>
//                       <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
//                     </button>
//                     <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
//                       <div className="p-2">
//                         <div className="px-4 py-3 border-b"><p className="text-sm font-semibold">{getUserDisplayName()}</p><p className="text-xs text-gray-500 truncate">{user?.email}</p></div>
//                         <div className="py-1">
//                           <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all">Orders</Link>
//                           <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all">Profile</Link>
//                         </div>
//                         <div className="border-t my-1"></div>
//                         <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all">Sign Out</button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
//                   {isOpen ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
//                   : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {isOpen && (
//           <>
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40" onClick={() => setIsOpen(false)} />
//             <div className="lg:hidden fixed top-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 h-full animate-in slide-in-from-right duration-300">
//               <div className="flex items-center justify-between p-4 border-b">
//                 <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
//                 <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
//                 </button>
//               </div>
//               <div className="overflow-y-auto p-4 space-y-1" style={{ height: 'calc(100% - 65px)' }}>
//                 {isAuthenticated && user && (
//                   <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
//                     <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg">{getUserInitials()}</div>
//                     <div><p className="font-semibold">{getUserDisplayName()}</p><p className="text-xs text-gray-500 truncate">{user.email}</p></div>
//                   </div>
//                 )}
//                 <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Categories</div>
//                 {loadingCategories ? <div className="flex justify-center py-8"><svg className="w-6 h-6 animate-spin text-violet-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
//                 : formattedCategories.map((cat) => (
//                   <button key={cat._id} onClick={() => { handleCategoryClick(cat._id); setIsOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all">
//                     <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>{cat.icon}</div>
//                     <span className="font-medium">{cat.name}</span>
//                   </button>
//                 ))}
//                 <div className="border-t my-2"></div>
//                 <Link href="/products" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>All Products</Link>
//                 <Link href="/deals" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>Deals</Link>
//                 <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</Link>
//                 <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
//                 <div className="border-t my-2"></div>
//                 {!isAuthenticated ? (
//                   <Link href="/signup" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-violet-600 rounded-xl shadow-lg" onClick={() => setIsOpen(false)}>Sign Up / Sign In</Link>
//                 ) : (
//                   <>
//                     <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all" onClick={() => setIsOpen(false)}>Orders</Link>
//                     <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all" onClick={() => setIsOpen(false)}>Profile</Link>
//                     <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all">Sign Out</button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </nav>
//       <div className="h-16 lg:h-20" />
//     </>
//   );
// }

















// 05/05/2026
// the better version

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCategoriesData } from "../../../hooks/useCategoriesData"

const cache = {
  cart: null,
  wishlist: null,
  setCart(data) { this.cart = { data, timestamp: Date.now() }; },
  getCart() {
    if (this.cart && Date.now() - this.cart.timestamp < 2 * 60 * 1000) return this.cart.data;
    return null;
  },
  setWishlist(data) { this.wishlist = { data, timestamp: Date.now() }; },
  getWishlist() {
    if (this.wishlist && Date.now() - this.wishlist.timestamp < 2 * 60 * 1000) return this.wishlist.data;
    return null;
  }
};

function AnimatedLogo() {
  return (
    <div className="flex items-center gap-2 group">
      <div className="relative w-9 h-9 lg:w-10 lg:h-10 flex-shrink-0 flex items-center justify-center">
        <svg className="w-full h-full" style={{ animation: 'spin-slow 4s linear infinite' }} viewBox="0 0 40 40">
          {[...Array(6)].map((_, i) => (
            <ellipse key={i} cx="20" cy="10" rx="6" ry="11" fill="url(#petalGradient)" transform={`rotate(${i * 60} 20 20)`} opacity="0.9" />
          ))}
          <defs>
            <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff006e" /><stop offset="50%" stopColor="#8338ec" /><stop offset="100%" stopColor="#3a86ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full" style={{ background: 'radial-gradient(circle, #ff006e, #8338ec)', boxShadow: '0 0 10px rgba(255, 0, 110, 0.8)' }} />
      </div>
      <span className="hidden sm:block text-lg lg:text-xl font-bold text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #3a86ff, #8338ec, #ff006e, #fb5607)', backgroundSize: '300% 300%', animation: 'gradientShift 3s ease infinite' }}>SwiftCart.PK</span>
      <style jsx>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const categoriesRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchRef = useRef(null);
  const prevScrollY = useRef(0);
  const router = useRouter();
  const pathname = usePathname();

  const { categories, loading: loadingCategories, refetch: refetchCategories } = useCategoriesData();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  const API = {
    products: `${API_BASE}/products`,
    cart: `${API_BASE}/cart`,
    wishlist: `${API_BASE}/wishlist`,
    auth: { logout: `${API_BASE}/auth/logout` }
  };

  useEffect(() => { setMounted(true); }, []);

  const getCategoryIcon = (categoryName) => {
    const name = (categoryName || '').toLowerCase();
    if (name.includes('electronic')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
    if (name.includes('fashion') || name.includes('cloth')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>);
    if (name.includes('home') || name.includes('kitchen')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
    if (name.includes('beauty') || name.includes('makeup')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>);
    if (name.includes('sport') || name.includes('fitnes')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9.172 9.172a4 4 0 015.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
    if (name.includes('book')) return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
    return (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>);
  };

  const categoryColors = [
    'from-blue-600 to-cyan-600', 'from-pink-600 to-rose-600', 'from-amber-600 to-orange-600',
    'from-purple-600 to-violet-600', 'from-emerald-600 to-green-600', 'from-red-600 to-pink-600',
    'from-indigo-600 to-blue-600', 'from-teal-600 to-emerald-600', 'from-orange-600 to-red-600',
    'from-cyan-600 to-teal-600',
  ];

  const fetchCartAndWishlist = useCallback(async () => {
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth || !token) return;
    
    try {
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
      const [cartRes, wishlistRes] = await Promise.allSettled([
        fetch(API.cart, { credentials: 'include', headers }),
        fetch(API.wishlist, { credentials: 'include', headers }),
      ]);
      
      if (cartRes.status === 'fulfilled' && cartRes.value.ok) {
        const cartData = await cartRes.value.json();
        const cartItems = cartData.data?.cart?.items || cartData.data?.items || cartData.cart?.items || [];
        if (Array.isArray(cartItems)) {
          const total = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
          setCartCount(total); 
          cache.setCart(total);
        }
      }
      
      if (wishlistRes.status === 'fulfilled' && wishlistRes.value.ok) {
        const wishlistData = await wishlistRes.value.json();
        let items = wishlistData.data?.wishlist?.products || wishlistData.data?.wishlist || wishlistData.data || [];
        if (items && !Array.isArray(items) && items.products) items = items.products;
        if (Array.isArray(items)) { 
          setWishlistCount(items.length); 
          cache.setWishlist(items.length); 
        }
      }
    } catch (error) {
      console.error('❌ fetchCartAndWishlist error:', error);
    }
  }, [API.cart, API.wishlist]);

  const fetchSearchSuggestions = async (query) => {
    if (query.length < 2) { setSearchSuggestions([]); setShowSuggestions(false); return; }
    try {
      const response = await fetch(`${API.products}?search=${encodeURIComponent(query)}&limit=5`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        const products = data.data?.products || data.products || [];
        setSearchSuggestions(Array.isArray(products) ? products.slice(0, 5) : []);
        setShowSuggestions(products.length > 0);
      }
    } catch (error) {}
  };

  const searchTimeoutRef = useRef(null);
  const handleSearchInput = (value) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (value.length >= 2) searchTimeoutRef.current = setTimeout(() => fetchSearchSuggestions(value), 300);
    else { setSearchSuggestions([]); setShowSuggestions(false); }
  };

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      if (currentScrollY > prevScrollY.current && currentScrollY > 80) {
        setScrollDirection('down'); setShowCategories(false); setShowSuggestions(false);
      } else if (currentScrollY < prevScrollY.current) { setScrollDirection('up'); }
      prevScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const checkAuth = () => {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      setIsAuthenticated(isAuth && !!token);
      if (isAuth && token && userData) {
        try { setUser(JSON.parse(userData)); } catch (e) {}
        fetchCartAndWishlist();
      }
    };
    checkAuth();
    const handleCartUpdate = () => { 
      cache.setCart(null); 
      cache.setWishlist(null); 
      fetchCartAndWishlist(); 
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('wishlistUpdated', handleCartUpdate);
    window.addEventListener('storage', (e) => { if (e.key === 'isAuthenticated' || e.key === 'userData') checkAuth(); });
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('wishlistUpdated', handleCartUpdate);
    };
  }, [mounted, fetchCartAndWishlist]);

  useEffect(() => { 
    if (isOpen) setIsOpen(false);
    if (showCategories) setShowCategories(false);
    if (showSuggestions) setShowSuggestions(false);
  }, [pathname]);

  useEffect(() => {
    if (!mounted) return;
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) setShowCategories(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mounted]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); setShowSuggestions(false); searchInputRef.current?.blur();
    }
  };

  const handleCategoryClick = (categoryId) => { router.push(`/products?category=${categoryId}`); setShowCategories(false); };
  const handleAllProducts = () => { router.push('/products'); setShowCategories(false); };

  const handleLogout = async () => {
    try { await fetch(API.auth.logout, { method: 'POST', credentials: 'include' }); } catch (error) {}
    localStorage.removeItem('isAuthenticated'); localStorage.removeItem('userData'); localStorage.removeItem('token');
    setIsAuthenticated(false); setUser(null); setCartCount(0); setWishlistCount(0);
    cache.setCart(null); cache.setWishlist(null);
    router.push('/');
  };

  const isScrolled = scrollY > 20;

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  if (!mounted) {
    return (
      <div className="h-16 lg:h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl"></div>
              <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formattedCategories = Array.isArray(categories) ? categories.map((cat, index) => ({
    _id: cat._id || cat.id, name: cat.name || 'Uncategorized',
    icon: getCategoryIcon(cat.name), color: categoryColors[index % categoryColors.length],
    productCount: cat.productCount || 0,
  })) : [];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${scrollDirection === 'down' && !isOpen ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className={`backdrop-blur-xl border-b transition-all duration-500 ${isScrolled || isOpen ? 'bg-white/90 dark:bg-gray-900/90 shadow-lg border-gray-200/50 dark:border-gray-800/50' : 'bg-white/80 dark:bg-gray-900/80 border-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <Link href="/" className="flex-shrink-0 mr-6 lg:mr-10"><AnimatedLogo /></Link>

              <div className="hidden lg:flex items-center gap-1 xl:gap-4">
                <div className="relative" ref={categoriesRef}>
                  <button onClick={() => setShowCategories(!showCategories)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${showCategories ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>Categories
                  </button>
                  {showCategories && (
                    <div className="absolute top-full left-0 mt-2 w-[640px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {loadingCategories ? (
                        <div className="p-8 text-center"><svg className="w-8 h-8 animate-spin text-violet-600 mx-auto" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
                      ) : formattedCategories.length === 0 ? (
                        <div className="p-8 text-center"><div className="text-4xl mb-3">📂</div><p className="text-gray-500">No categories found</p></div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-1 p-3 max-h-[400px] overflow-y-auto">
                            {formattedCategories.map((cat, idx) => (
                              <button key={cat._id || idx} onClick={() => handleCategoryClick(cat._id)} className="group/item flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-left w-full">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg group-hover/item:scale-110 transition-transform flex-shrink-0`}>{cat.icon}</div>
                                <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{cat.name}</div><div className="text-xs text-gray-500 mt-0.5">{cat.productCount > 0 ? `${cat.productCount} products` : 'Browse products'}</div></div>
                              </button>
                            ))}
                          </div>
                          <div className="border-t p-4 bg-gray-50/50 dark:bg-gray-800/50">
                            <button onClick={handleAllProducts} className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 transition">View All Products</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <Link href="/products" className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${pathname === '/products' ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>All Products</Link>
                <Link href="/products?sort=-discount" className="px-4 py-2.5 rounded-xl font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">Deals</Link>
              </div>

              <div ref={searchRef} className="hidden lg:flex items-center flex-1 max-w-md lg:max-w-lg xl:max-w-xl mx-4 lg:mx-6 xl:mx-8 relative">
                <form onSubmit={handleSearch} className="w-full">
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => handleSearchInput(e.target.value)} onFocus={() => { if (searchSuggestions.length > 0) setShowSuggestions(true); }} placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-violet-500 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all" />
                  </div>
                </form>
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border overflow-hidden z-50">
                    {searchSuggestions.map((item) => (
                      <Link key={item._id} href={`/products/${item._id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all" onClick={() => { setShowSuggestions(false); setSearchQuery(''); }}>
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                        <div className="flex-1 min-w-0"><div className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</div></div>
                        <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">PKR {((item.price || 0) * 280).toLocaleString()}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 sm:gap-2 ml-4 lg:ml-6">
                <Link href="/wishlist" className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hidden sm:block">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg px-1">{wishlistCount > 99 ? '99+' : wishlistCount}</span>}
                </Link>
                <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg px-1">{cartCount > 99 ? '99+' : cartCount}</span>}
                </Link>
                
                {!isAuthenticated ? (
                  <Link href="/signup" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white rounded-xl font-medium text-sm shadow-lg">Sign Up</Link>
                ) : (
                  <div className="hidden sm:block relative group">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                      <div className="w-8 h-8 bg-violet-600 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-lg">{getUserInitials()}</div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block max-w-[100px] truncate">{getUserDisplayName()}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                      <div className="p-2">
                        <div className="px-4 py-3 border-b">
                          <p className="text-sm font-semibold">{getUserDisplayName()}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          {/* THIS IS YOUR ORDERS LINK - FIXED */}
                          <Link 
                            href="/orders" 
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:text-violet-600 rounded-xl transition-all"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            My Orders
                          </Link>
                          <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all">Profile</Link>
                        </div>
                        <div className="border-t my-1"></div>
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all">Sign Out</button>
                      </div>
                    </div>
                  </div>
                )}
                
                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  {isOpen ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40" onClick={() => setIsOpen(false)} />
            <div className="lg:hidden fixed top-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 h-full animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-1" style={{ height: 'calc(100% - 65px)' }}>
                {isAuthenticated && user && (
                  <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg">{getUserInitials()}</div>
                    <div><p className="font-semibold">{getUserDisplayName()}</p><p className="text-xs text-gray-500 truncate">{user.email}</p></div>
                  </div>
                )}
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Categories</div>
                {loadingCategories ? <div className="flex justify-center py-8"><svg className="w-6 h-6 animate-spin text-violet-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
                : formattedCategories.map((cat) => (
                  <button key={cat._id} onClick={() => { handleCategoryClick(cat._id); setIsOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg`}>{cat.icon}</div>
                    <span className="font-medium">{cat.name}</span>
                  </button>
                ))}
                <div className="border-t my-2"></div>
                <Link href="/products" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>All Products</Link>
                <Link href="/deals" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>Deals</Link>
                <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</Link>
                <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
                
                {/* ORDERS LINK IN MOBILE MENU - FIXED */}
                {isAuthenticated && (
                  <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition-all" onClick={() => setIsOpen(false)}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Orders
                  </Link>
                )}
                
                <div className="border-t my-2"></div>
                {!isAuthenticated ? (
                  <Link href="/signup" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-violet-600 rounded-xl shadow-lg" onClick={() => setIsOpen(false)}>Sign Up / Sign In</Link>
                ) : (
                  <>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all" onClick={() => setIsOpen(false)}>Profile</Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all">Sign Out</button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </nav>
      <div className="h-16 lg:h-20" />
    </>
  );
}