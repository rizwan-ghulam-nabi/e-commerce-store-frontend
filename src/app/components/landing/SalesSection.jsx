'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function SalesSection() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/sales?limit=12`);
      const data = await res.json();
      const allSales = data.data || [];

       // 🔍 DEBUG LOGS
    console.log('🔍 API Response Status:', res.status);
    console.log('🔍 Full API Response:', data);
    console.log('🔍 Sales count:', data.data?.length);
    
      
      const formatted = allSales.map((sale) => {
        const p = sale.product;
        
        let discount = 0;
        if (sale.discountType === 'percentage') {
          discount = sale.discountValue;
        } else {
          const originalPrice = p.originalPrice || p.price;
          discount = Math.round((sale.discountValue / originalPrice) * 100);
        }

        return {
          id: sale._id,
          productId: p._id,
          name: p.name,
          image: p.images?.[0]?.url || p.image || null,
          price: Math.round(p.salePrice || p.price),
          original: Math.round(p.originalPrice || p.price),
          discount,
          saleType: sale.saleType,
        };
      });

      setSales(formatted);
    } catch (err) {
      console.error('Error fetching sales:', err);
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

  const handleAddToCart = async (e, sale) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuth || !token) {
      window.location.href = `/signin?redirect=/`;
      return;
    }
    
    setAddingToCart(sale.id);
    
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ 
          productId: sale.productId, 
          quantity: 1 
        }),
      });
      
      if (response.ok) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slideUp';
        toast.textContent = '✓ Added to cart!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slideUp';
      toast.textContent = '❌ Failed to add to cart';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-2xl h-80" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (sales.length === 0) return null;

  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🛍️</span>
              <h2 className="text-3xl font-bold text-white">Sale Collection</h2>
            </div>
            <p className="text-gray-400">Limited time offers. Don't miss out!</p>
          </div>
          <Link href="/products?onsale=true" className="text-rose-400 hover:text-rose-300 text-sm font-medium flex items-center gap-1 group">
            View all
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sales.slice(0, 8).map((sale, idx) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="group bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-rose-500/50 transition-all duration-300"
            >
              <div className="relative bg-gray-900">
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    -{sale.discount}%
                  </div>
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-gray-900/80 backdrop-blur-sm text-gray-300 text-xs px-2 py-1 rounded-md">
                    Limited
                  </div>
                </div>
                <div className="h-48 flex items-center justify-center p-4">
                  <img 
                    src={sale.image || 'https://placehold.co/200x200?text=Product'} 
                    alt={sale.name}
                    className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/200x200?text=Product';
                    }}
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium text-sm line-clamp-2 mb-2 group-hover:text-rose-400 transition-colors">
                  {sale.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-rose-400 font-bold text-lg">
                    {formatPrice(sale.price)}
                  </span>
                  <span className="text-gray-500 line-through text-xs">
                    {formatPrice(sale.original)}
                  </span>
                </div>
                <button 
                  onClick={(e) => handleAddToCart(e, sale)}
                  disabled={addingToCart === sale.id}
                  className="w-full py-2 bg-gray-700 hover:bg-rose-500 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                >
                  {addingToCart === sale.id ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Free Shipping on Orders Rs.5000+</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Easy Returns</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 1.5M17 13l1.5 1.5M9 21h6M12 18v3" />
            </svg>
            <span>100% Authentic</span>
          </div>
        </div>
      </div>
    </section>
  );
}