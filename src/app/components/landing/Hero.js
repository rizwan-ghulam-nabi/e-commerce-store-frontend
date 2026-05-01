'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

const generatePlaceholderSVG = (text) => {
  const colors = ['4F46E5', '7C3AED', '059669', 'DC2626', 'EA580C'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600' viewBox='0 0 1200 600'%3E%3Crect width='1200' height='600' fill='%23${color}'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='28' font-family='Arial'%3E${encodeURIComponent(text || 'Product')}%3C/text%3E%3C/svg%3E`;
};

const FALLBACK_SLIDES = [
  {
    id: 'fallback-1',
    title: 'Discover Amazing',
    highlight: 'Products',
    description: 'Shop the latest trends with unbeatable prices',
    ctaText: 'Shop Now',
    bgGradient: 'from-violet-600/20 to-indigo-600/20',
    badge: 'New Collection',
    ctaLink: '/products',
    price: null,
    originalPrice: null,
    discount: null,
    imageUrl: null,
  },
  {
    id: 'fallback-2',
    title: 'Premium Quality',
    highlight: 'Best Sellers',
    description: 'Curated collection of our finest products',
    ctaText: 'Explore Now',
    bgGradient: 'from-emerald-600/20 to-teal-600/20',
    badge: 'Popular',
    ctaLink: '/products',
    price: null,
    originalPrice: null,
    discount: null,
    imageUrl: null,
  },
];

export default function Hero() {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const slideInterval = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      
      const response = await fetch(`${API_URL}/products?limit=20&sort=-createdAt`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      let allProducts = [];
      if (data?.data?.products && Array.isArray(data.data.products)) {
        allProducts = data.data.products;
      } else if (data?.data && Array.isArray(data.data)) {
        allProducts = data.data;
      } else if (data?.products && Array.isArray(data.products)) {
        allProducts = data.products;
      } else if (Array.isArray(data)) {
        allProducts = data;
      }

      const normalProducts = allProducts.filter(product => {
        const isFeatured = 
          product.isFeatured === true || 
          product.isFeatured === 'true' ||
          product.featured === true ||
          product.featured === 'true' ||
          product.is_featured === true;
        return !isFeatured;
      });

      if (normalProducts.length > 0) {
        const heroSlides = normalProducts.slice(0, 5).map((product, index) => {
          let imageUrl = null;
          if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            const mainImage = product.images.find(img => img.isMain || img.isPrimary);
            imageUrl = mainImage?.url || product.images[0]?.url;
          }
          if (!imageUrl) {
            imageUrl = product.image || product.imageUrl || product.thumbnail || null;
          }

          const price = parseFloat(product.price) || 0;
          const comparePrice = parseFloat(product.comparePrice) || 0;
          const discount = comparePrice > price ? `-${Math.round((1 - price / comparePrice) * 100)}%` : null;

          const categoryName = typeof product.category === 'object' 
            ? product.category?.name 
            : product.category || '';

          const colorSchemes = [
            'from-violet-600/20 to-indigo-600/20',
            'from-emerald-600/20 to-teal-600/20',
            'from-rose-600/20 to-pink-600/20',
            'from-amber-600/20 to-orange-600/20',
            'from-cyan-600/20 to-blue-600/20',
          ];

          return {
            id: product._id || product.id || `p-${index}`,
            title: product.name || 'Product',
            highlight: product.brand || categoryName || '',
            description: (product.description || '').substring(0, 80) || 'Premium quality product',
            ctaText: 'Shop Now',
            price: price > 0 ? price : null,
            originalPrice: comparePrice > price ? comparePrice : null,
            discount: discount,
            imageUrl: imageUrl,
            bgGradient: colorSchemes[index % colorSchemes.length],
            badge: product.stock <= 5 && product.stock > 0 ? 'Low Stock' : 'New Arrival',
            ctaLink: `/products/${product._id || product.id}`,
          };
        });

        setSlides(heroSlides);
      } else {
        setSlides(FALLBACK_SLIDES);
      }
      
    } catch (err) {
      console.error('❌ Hero Error:', err);
      setSlides(FALLBACK_SLIDES);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    if (slides.length > 1) setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length > 1) setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (slideInterval.current) clearInterval(slideInterval.current);
    if (isAutoPlaying && slides.length > 1) {
      slideInterval.current = setInterval(nextSlide, 5000);
    }
  };

  // Improved touch handling for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current) return;
    const diffX = Math.abs(e.touches[0].clientX - touchStartX.current);
    const diffY = Math.abs(e.touches[0].clientY - touchStartY.current);
    // Only prevent default if horizontal swipe
    if (diffX > diffY && diffX > 10) {
      e.preventDefault();
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e) => {
    if (!isSwiping.current) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextSlide() : prevSlide();
    }
    touchStartX.current = 0;
    isSwiping.current = false;
  };

  useEffect(() => {
    if (isAutoPlaying && slides.length > 1) {
      slideInterval.current = setInterval(nextSlide, 5000);
    }
    return () => { if (slideInterval.current) clearInterval(slideInterval.current); };
  }, [isAutoPlaying, nextSlide, slides.length]);

  const formatPrice = (price) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price * 280);
  };

  const getImageSrc = (slide) => slide.imageUrl || generatePlaceholderSVG(slide.title);

  // Truncate title for mobile
  const truncateTitle = (title, maxLength = 40) => {
    if (!title) return '';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  if (loading) {
    return (
      <section className="relative w-full">
        <div className="w-full h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 animate-pulse flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  // Slide content component (reusable for both single and carousel)
  const SlideContent = ({ slide }) => (
    <div className="relative z-20 h-full flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center md:text-left">
        {/* Badge */}
        <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm text-white mb-3 sm:mb-4 border border-white/20">
          {slide.badge}
        </span>
        
        {/* Title - Responsive sizes */}
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
          <span className="block sm:hidden">{truncateTitle(slide.title, 25)}</span>
          <span className="hidden sm:block md:hidden">{truncateTitle(slide.title, 40)}</span>
          <span className="hidden md:block">{slide.title}</span>
          {slide.highlight && (
            <span className="block text-violet-300 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-1 sm:mt-2">
              {slide.highlight}
            </span>
          )}
        </h1>
        
        {/* Description - Hidden on smallest screens */}
        <p className="hidden xs:block text-sm sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-6 max-w-xs sm:max-w-sm md:max-w-xl mx-auto md:mx-0 line-clamp-2 sm:line-clamp-3">
          {slide.description}
        </p>
        
        {/* Price */}
        {slide.price && (
          <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{formatPrice(slide.price)}</span>
            {slide.originalPrice && (
              <span className="text-sm sm:text-base md:text-lg text-gray-400 line-through">{formatPrice(slide.originalPrice)}</span>
            )}
            {slide.discount && (
              <span className="bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">{slide.discount}</span>
            )}
          </div>
        )}
        
        {/* CTA Button */}
        <Link 
          href={slide.ctaLink} 
          className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full hover:shadow-2xl hover:shadow-violet-500/25 transition-all font-semibold text-sm sm:text-base md:text-lg hover:scale-105 active:scale-95 w-full xs:w-auto min-w-[140px] sm:min-w-[160px]"
        >
          <span>{slide.ctaText}</span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );

  // Single Slide
  if (slides.length === 1) {
    const slide = slides[0];
    return (
      <section className="relative w-full">
        <div className="relative w-full h-[350px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] overflow-hidden">
          {/* Background */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} z-0`} />
          <div className="absolute inset-0 z-0">
            <img
              src={getImageSrc(slide)}
              alt={slide.title}
              className="w-full h-full object-cover object-center opacity-30 md:opacity-40 lg:opacity-50"
              loading="eager"
              onError={(e) => { e.target.src = generatePlaceholderSVG(slide.title); }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 sm:from-black/70 sm:via-black/40 sm:to-transparent" />
          </div>
          <SlideContent slide={slide} />
        </div>
      </section>
    );
  }

  // Carousel
  return (
    <section
      className="relative w-full group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full h-[350px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-all duration-500 sm:duration-700 ease-in-out ${
              idx === currentIndex 
                ? 'translate-x-0 opacity-100 z-10' 
                : idx < currentIndex 
                  ? '-translate-x-full opacity-0 z-0' 
                  : 'translate-x-full opacity-0 z-0'
            }`}
            aria-hidden={idx !== currentIndex}
          >
            {/* Background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} z-0`} />
            <div className="absolute inset-0 z-0">
              <img
                src={getImageSrc(slide)}
                alt={slide.title}
                className="w-full h-full object-cover object-center opacity-30 md:opacity-40 lg:opacity-50"
                loading={idx === 0 ? 'eager' : 'lazy'}
                onError={(e) => { e.target.src = generatePlaceholderSVG(slide.title); }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 sm:from-black/70 sm:via-black/40 sm:to-transparent" />
            </div>
            <SlideContent slide={slide} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Visible on mobile too */}
      {slides.length > 1 && (
        <>
          {/* Previous */}
          <button 
            onClick={prevSlide} 
            className="absolute left-2 sm:left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 sm:p-3 transition-all backdrop-blur-sm active:scale-90 touch-manipulation"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Next */}
          <button 
            onClick={nextSlide} 
            className="absolute right-2 sm:right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 sm:p-3 transition-all backdrop-blur-sm active:scale-90 touch-manipulation"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
            {slides.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => goToSlide(idx)} 
                className={`rounded-full transition-all duration-300 touch-manipulation ${
                  idx === currentIndex 
                    ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-white' 
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute bottom-4 sm:bottom-5 right-3 sm:right-5 md:right-8 z-20">
            <span className="text-white text-xs sm:text-sm bg-black/40 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              {currentIndex + 1}/{slides.length}
            </span>
          </div>
        </>
      )}
    </section>
  );
}