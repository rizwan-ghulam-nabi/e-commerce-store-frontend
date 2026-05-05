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
      </div>
    </div>
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0 });
  const [isPaused, setIsPaused] = useState(false);
  
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const scrollSpeed = 0.5;

  useEffect(() => {
    fetchStoreReviews();
  }, []);

  const fetchStoreReviews = async () => {
    try {
      setLoading(true);
      // Fetch ONLY store testimonials (not product-specific)
      const res = await fetch(`${API_BASE}/reviews/store?limit=20&sort=newest`);
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

  const calculateStats = (data) => {
    const total = data.length;
    const avg = total > 0 ? (data.reduce((s, r) => s + (r.rating || 0), 0) / total).toFixed(1) : 0;
    setStats({ totalReviews: total, averageRating: avg });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || reviews.length === 0) return;

    const scroll = () => {
      if (!isPaused) {
        container.scrollLeft += scrollSpeed;
        if (container.scrollLeft >= container.scrollWidth / 2) container.scrollLeft = 0;
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [reviews, isPaused]);

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

  if (reviews.length === 0) return null;

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-gradient-to-b from-transparent via-[#3a2a5c]/30 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-[#70C285]/10 text-[#70C285] px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-[#70C285]/20">
            ⭐ Customer Stories
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">What Our Customers Say</h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Real feedback from people who love shopping with us
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">{stats.totalReviews}+</div>
              <div className="text-sm text-gray-500">Customer Stories</div>
            </div>
            <div className="w-px bg-white/10 h-12" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-400 flex items-center justify-center gap-1">
                {stats.averageRating}
                <svg className="w-5 h-5 fill-amber-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full group" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <div ref={scrollRef} className="flex gap-4 overflow-x-hidden py-4 px-[5vw]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {duplicatedReviews.map((item, index) => (
            <div key={`review-${item._id}-${index}`} className="flex-shrink-0 w-[300px] sm:w-[340px] md:w-[380px]">
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
        
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0f0b1a] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0f0b1a] to-transparent pointer-events-none" />
      </div>

      <p className="text-center text-gray-500 text-xs mt-6">
        Hover to pause scrolling • Real customer experiences
      </p>
    </section>
  );
}