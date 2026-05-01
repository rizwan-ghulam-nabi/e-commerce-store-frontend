// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';

// export default function DealsSection() {
//   const [deals, setDeals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchDeals();
//   }, []);

//   const fetchDeals = async () => {
//     try {
//       setLoading(true);
//       const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      
//       console.log('🔄 Fetching deals...');
      
//       // Try different endpoints based on your admin panel setup
//       // let response = await fetch(`${API_URL}/deals?isActive=true&limit=6`, {
//       //   credentials: 'include',
//       //   headers: { 'Content-Type': 'application/json' },
//       // });

      

//       // If deals endpoint doesn't exist, fallback to products with discounts
//       if (!response.ok) {
//         console.log('⚠️ Deals endpoint not found, fetching discounted products...');
//         response = await fetch(`${API_URL}/products?discount=true&limit=6`, {
//           credentials: 'include',
//           headers: { 'Content-Type': 'application/json' },
//         });
        
//         // If that also fails, just get latest products
//         if (!response.ok) {
//           response = await fetch(`${API_URL}/products?limit=6&sort=-createdAt`, {
//             credentials: 'include',
//             headers: { 'Content-Type': 'application/json' },
//           });
//         }
//       }

//       const data = await response.json();
//       console.log('📦 Deals response:', data);

//       // Parse deals/products
//       let items = [];
//       if (data?.data?.deals) {
//         items = data.data.deals;
//       } else if (data?.deals) {
//         items = data.deals;
//       } else if (data?.data?.products) {
//         items = data.data.products;
//       } else if (data?.products) {
//         items = data.products;
//       } else if (data?.data && Array.isArray(data.data)) {
//         items = data.data;
//       } else if (Array.isArray(data)) {
//         items = data;
//       }

//       // Format deals
//       const formattedDeals = items.slice(0, 6).map((item, index) => {
//         // Handle both deal objects and product objects
//         const isDealObject = item.discountPercentage || item.dealPrice;
//         const product = item.product || item;
        
//         const name = isDealObject ? (product.name || item.title || 'Deal') : (item.name || item.title || 'Product');
//         const price = item.dealPrice || item.price || product?.price || 0;
//         const originalPrice = isDealObject ? (item.originalPrice || product?.price) : (item.comparePrice || item.originalPrice);
//         const discount = item.discountPercentage || 
//           (originalPrice && originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0);
        
//         // Get image
//         let imageUrl = null;
//         if (item.image) {
//           imageUrl = item.image;
//         } else if (item.images?.[0]?.url) {
//           imageUrl = item.images[0].url;
//         } else if (product?.images?.[0]?.url) {
//           imageUrl = product.images[0].url;
//         } else if (product?.image) {
//           imageUrl = product.image;
//         }

//         return {
//           id: item._id || item.id || `deal-${index}`,
//           name: name,
//           description: item.description || product?.description || '',
//           price: parseFloat(price),
//           originalPrice: parseFloat(originalPrice) || null,
//           discount: discount,
//           image: imageUrl,
//           slug: item.slug || product?.slug || item._id,
//           endDate: item.endDate || item.expiryDate || null,
//           badge: item.badge || (discount > 0 ? `-${discount}%` : 'Deal'),
//           link: item.product 
//             ? `/products/${product?._id || product?.id}` 
//             : (item._id ? `/deals/${item._id}` : '/products'),
//         };
//       });

//       setDeals(formattedDeals);
//       console.log(`✅ Loaded ${formattedDeals.length} deals`);
//     } catch (err) {
//       console.error('❌ Error fetching deals:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//     }).format(price * 280);
//   };

//   const getTimeRemaining = (endDate) => {
//     if (!endDate) return null;
//     const now = new Date();
//     const end = new Date(endDate);
//     const diff = end - now;
    
//     if (diff <= 0) return 'Expired';
    
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
//     if (days > 0) return `${days}d ${hours}h left`;
//     return `${hours}h left`;
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <section className="py-12 md:py-16">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="animate-pulse">
//             <div className="h-8 w-48 bg-white/20 rounded mb-8"></div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="bg-white/10 rounded-2xl h-80"></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // Error state
//   if (error && deals.length === 0) {
//     return null; // Silently hide if error and no deals
//   }

//   // No deals
//   if (deals.length === 0) {
//     return null; // Hide section if no deals
//   }

//   return (
//     <section className="py-12 md:py-16">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Section Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
//               🔥 Hot Deals
//             </h2>
//             <p className="text-[#c3baba]">Limited time offers you don&apos;t want to miss</p>
//           </div>
//           <Link 
//             href="/deals" 
//             className="hidden sm:inline-flex items-center gap-2 text-[#70C285] hover:text-white transition-colors font-medium"
//           >
//             View All Deals
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
//             </svg>
//           </Link>
//         </div>

//         {/* Deals Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {deals.map((deal) => (
//             <Link
//               key={deal.id}
//               href={deal.link}
//               className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#70C285]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#70C285]/10 hover:-translate-y-1"
//             >
//               {/* Discount Badge */}
//               {deal.discount > 0 && (
//                 <div className="absolute top-3 left-3 z-10">
//                   <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
//                     -{deal.discount}%
//                   </span>
//                 </div>
//               )}

//               {/* Timer Badge */}
//               {deal.endDate && (
//                 <div className="absolute top-3 right-3 z-10">
//                   <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
//                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     {getTimeRemaining(deal.endDate)}
//                   </span>
//                 </div>
//               )}

//               {/* Product Image */}
//               <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
//                 {deal.image ? (
//                   <img
//                     src={deal.image}
//                     alt={deal.name}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-6xl">
//                     🏷️
//                   </div>
//                 )}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//               </div>

//               {/* Content */}
//               <div className="p-5">
//                 <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-[#70C285] transition-colors">
//                   {deal.name}
//                 </h3>
                
//                 {deal.description && (
//                   <p className="text-[#c3baba] text-sm mb-3 line-clamp-2">{deal.description}</p>
//                 )}

//                 <div className="flex items-end justify-between">
//                   <div>
//                     <span className="text-2xl font-bold text-white">
//                       {formatPrice(deal.price)}
//                     </span>
//                     {deal.originalPrice && (
//                       <span className="text-sm text-gray-400 line-through ml-2">
//                         {formatPrice(deal.originalPrice)}
//                       </span>
//                     )}
//                   </div>
//                   <div className="bg-[#70C285]/20 p-2 rounded-lg group-hover:bg-[#70C285] transition-colors">
//                     <svg className="w-5 h-5 text-[#70C285] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* Mobile View All Link */}
//         <div className="mt-6 text-center sm:hidden">
//           <Link 
//             href="/deals" 
//             className="inline-flex items-center gap-2 text-[#70C285] hover:text-white transition-colors font-medium"
//           >
//             View All Deals
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
//             </svg>
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }






//29/4/2026
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DealsSection() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      
      console.log('🔄 Fetching deals...');
      
      // Try deals endpoint first, fallback to discounted products
      let response = await fetch(`${API_URL}/products?sort=-discount&limit=6`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.log('⚠️ Discounted products not found, fetching latest products...');
        response = await fetch(`${API_URL}/products?limit=6&sort=-createdAt`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      console.log('📦 Deals response:', data);

      // Parse products
      let items = [];
      if (data?.data?.products) {
        items = data.data.products;
      } else if (data?.products) {
        items = data.products;
      } else if (data?.data && Array.isArray(data.data)) {
        items = data.data;
      } else if (Array.isArray(data)) {
        items = data;
      }

      // Format deals
      const formattedDeals = items.slice(0, 6).map((item, index) => {
        const name = item.name || item.title || 'Product';
        const price = item.price || 0;
        const originalPrice = item.comparePrice || item.originalPrice || null;
        const discount = item.discountPercentage || 
          (originalPrice && originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0);
        
        let imageUrl = null;
        if (item.images?.[0]?.url) {
          imageUrl = item.images[0].url;
        } else if (item.image) {
          imageUrl = item.image;
        }

        return {
          id: item._id || `product-${index}`,
          name: name,
          description: item.description || '',
          price: parseFloat(price),
          originalPrice: parseFloat(originalPrice) || null,
          discount: discount,
          image: imageUrl,
          slug: item.slug || item._id,
          endDate: item.dealEndDate || null,
          badge: discount > 0 ? `-${discount}%` : 'Sale',
          link: `/products/${item._id}`,
        };
      });

      setDeals(formattedDeals);
      console.log(`✅ Loaded ${formattedDeals.length} deals`);
    } catch (err) {
      console.error('❌ Error fetching deals:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price * 280);
  };

  const getTimeRemaining = (endDate) => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-white/20 rounded mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/10 rounded-2xl h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && deals.length === 0) return null;
  if (deals.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">🔥 Hot Deals</h2>
            <p className="text-[#c3baba]">Limited time offers you don&apos;t want to miss</p>
          </div>
          <Link href="/deals" className="hidden sm:inline-flex items-center gap-2 text-[#70C285] hover:text-white transition-colors font-medium">
            View All Deals
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <Link key={deal.id} href={deal.link} className="group relative bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#70C285]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#70C285]/10 hover:-translate-y-1">
              {deal.discount > 0 && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">-{deal.discount}%</span>
                </div>
              )}
              {deal.endDate && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {getTimeRemaining(deal.endDate)}
                  </span>
                </div>
              )}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                {deal.image ? (
                  <img src={deal.image} alt={deal.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">🏷️</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-[#70C285] transition-colors">{deal.name}</h3>
                {deal.description && <p className="text-[#c3baba] text-sm mb-3 line-clamp-2">{deal.description}</p>}
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white">{formatPrice(deal.price)}</span>
                    {deal.originalPrice && <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(deal.originalPrice)}</span>}
                  </div>
                  <div className="bg-[#70C285]/20 p-2 rounded-lg group-hover:bg-[#70C285] transition-colors">
                    <svg className="w-5 h-5 text-[#70C285] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/deals" className="inline-flex items-center gap-2 text-[#70C285] hover:text-white transition-colors font-medium">
            View All Deals
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
