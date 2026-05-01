'use client';

import { useState, useEffect, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const AVATAR_COLORS = [
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
  'from-indigo-500 to-violet-600',
];

function getAvatarColor(name) {
  let hash = 0;
  const safeName = name || 'User';
  for (let i = 0; i < safeName.length; i++) {
    hash = ((hash << 5) - hash) + safeName.charCodeAt(i);
    hash = hash & hash;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.split(' ').filter(n => n.length > 0);
  if (parts.length === 0) return '?';
  return parts.map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateString) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function TestimonialCard({ item }) {
  const userData = item.user || {};
  const userName = userData.username || 'User';
  const commentText = item.comment || '';
  const productName = item.product?.name || '';

  return (
    <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] hover:border-[#70C285]/30 rounded-2xl p-5 sm:p-6 h-full transition-all duration-300 hover:bg-white/[0.06] group">
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < (item.rating || 5) ? 'text-amber-400' : 'text-gray-600'}`}
            fill={i < (item.rating || 5) ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        ))}
      </div>

      {item.title && (
        <h4 className="text-white font-medium text-sm mb-2">{item.title}</h4>
      )}

      <p className="text-gray-300 text-sm leading-relaxed mb-5 line-clamp-4">
        &ldquo;{commentText}&rdquo;
      </p>

      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/[0.06]">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(userName)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
          {getInitials(userName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">@{userName}</p>
          <span className="text-gray-500 text-xs">{formatDate(item.createdAt)}</span>
        </div>
        {productName && (
          <span className="text-[#70C285] text-xs truncate max-w-[100px]">{productName}</span>
        )}
      </div>
    </div>
  );
}

function ReviewFormModal({ isOpen, onClose, onSubmit, products, productsLoading }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [productId, setProductId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productId) { setError('Please select a product'); return; }
    if (!comment.trim()) { setError('Please write a review'); return; }
    if (comment.trim().length < 10) { setError('Review must be at least 10 characters'); return; }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ productId, rating, title: title.trim(), comment: comment.trim() }),
      });

      const data = await response.json();

      if (response.ok || data.status === 'success') {
        setSuccess(true);
        onSubmit();
        setTimeout(() => { setSuccess(false); onClose(); resetForm(); }, 2000);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(5); setTitle(''); setComment(''); setProductId(''); setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1030] border border-white/10 rounded-2xl w-full max-w-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-xl font-bold text-white mb-6">Write a Review</h3>

        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm">
            ✅ Thank you! Your review has been submitted.
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Product *</label>
            <select 
              value={productId} 
              onChange={(e) => setProductId(e.target.value)} 
              className="w-full px-4 py-3 bg-white/[0.07] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#70C285] transition-all cursor-pointer" 
              required
            >
              <option value="" disabled className="bg-[#1a1030] text-gray-500">
                {productsLoading ? 'Loading products...' : products.length === 0 ? 'No products available' : 'Select a product...'}
              </option>
              {products.map((p) => (
                <option key={p._id} value={p._id} className="bg-[#1a1030]">{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <button key={i} type="button" onClick={() => setRating(i + 1)} className="p-1 transition-transform hover:scale-125">
                  <svg className={`w-7 h-7 ${i < rating ? 'text-amber-400' : 'text-gray-600'}`} fill={i < rating ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-400">{rating} / 5</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Review Title (optional)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sum up your experience..." maxLength={100} className="w-full px-4 py-3 bg-white/[0.07] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#70C285] transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Review *</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience... (min 10 characters)" rows={4} maxLength={1000} className="w-full px-4 py-3 bg-white/[0.07] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#70C285] transition-all resize-none" required />
            <p className="text-xs text-gray-500 mt-1 text-right">{comment.length}/1000</p>
          </div>

          <button type="submit" disabled={submitting || !productId || comment.trim().length < 10} className="w-full py-3 bg-gradient-to-r from-[#70C285] to-[#3D8F52] text-white font-semibold rounded-xl text-sm hover:shadow-lg hover:shadow-[#70C285]/25 transition-all disabled:opacity-40">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const scrollSpeed = 0.5;

  useEffect(() => {
    checkAuth();
    fetchAllReviews();
    fetchProducts();
  }, []);

  const checkAuth = () => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  };

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/reviews/all?limit=20&sort=newest`);
      const data = await res.json();
      const reviewsData = data.data?.reviews || [];
      setReviews(reviewsData);
      calculateStats(reviewsData);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      
      // Try multiple endpoints and handle different response formats
      const endpoints = [
        `${API_BASE}/products?limit=100`,
        `${API_BASE}/products`,
        `${API_BASE}/product`,
      ];

      let productsData = [];

      for (const endpoint of endpoints) {
        try {
          console.log('Trying products endpoint:', endpoint);
          const res = await fetch(endpoint);
          
          if (res.ok) {
            const data = await res.json();
            console.log('Products API response:', data);
            
            // Handle different response structures
            if (data.data?.products) {
              productsData = data.data.products;
            } else if (data.products) {
              productsData = data.products;
            } else if (data.data) {
              productsData = data.data;
            } else if (Array.isArray(data)) {
              productsData = data;
            }
            
            if (productsData.length > 0) {
              console.log('Found products:', productsData.length);
              break;
            }
          }
        } catch (err) {
          console.log('Endpoint failed:', endpoint, err);
        }
      }

      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const avg = total > 0 ? (data.reduce((s, r) => s + (r.rating || 0), 0) / total).toFixed(1) : 0;
    setStats({ totalReviews: total, averageRating: avg });
  };

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      window.location.href = '/signin';
      return;
    }
    // Refresh products when opening the form
    fetchProducts();
    setShowReviewForm(true);
  };

  const handleReviewSubmitted = () => {
    fetchAllReviews();
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || reviews.length === 0) return;

    const scroll = () => {
      if (!isPaused && !showReviewForm) {
        container.scrollLeft += scrollSpeed;
        if (container.scrollLeft >= container.scrollWidth / 2) container.scrollLeft = 0;
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [reviews, isPaused, showReviewForm]);

  const duplicatedReviews = [...reviews, ...reviews];

  if (loading) {
    return (
      <section className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-transparent via-[#3a2a5c]/20 to-transparent">
        <div className="text-center">
          <div className="w-48 h-8 bg-white/10 rounded mx-auto mb-4 animate-pulse" />
          <div className="w-72 h-4 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-gradient-to-b from-transparent via-[#3a2a5c]/30 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-[#70C285]/10 text-[#70C285] px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-[#70C285]/20">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">What Our Customers Say</h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">Real feedback from real people who trust our products</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">{stats.totalReviews}+</div>
              <div className="text-sm text-gray-500">Reviews</div>
            </div>
            <div className="w-px bg-white/10 h-12" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-400 flex items-center justify-center gap-1">
                {stats.averageRating}
                <svg className="w-5 h-5 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-sm text-gray-500">Avg Rating</div>
            </div>
          </div>
          
          <button 
            onClick={handleWriteReviewClick} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#70C285] to-[#3D8F52] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#70C285]/25 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isAuthenticated ? 'Write a Review' : 'Login to Review'}
          </button>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="relative w-full group" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div ref={scrollRef} className="flex gap-4 overflow-x-hidden py-4 px-[5vw]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {duplicatedReviews.map((item, index) => (
              <div key={`review-${item._id}-${index}`} className="flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px]">
                <TestimonialCard item={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-gray-400 text-lg mb-4">No reviews yet</p>
          <button onClick={handleWriteReviewClick} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#70C285] to-[#3D8F52] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#70C285]/25 transition-all">
            Be the first to review!
          </button>
        </div>
      )}

      <p className="text-center text-gray-600 text-xs mt-6">Hover to pause scrolling</p>

      <ReviewFormModal 
        isOpen={showReviewForm} 
        onClose={() => setShowReviewForm(false)} 
        onSubmit={handleReviewSubmitted} 
        products={products}
        productsLoading={productsLoading}
      />
    </section>
  );
}