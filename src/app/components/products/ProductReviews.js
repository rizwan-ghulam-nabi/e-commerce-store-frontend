
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

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
  return `${Math.floor(days / 30)}mo ago`;
}

export default function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ average: 0, total: 0, distribution: {} });
  const [userReview, setUserReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchProductReviews();
  }, [productId]);

  const checkAuth = () => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  };

  const fetchProductReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/reviews/product/${productId}?limit=20`);
      const data = await response.json();
      
      const reviewsData = data.data?.reviews || data.reviews || [];
      console.log('📝 Product Reviews Data:', reviewsData);
      console.log('📝 First review user:', reviewsData[0]?.user);
      
      setReviews(reviewsData);
      calculateStats(reviewsData);
      
      // Check if current user has already reviewed
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // This endpoint might be wrong - fix it
          const userResponse = await fetch(`${API_BASE}/reviews/check/${productId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData.data?.existingReview) {
              setUserReview(userData.data.existingReview);
            }
          }
        } catch (err) {
          console.log('No user review found');
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewsData) => {
    const total = reviewsData.length;
    const average = total > 0 
      ? reviewsData.reduce((sum, r) => sum + (r.rating || 0), 0) / total 
      : 0;
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });
    
    setStats({ average: average.toFixed(1), total, distribution });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = `/signin?redirect=/products/${productId}`;
      return;
    }
    
    if (comment.length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim(),
          comment: comment.trim()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setShowForm(false);
        setTitle('');
        setComment('');
        setRating(5);
        fetchProductReviews();
        // Dispatch event to update product rating
        window.dispatchEvent(new Event('productReviewUpdated'));
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ FIXED: Function to get username from review
  const getReviewUserName = (review) => {
    if (review.user) {
      if (typeof review.user === 'object') {
        // Populated user object
        return review.user.username || review.user.name || 'Customer';
      } else if (typeof review.user === 'string') {
        // Just an ID - show placeholder
        return 'Customer';
      }
    }
    return 'Customer';
  };

  const renderStars = (rating, size = 'sm') => {
    const starClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${starClass} ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
            fill={star <= rating ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Success Message */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
          >
            ✓ Thank you for your review! It will help other customers.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-900">
          Customer Reviews
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({stats.total} reviews)
          </span>
        </h2>
        
        {!userReview && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-all"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Rating Summary */}
      {stats.total > 0 && (
        <div className="flex flex-col md:flex-row gap-6 mb-8 pb-6 border-b border-gray-100">
          <div className="text-center md:text-left">
            <div className="text-4xl font-bold text-gray-900">{stats.average}</div>
            <div className="mt-1">{renderStars(parseInt(stats.average), 'lg')}</div>
            <div className="text-sm text-gray-500 mt-1">Based on {stats.total} reviews</div>
          </div>
          
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <div className="w-12 text-sm text-gray-600">{star} star</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-500">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showForm && !userReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-4 bg-gray-50 rounded-xl"
          >
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {error && (
                <div className="p-2 bg-red-50 text-red-600 text-sm rounded-lg">
                  ⚠️ {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <svg className={`w-8 h-8 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block  text-sm font-medium text-gray-700 mb-2">
                  Review Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  maxLength="100"
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  required
                  placeholder="What did you like or dislike about this product?"
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting || comment.length < 10}
                  className="px-6 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-6">
        {userReview && (
          <div className="p-4 bg-violet-50 rounded-xl border border-violet-200">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="text-sm font-medium text-violet-600">Your Review</span>
              <span className="text-xs text-gray-500">
                {formatDate(userReview.createdAt)}
              </span>
            </div>
            <div className="mb-2">{renderStars(userReview.rating)}</div>
            {userReview.title && (
              <h4 className="font-semibold text-gray-900 mb-1">{userReview.title}</h4>
            )}
            <p className="text-gray-700 text-sm">{userReview.comment}</p>
          </div>
        )}
        
        {reviews.filter(r => !userReview || r._id !== userReview._id).map((review, index) => {
          // ✅ FIXED: Get username properly
          const userName = getReviewUserName(review);
          
          return (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            >
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(userName)}
                  </div>
                  <div>
                    {/* ✅ FIXED: Display actual username, not "Anonymous" */}
                    <span className="font-medium text-gray-900">
                      @{userName}
                    </span>
                    {review.isVerifiedPurchase && (
                      <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              
              <div className="mb-2">{renderStars(review.rating)}</div>
              
              {review.title && (
                <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
              )}
              
              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            </motion.div>
          );
        })}
      </div>

      {stats.total === 0 && !userReview && (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">📝</div>
          <p className="text-gray-500 mb-4">No reviews yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-all"
          >
            Be the first to review
          </button>
        </div>
      )}
    </div>
  );
}

