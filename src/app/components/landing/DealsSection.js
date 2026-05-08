'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DealsSection() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mainTimerEnd, setMainTimerEnd] = useState(null);
  const [bestDeal, setBestDeal] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/deals?limit=12`);
      const result = await res.json();
      
      // Handle your backend response format
      const dealsData = result.data || [];
      
      const formatted = dealsData.map((deal) => {
        const p = deal.product;
        
        let discount = 0;
        if (deal.discountType === 'percentage') {
          discount = deal.discountValue;
        } else {
          const originalPrice = p.comparePrice || p.price;
          discount = Math.round((deal.discountValue / originalPrice) * 100);
        }

        return {
          id: deal._id,
          productId: p._id,
          name: p.name,
          image: p.images?.[0]?.url || p.image || null,
          price: Math.round(p.price),
          original: p.comparePrice || p.price,
          discount,
          endDate: deal.endDate,
        };
      });

      setDeals(formatted);
      
      // Find best deal
      if (formatted.length > 0) {
        const best = [...formatted].sort((a, b) => b.discount - a.discount)[0];
        setBestDeal(best);
        
        // Find earliest end date for timer
        const validDates = formatted
          .filter(d => d.endDate && new Date(d.endDate) > new Date())
          .map(d => new Date(d.endDate));
        
        if (validDates.length > 0) {
          const earliestEnd = new Date(Math.min(...validDates));
          setMainTimerEnd(earliestEnd);
        }
      }
      
    } catch (err) {
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Timer effect with proper dependencies
  useEffect(() => {
    if (!mainTimerEnd) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = mainTimerEnd - now;
      
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [mainTimerEnd]); // ✅ Only depends on mainTimerEnd, not on deals array

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price * 280);
  };

  const getTimeRemaining = (endDate) => {
    if (!endDate) return null;
    const diff = new Date(endDate) - new Date();
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleAddToCart = async (e, deal) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuth || !token) {
      window.location.href = `/signin?redirect=/`;
      return;
    }
    
    setAddingToCart(deal.id);
    
    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ 
          productId: deal.productId, 
          quantity: 1 
        }),
      });
      
      if (response.ok) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slideUp z-50';
        toast.textContent = '✓ Added to cart!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slideUp z-50';
      toast.textContent = '❌ Failed to add to cart';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <section className="w-full py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-[350px] bg-gray-800 rounded-2xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-gray-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (deals.length === 0) return null;

  const hotDeals = deals.filter(d => d.id !== bestDeal?.id);

  return (
    <section className="w-full py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner - Best Deal */}
        {bestDeal && (
          <div className="relative overflow-hidden rounded-2xl mb-12 bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-10">
              <div className="text-white space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                  <span>⚡</span> DEAL OF THE DAY
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">{bestDeal.name}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold">{formatPrice(bestDeal.price)}</span>
                  <span className="text-white/70 line-through">{formatPrice(bestDeal.original)}</span>
                  <span className="bg-yellow-400 text-red-600 px-2 py-1 rounded-lg text-sm font-bold">
                    -{bestDeal.discount}%
                  </span>
                </div>
                
                {/* Timer Display */}
                {(timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0) && (
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-white/80 text-sm">Ends in:</span>
                    <div className="flex gap-2">
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[60px]">
                        <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="text-[10px] text-white/70">Hours</div>
                      </div>
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[60px]">
                        <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="text-[10px] text-white/70">Mins</div>
                      </div>
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[60px]">
                        <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        <div className="text-[10px] text-white/70">Secs</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={(e) => handleAddToCart(e, bestDeal)}
                  disabled={addingToCart === bestDeal.id}
                  className="bg-white text-red-600 font-bold px-6 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {addingToCart === bestDeal.id ? 'Adding...' : 'Shop Now →'}
                </button>
              </div>
              <div className="flex justify-center">
                <img 
                  src={bestDeal.image || 'https://placehold.co/300x300?text=Product'} 
                  alt={bestDeal.name} 
                  className="w-64 h-64 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/300x300?text=Product';
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">🔥 Today&apos;s Hot Deals</h2>
            <p className="text-gray-400 text-sm">Limited time offers. Grab before they&apos;re gone!</p>
          </div>
          <Link href="/products?deals=true" className="text-yellow-400 text-sm hover:text-yellow-300">
            View All →
          </Link>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {hotDeals.slice(0, 8).map((deal) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-500/50 transition-all group"
            >
              <div className="relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded z-10">
                  -{deal.discount}%
                </div>
                {deal.endDate && new Date(deal.endDate) > new Date() && (
                  <div className="absolute top-2 right-2 bg-black/60 text-yellow-400 text-xs px-2 py-0.5 rounded z-10">
                    {getTimeRemaining(deal.endDate)}
                  </div>
                )}
                <img 
                  src={deal.image || 'https://placehold.co/200x200?text=Product'} 
                  alt={deal.name} 
                  className="w-full h-40 object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/200x200?text=Product';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-white text-sm font-medium line-clamp-2">{deal.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400 font-bold">{formatPrice(deal.price)}</span>
                  <span className="text-gray-500 line-through text-xs">{formatPrice(deal.original)}</span>
                </div>
                <button 
                  onClick={(e) => handleAddToCart(e, deal)}
                  disabled={addingToCart === deal.id}
                  className="w-full mt-3 bg-yellow-500/20 hover:bg-yellow-500 text-yellow-400 hover:text-white text-sm py-2 rounded-lg transition-all disabled:opacity-50"
                >
                  {addingToCart === deal.id ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}