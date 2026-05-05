'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  // Helper for authenticated API calls
  const apiFetch = (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };
    return fetch(url, { ...options, credentials: 'include', headers });
  };

  useEffect(() => {
    setMounted(true);
    
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!token || !isAuth) {
      router.push('/signin?redirect=/cart');
      return;
    }
    
    fetchCart();
    
    const handleCartUpdate = () => fetchCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`${API_BASE}/cart`);

      if (response.status === 401) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        router.push('/signin?redirect=/cart');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch cart');

      const data = await response.json();
      console.log('Cart response:', data);
      
      // Your backend returns: data.data.cart with items array
      const cart = data.data?.cart || data.cart || data;
      const items = cart?.items || [];
      
      setCartData(cart);
      setCartItems(Array.isArray(items) ? items : []);
      
    } catch (err) {
      console.error('Cart fetch error:', err);
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  // Update quantity - uses cart item _id, method PATCH
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItem(itemId);
    try {
      const response = await apiFetch(`${API_BASE}/cart/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setUpdatingItem(null);
    }
  };

  // Remove item - uses cart item _id
  const removeItem = async (itemId) => {
    setUpdatingItem(itemId);
    try {
      const response = await apiFetch(`${API_BASE}/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCart();
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (err) {
      console.error('Remove error:', err);
    } finally {
      setUpdatingItem(null);
    }
  };

  // Clear cart - uses DELETE /cart (no item ID)
  const clearCart = async () => {
    if (!confirm('Remove all items?')) return;
    
    try {
      await apiFetch(`${API_BASE}/cart`, {
        method: 'DELETE',
      });
      fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format((price || 0) * 280);
  };

  // Animation variants
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
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 25px -12px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 200
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const quantityButtonVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "#f3f4f6",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.9
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="w-12 h-12 mx-auto mb-4"
          >
            <svg className="w-full h-full text-violet-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500"
          >
            Loading cart...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="bg-white border-b border-gray-100 sticky top-16 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-900"
              >
                Shopping Cart
              </motion.h1>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-500 mt-1"
              >
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </motion.p>
            </div>
            {cartItems.length > 0 && (
              <motion.button
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, color: "#ef4444" }}
                whileTap={{ scale: 0.95 }}
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Clear Cart
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="text-center py-20"
          >
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </motion.div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Your cart is empty
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-500 mb-8"
            >
              Add some products to get started!
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/products')}
              className="px-8 py-3.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all"
            >
              Browse Products
            </motion.button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div 
              className="flex-1 space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover="hover"
                    whileTap="tap"
                    layout
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex gap-4">
                        <motion.div 
                          className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                          whileHover="hover"
                        >
                          <Link href={`/products/${item.product?._id || item.product}`}>
                            <motion.div variants={imageVariants} className="w-full h-full">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                </div>
                              )}
                            </motion.div>
                          </Link>
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <div>
                              <Link href={`/products/${item.product?._id || item.product}`} className="font-semibold text-gray-900 hover:text-violet-600 transition-colors">
                                {item.name}
                              </Link>
                              <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg font-bold text-gray-900 mt-1"
                              >
                                {formatPrice(item.price)}
                              </motion.p>
                            </div>
                            <motion.button 
                              onClick={() => removeItem(item._id)} 
                              disabled={updatingItem === item._id}
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              {updatingItem === item._id ? (
                                <motion.svg 
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4" 
                                  fill="none" 
                                  viewBox="0 0 24 24"
                                >
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </motion.svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </motion.button>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Qty:</span>
                              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                <motion.button 
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                                  disabled={item.quantity <= 1}
                                  variants={quantityButtonVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
                                >
                                  -
                                </motion.button>
                                <motion.span 
                                  key={item.quantity}
                                  initial={{ scale: 1.2, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="w-10 h-8 flex items-center justify-center text-sm font-semibold bg-gray-50"
                                >
                                  {updatingItem === item._id ? (
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                      className="w-3 h-3 border-2 border-violet-600 border-t-transparent rounded-full"
                                    />
                                  ) : (
                                    item.quantity
                                  )}
                                </motion.span>
                                <motion.button 
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  variants={quantityButtonVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                  +
                                </motion.button>
                              </div>
                            </div>
                            <motion.p 
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 }}
                              className="text-sm font-semibold"
                            >
                              Subtotal: <span className="text-violet-600">{formatPrice(item.price * item.quantity)}</span>
                            </motion.p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Order Summary */}
            <motion.div 
              className="lg:w-96"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            >
              <motion.div 
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28"
                whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <motion.h2 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-lg font-bold text-gray-900 mb-6"
                >
                  Order Summary
                </motion.h2>
                <div className="space-y-3 text-sm">
                  <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-between text-gray-600"
                  >
                    <span>Total Items</span>
                    <motion.span 
                      key={cartData?.totalItems || cartItems.length}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {cartData?.totalItems || cartItems.length}
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-between text-gray-600"
                  >
                    <span>Subtotal</span>
                    <span>{formatPrice(cartData?.totalPrice || 0)}</span>
                  </motion.div>
                  <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="border-t border-gray-100 pt-3"
                  >
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <motion.span 
                        key={cartData?.totalPrice || 0}
                        initial={{ scale: 1.1, color: "#8b5cf6" }}
                        animate={{ scale: 1, color: "#8b5cf6" }}
                        className="text-violet-600"
                      >
                        {formatPrice(cartData?.totalPrice || 0)}
                      </motion.span>
                    </div>
                  </motion.div>
                </div>
                <motion.button 
                  onClick={() => router.push('/checkout')}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Proceed to Checkout
                </motion.button>
                <motion.button 
                  onClick={() => router.push('/products')}
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full text-center mt-4 text-sm text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Continue Shopping
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}