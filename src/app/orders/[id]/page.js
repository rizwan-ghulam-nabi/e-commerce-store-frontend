// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams, useSearchParams } from 'next/navigation';
// import Link from 'next/link';

// export default function OrderDetailPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const isSuccess = searchParams.get('success') === 'true';
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

//   useEffect(() => {
//     if (params.id) fetchOrder();
//   }, [params.id]);

//   const fetchOrder = async () => {
//     const token = localStorage.getItem('token');
//     const res = await fetch(`${API_BASE}/orders/${params.id}`, {
//       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//       credentials: 'include',
//     });
//     if (res.ok) {
//       const data = await res.json();
//       setOrder(data.data?.order || data.order || data.data || data);
//     }
//     setLoading(false);
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format((price || 0) * 280);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
//         <svg className="w-12 h-12 animate-spin text-violet-600" fill="none" viewBox="0 0 24 24">
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//         </svg>
//       </div>
//     );
//   }

//   if (!order) return null;

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20 pb-12">
//       <div className="max-w-2xl mx-auto px-4 py-8">
//         {isSuccess && (
//           <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-center">
//             <div className="text-4xl mb-2">🎉</div>
//             <h2 className="text-xl font-bold text-green-800">Order Placed!</h2>
//             <p className="text-green-600">Thank you for your order!</p>
//           </div>
//         )}

//         <div className="bg-white rounded-2xl shadow-sm border p-6">
//           <div className="flex justify-between mb-6">
//             <h1 className="text-xl font-bold">Order #{order.orderNumber}</h1>
//             <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold capitalize">{order.status}</span>
//           </div>

//           <div className="space-y-3 mb-4">
//             {order.items?.map((item) => (
//               <div key={item._id} className="flex justify-between py-2 border-b text-sm">
//                 <div>
//                   <p className="font-medium">{item.name}</p>
//                   <p className="text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
//                 </div>
//                 <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
//               </div>
//             ))}
//           </div>

//           <div className="border-t pt-3 flex justify-between text-lg font-bold">
//             <span>Total</span>
//             <span className="text-violet-600">{formatPrice(order.total)}</span>
//           </div>
//         </div>

//         <div className="mt-6 text-center">
//           <Link href="/products" className="text-violet-600 hover:underline">Continue Shopping</Link>
//         </div>
//       </div>
//     </div>
//   );
// }








//5/5/2026

'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingStatus, setTrackingStatus] = useState(0);
  const [particles, setParticles] = useState([]);
  const [floatingHearts, setFloatingHearts] = useState([]);
  
  // All hooks at the top level
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const heroX = useTransform(mouseX, (value) => value * 20);
  const heroY = useTransform(mouseY, (value) => value * 20);
  const rotateX = useTransform(mouseY, (value) => value * 5);
  const rotateY = useTransform(mouseX, (value) => value * 5);
  
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    if (params.id) fetchOrder();
    if (isSuccess) {
      createParticles(50);
      createFloatingHearts(20);
      setTimeout(() => {
        setParticles([]);
        setFloatingHearts([]);
      }, 4000);
    }
  }, [params.id, isSuccess]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        mouseX.set(x);
        mouseY.set(y);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const createParticles = (count) => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 2,
        color: `hsl(${Math.random() * 60 + 260}, 70%, 65%)`,
      });
    }
    setParticles(newParticles);
  };

  const createFloatingHearts = (count) => {
    const newHearts = [];
    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      });
    }
    setFloatingHearts(newHearts);
  };

  const fetchOrder = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/orders/${params.id}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      const orderData = data.data?.order || data.order || data.data || data;
      setOrder(orderData);
      const statusMap = {
        'pending': 1,
        'processing': 2,
        'shipped': 3,
        'delivered': 4,
        'cancelled': 0
      };
      setTrackingStatus(statusMap[orderData.status?.toLowerCase()] || 1);
    }
    setLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', { 
      style: 'currency', 
      currency: 'PKR', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format((price || 0) * 280);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-PK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cancelled: 'bg-rose-100 text-rose-700 border-rose-200'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'shipped': return '📦';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusSteps = () => {
    return [
      { name: 'Order Placed', status: trackingStatus >= 1, icon: '🛒' },
      { name: 'Processing', status: trackingStatus >= 2, icon: '⚙️' },
      { name: 'Shipped', status: trackingStatus >= 3, icon: '🚚' },
      { name: 'Delivered', status: trackingStatus >= 4, icon: '🏠' }
    ];
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 15, stiffness: 120 }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { type: "spring", damping: 10, stiffness: 200 }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 relative overflow-hidden">
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#AC9CC9] via-[#5D4785] to-[#463663]"></div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#70C285]/20 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3D8F52]/20 rounded-full blur-[120px] animate-float-delayed"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#AC9CC9] to-[#5D4785] rounded-full flex items-center justify-center shadow-2xl"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/80 text-lg">Loading your order details...</motion.p>
        </div>
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            50% { transform: translate(20px, -15px) scale(1.05); opacity: 0.5; }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
            50% { transform: translate(-15px, 20px) scale(1.05); opacity: 0.5; }
          }
          .animate-float { animation: float 8s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  if (!order) return null;

  const isCancelled = order.status?.toLowerCase() === 'cancelled';

  return (
    <div ref={containerRef} className="min-h-screen pt-20 pb-12 overflow-hidden relative">
      {/* Background Gradient - Matching your site */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#AC9CC9] via-[#5D4785] to-[#463663]"></div>
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#70C285]/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3D8F52]/20 rounded-full blur-[120px] animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9a8f97]/15 rounded-full blur-[140px]"></div>
      </div>

      {/* Particles & Hearts */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ x: `${particle.x}%`, y: '100%', opacity: 1, scale: 0 }}
            animate={{ y: '-100%', opacity: 0, scale: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration, delay: particle.delay, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none"
            style={{ left: `${particle.x}%`, width: particle.size, height: particle.size, backgroundColor: particle.color, boxShadow: `0 0 10px ${particle.color}` }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ x: `${heart.x}%`, y: '100%', opacity: 1, scale: 0, rotate: 0 }}
            animate={{ y: '-100%', opacity: 0, scale: 1.5, rotate: [0, 20, -20, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: heart.duration, delay: heart.delay, ease: "easeOut" }}
            className="absolute pointer-events-none text-2xl"
            style={{ left: `${heart.x}%` }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#AC9CC9] via-[#5D4785] to-[#463663]"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: '200% 200%', x: heroX, y: heroY }}
        />
        <div className="absolute inset-0 bg-black/20"></div>
        
        <motion.div animate={floatAnimation} className="absolute top-20 right-20 w-32 h-32 bg-[#70C285]/20 rounded-full blur-2xl" />
        <motion.div animate={{ ...floatAnimation, transition: { delay: 1 } }} className="absolute bottom-20 left-20 w-48 h-48 bg-[#3D8F52]/20 rounded-full blur-2xl" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            style={{ transform: `perspective(1000px) rotateX(${rotateX}) rotateY(${rotateY})` }}
          >
            <motion.div whileHover={{ x: -5 }} className="inline-block mb-4">
              <Link href="/orders" className="text-white/80 hover:text-white transition-all flex items-center gap-2 group">
                <motion.svg animate={{ x: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </motion.svg>
                Back to Orders
              </Link>
            </motion.div>
            <motion.h1 className="text-3xl md:text-4xl font-bold mb-2 text-white" animate={pulseAnimation}>Order Details</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-purple-100 text-lg">
              Order #{order.orderNumber || order._id?.slice(-8)}
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={order._id} variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            
            {/* Success Message */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="relative bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 text-center overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 0.6, repeat: 3 }} className="text-6xl mb-3">🎉</motion.div>
                <motion.h2 initial={{ y: 20 }} animate={{ y: 0 }} className="text-2xl font-bold text-emerald-800 mb-2">Order Placed Successfully!</motion.h2>
                <motion.p initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }} className="text-emerald-600">Thank you for your order! We'll notify you when it ships.</motion.p>
                
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, rotate: 0 }}
                    animate={{ x: [0, (Math.random() - 0.5) * 200], y: [0, -100], rotate: [0, Math.random() * 360] }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ left: `${Math.random() * 100}%`, top: '50%', backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)` }}
                  />
                ))}
              </motion.div>
            )}

            {/* Order Status Card */}
            <motion.div variants={cardVariants} whileHover="hover" className="group">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
                <div className="bg-gradient-to-r from-[#AC9CC9]/10 to-[#5D4785]/10 px-6 py-4 border-b border-white/20">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
                      <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-3xl">{getStatusIcon(order.status)}</motion.span>
                      <div>
                        <p className="text-sm text-gray-500">Order Status</p>
                        <motion.p className={`text-lg font-semibold capitalize ${!isCancelled ? 'text-[#5D4785]' : 'text-rose-600'}`}>
                          {order.status || 'Pending'}
                        </motion.p>
                      </div>
                    </motion.div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Placed on</p>
                      <motion.p initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-medium text-gray-700">
                        {formatDate(order.createdAt || order.orderDate)}
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                {!isCancelled && order.status?.toLowerCase() !== 'cancelled' && (
                  <div className="px-6 py-8 border-b border-white/20">
                    <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-semibold text-gray-700 mb-8">Order Tracking Timeline</motion.h3>
                    <div className="relative">
                      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#AC9CC9] to-[#5D4785] rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: `${(trackingStatus / 4) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        />
                      </div>
                      <div className="relative flex justify-between">
                        {getStatusSteps().map((step, index) => (
                          <motion.div key={index} initial={{ opacity: 0, scale: 0, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: index * 0.2, type: "spring" }} className="text-center group/step">
                            <motion.div 
                              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 cursor-pointer ${
                                step.status ? 'bg-gradient-to-r from-[#AC9CC9] to-[#5D4785] text-white shadow-lg' : 'bg-gray-200 text-gray-400'
                              }`}
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <motion.span className="text-xl" animate={step.status ? pulseAnimation : {}}>{step.icon}</motion.span>
                            </motion.div>
                            <p className={`text-xs font-semibold ${step.status ? 'text-[#5D4785]' : 'text-gray-400'}`}>{step.name}</p>
                            {step.status && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs text-[#5D4785] mt-1">✓</motion.div>}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div variants={cardVariants} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
              <div className="px-6 py-4 bg-gradient-to-r from-[#AC9CC9]/10 to-[#5D4785]/10 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
                    <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                  </div>
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>📦</motion.div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                <AnimatePresence mode="popLayout">
                  {order.items?.map((item, index) => (
                    <motion.div
                      key={item._id || index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ delay: index * 0.1, type: "spring", damping: 15, stiffness: 120 }}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(172, 156, 201, 0.05)", transition: { duration: 0.2 } }}
                      className="p-6 cursor-pointer group/item"
                    >
                      <div className="flex gap-5">
                        <motion.div 
                          className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <motion.svg animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </motion.svg>
                          )}
                        </motion.div>

                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between gap-2">
                            <div>
                              <motion.h3 className="font-semibold text-gray-900 group-hover/item:text-[#5D4785] transition-colors" whileHover={{ x: 5 }}>{item.name}</motion.h3>
                              <div className="flex items-center gap-2 mt-1">
                                <motion.div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg" whileHover={{ scale: 1.05 }}>
                                  <span className="text-xs text-gray-600">Qty:</span>
                                  <span className="text-sm font-semibold">{item.quantity}</span>
                                </motion.div>
                              </div>
                            </div>
                            <div className="text-right">
                              <motion.p className="text-xl font-bold text-[#5D4785]" whileHover={{ scale: 1.05 }}>{formatPrice(item.price * item.quantity)}</motion.p>
                              <p className="text-xs text-gray-400">{formatPrice(item.price)} × {item.quantity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div variants={cardVariants} whileHover={{ y: -5 }} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
              <div className="px-6 py-4 bg-gradient-to-r from-[#AC9CC9]/10 to-[#5D4785]/10 border-b border-white/20">
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: 'Subtotal', value: order.subtotal || order.total },
                  { label: 'Shipping', value: order.shippingCost || 0 },
                  ...(order.discount > 0 ? [{ label: 'Discount', value: -order.discount }] : []),
                ].map((item, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex justify-between py-2">
                    <span className="text-gray-600">{item.label}</span>
                    <motion.span whileHover={{ scale: 1.05 }} className={`font-medium ${item.value < 0 ? 'text-emerald-600' : ''}`}>
                      {item.value < 0 ? `-${formatPrice(Math.abs(item.value))}` : formatPrice(item.value)}
                    </motion.span>
                  </motion.div>
                ))}
                
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring" }} className="border-t pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-3xl font-bold text-[#5D4785]">{formatPrice(order.total)}</motion.span>
                  </div>
                </motion.div>

                {order.paymentMethod && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4 pt-4 border-t">
                    <motion.div className="flex items-center gap-3" whileHover={{ x: 5 }}>
                      <motion.svg animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </motion.svg>
                      <div>
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="text-sm font-medium text-gray-700 capitalize">{order.paymentMethod}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Shipping Information */}
            {order.shippingAddress && (
              <motion.div variants={cardVariants} whileHover={{ scale: 1.01 }} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
                <div className="px-6 py-4 bg-gradient-to-r from-[#AC9CC9]/10 to-[#5D4785]/10 border-b border-white/20">
                  <div className="flex items-center gap-2">
                    <motion.div animate={{ x: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>📍</motion.div>
                    <h2 className="text-lg font-bold text-gray-900">Shipping Information</h2>
                  </div>
                </div>
                <div className="p-6">
                  <motion.div className="flex items-start gap-3" whileHover={{ x: 5 }}>
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1">
                      <motion.p className="font-medium text-gray-900" whileHover={{ color: "#5D4785" }}>{order.shippingAddress.fullName || 'Customer'}</motion.p>
                      <p className="text-sm text-gray-600 mt-1">{order.shippingAddress.address}</p>
                      <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && <motion.p className="text-sm text-gray-600 mt-2" whileHover={{ scale: 1.05 }}>📞 {order.shippingAddress.phone}</motion.p>}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center pt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} animate={{ boxShadow: ["0 0 0 0 rgba(92, 71, 133, 0.4)", "0 0 0 10px rgba(92, 71, 133, 0)", "0 0 0 0 rgba(92, 71, 133, 0)"] }} transition={{ duration: 2, repeat: Infinity }}>
                <Link href="/products">
                  <button className="px-8 py-3.5 bg-gradient-to-r from-[#AC9CC9] to-[#5D4785] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                    <span className="flex items-center gap-2">
                      Continue Shopping
                      <motion.svg animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </span>
                  </button>
                </Link>
              </motion.div>
              
              {order.status?.toLowerCase() === 'delivered' && (
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => window.location.href = '/products'}
                  className="px-8 py-3.5 bg-white text-[#5D4785] border-2 border-[#5D4785] rounded-xl font-semibold hover:bg-[#AC9CC9]/10 transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">Buy Again</span>
                  <motion.div className="absolute inset-0 bg-[#AC9CC9]/20" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
                </motion.button>
              )}
            </motion.div>

            {/* Floating WhatsApp Support */}
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, type: "spring" }} className="fixed bottom-6 right-6 z-50" whileHover={{ scale: 1.1, rotate: 5 }}>
              <a href={`https://wa.me/923000000000?text=Need%20help%20with%20order%20#${order.orderNumber}`} target="_blank" rel="noopener noreferrer" className="block bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>💬</motion.div>
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(20px, -15px) scale(1.05); opacity: 0.5; }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(-15px, 20px) scale(1.05); opacity: 0.5; }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-float, .animate-float-delayed { animation: none; opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}