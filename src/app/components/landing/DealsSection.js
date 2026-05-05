'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function DealsSection() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxDiscount, setMaxDiscount] = useState(0);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      
      const response = await fetch(`${API_URL}/deals?limit=6`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch deals');

      const result = await response.json();
      const dealsData = result.data || [];

      const formattedDeals = dealsData.map((deal) => {
        const product = deal.product || {};
        const name = product.name || 'Product';
        const originalPrice = product.price || 0;
        const discountValue = deal.discountValue || 0;
        
        let salePrice = originalPrice;
        let discountPercentage = 0;
        
        if (deal.discountType === 'percentage') {
          discountPercentage = discountValue;
          salePrice = originalPrice - (originalPrice * discountValue / 100);
        } else if (deal.discountType === 'fixed') {
          salePrice = originalPrice - discountValue;
          discountPercentage = Math.round((discountValue / originalPrice) * 100);
        }

        let imageUrl = null;
        if (product.images && product.images.length > 0) {
          imageUrl = product.images[0].url || product.images[0];
        } else if (product.image) {
          imageUrl = product.image;
        }

        return {
          id: deal._id,
          productId: product._id,
          name: name,
          description: product.description || '',
          price: Math.round(salePrice),
          originalPrice: originalPrice,
          discount: discountPercentage,
          image: imageUrl,
          slug: product.slug || product._id,
          endDate: deal.endDate,
          startDate: deal.startDate,
          badge: deal.badge || `${discountPercentage}% OFF`,
          link: `/products/${product._id}`,
        };
      });

      setDeals(formattedDeals);
      
      // Calculate the maximum discount percentage from actual deals
      if (formattedDeals.length > 0) {
        const maxDisc = Math.max(...formattedDeals.map(deal => deal.discount));
        setMaxDiscount(maxDisc);
      }
    } catch (err) {
      console.error('Error:', err);
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
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        mass: 0.6
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200
      }
    }
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl animate-pulse"></div>
              <div>
                <div className="h-7 w-40 bg-white/10 rounded-lg animate-pulse mb-1"></div>
                <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-9 w-24 bg-white/10 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-gradient-to-br from-gray-700/50 to-gray-800/50"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="h-7 bg-white/10 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && deals.length === 0) return null;
  if (deals.length === 0) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-r from-[#70C285]/20 to-[#5D4785]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-[#5D4785]/20 to-[#70C285]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                🔥
              </div>
              <motion.div 
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              />
            </motion.div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Hot Deals
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                🔥 Limited time offers • {maxDiscount > 0 ? `Up to ${maxDiscount}% off` : 'Great discounts available'}
              </p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/products?deals=true&sort=-discount"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-[#70C285]/20 backdrop-blur-sm rounded-xl text-[#70C285] hover:text-white text-sm font-medium transition-all duration-300 border border-white/10 hover:border-[#70C285]/50 group"
            >
              <span>View All Deals</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stunning Deals Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          <AnimatePresence mode="popLayout">
            {deals.map((deal, index) => (
              <motion.div
                key={deal.id}
                variants={cardVariants}
                whileHover="hover"
                layout
              >
                <Link href={deal.link} className="block h-full">
                  <div className="relative group h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-[#70C285]/50 transition-all duration-500 shadow-xl hover:shadow-2xl">
                    
                    {/* Animated Gradient Border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#70C285]/0 via-[#70C285]/30 to-[#70C285]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                      />
                      
                      {deal.image ? (
                        <motion.img
                          src={deal.image}
                          alt={deal.name}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          whileHover={{ scale: 1.1 }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl opacity-40 bg-gray-800">
                          📦
                        </div>
                      )}
                      
                      {/* Gradient Overlay for better text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Animated Discount Badge */}
                      <motion.div 
                        initial={{ x: -50, rotate: -45 }}
                        animate={{ x: 0, rotate: 0 }}
                        transition={{ type: "spring", delay: index * 0.1 }}
                        className="absolute top-3 left-3 z-20"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-red-500 rounded-lg blur-md opacity-50"></div>
                          <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
                            -{deal.discount}% OFF
                          </div>
                        </div>
                      </motion.div>

                      {/* Timer Badge */}
                      {getTimeRemaining(deal.endDate) !== 'Ended' && getTimeRemaining(deal.endDate) && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="absolute top-3 right-3 z-20"
                        >
                          <div className="bg-black/70 backdrop-blur-sm text-orange-400 text-xs font-bold px-2 py-1.5 rounded-lg flex items-center gap-1.5 border border-orange-500/30">
                            <motion.div 
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-2 h-2 bg-orange-500 rounded-full"
                            />
                            ⚡ {getTimeRemaining(deal.endDate)} left
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-[#70C285] transition-colors duration-300 line-clamp-2 leading-tight">
                          {deal.name}
                        </h3>
                        {deal.description && (
                          <p className="text-gray-400 text-xs mt-1.5 line-clamp-2">
                            {deal.description.substring(0, 80)}...
                          </p>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2">
                        <motion.span 
                          className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                          whileHover={{ scale: 1.05 }}
                        >
                          {formatPrice(deal.price)}
                        </motion.span>
                        {deal.originalPrice > deal.price && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(deal.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-1.5 bg-[#70C285]/15 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-[#70C285]/20"
                        >
                          <span className="text-[#70C285] text-xs">🏷️</span>
                          <span className="text-[#70C285] text-xs font-medium">{deal.badge}</span>
                        </motion.div>

                        {deal.originalPrice > deal.price && (
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1.5 bg-green-500/15 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-green-500/20"
                          >
                            <span className="text-green-400 text-xs">💰</span>
                            <span className="text-green-400 text-xs font-medium">
                              Save {formatPrice(deal.originalPrice - deal.price)}
                            </span>
                          </motion.div>
                        )}
                      </div>

                      <motion.div 
                        className="pt-3"
                        whileHover={{ x: 5 }}
                      >
                        <div className="inline-flex items-center gap-2 text-[#70C285] group-hover:text-white transition-colors text-sm font-medium">
                          <span>Shop Now</span>
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div 
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#70C285] to-[#5D4785] origin-left"
                      style={{ scaleX: deal.discount / 100 }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center md:hidden"
        >
          <Link
            href="/products?deals=true&sort=-discount"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#70C285] to-[#3D8F52] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Browse All Hot Deals
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}