
'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { useCategoriesData } from '../../hooks/useCategoriesData';

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

// Modern Product Card Component
const ProductCard = ({ product, onWishlistUpdate }) => {
  const [imageError, setImageError] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const wishlistCheckRef = useRef(false)

  const productName = product?.name || 'Untitled Product'
  const productPrice = product?.price || 0
  const productStock = product?.stock ?? 0
  const productRating = product?.rating || 0
  const productBrand = product?.brand || ''
  const comparePrice = product?.comparePrice || null
  const discountPercentage = product?.discountPercentage || 
    (comparePrice && comparePrice > productPrice 
      ? Math.round((1 - productPrice / comparePrice) * 100) 
      : 0)

  const categoryName = typeof product?.category === 'object' 
    ? product.category?.name 
    : product?.category || 'Uncategorized'

  const imageUrl = product?.images?.[0]?.url || product?.image

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true'
      setIsAuthenticated(isAuth)
      if (isAuth && !wishlistCheckRef.current) {
        wishlistCheckRef.current = true
        checkWishlistStatus()
      }
    }
    checkAuth()
  }, [product._id])

  const checkWishlistStatus = async () => {
    try {
      const response = await apiFetch('http://localhost:5000/api/v1/wishlist')
      if (response.ok) {
        const data = await response.json()
        let items = data.data?.wishlist?.products || data.data?.wishlist || data.wishlist || data.data || (Array.isArray(data) ? data : [])
        if (items && !Array.isArray(items) && items.products) items = items.products
        if (Array.isArray(items)) {
          const itemIds = items.map(item => item.product?._id || item._id)
          setIsInWishlist(itemIds.includes(product._id))
        }
      }
    } catch (error) {}
  }

  const formatPrice = (price) => {
    const pkrPrice = price * 280
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(pkrPrice)
  }

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div')
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-2xl shadow-2xl z-50 animate-slideUp font-medium text-sm ${
      type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
    }`
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => {
      toast.style.opacity = '0'
      toast.style.transform = 'translateY(20px)'
      toast.style.transition = 'all 0.3s ease'
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  const handleAddToWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { window.location.href = '/signin?redirect=/products'; return }
    setWishlistLoading(true)
    try {
      const response = await apiFetch('http://localhost:5000/api/v1/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id }),
      })
      if (response.ok) {
        setIsInWishlist(true)
        if (onWishlistUpdate) onWishlistUpdate()
        showToast('Added to wishlist!', 'success')
        window.dispatchEvent(new Event('wishlistUpdated'))
      }
    } catch (error) {} finally {
      setWishlistLoading(false)
    }
  }

  const handleRemoveFromWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlistLoading(true)
    try {
      const response = await apiFetch(`http://localhost:5000/api/v1/wishlist/${product._id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setIsInWishlist(false)
        if (onWishlistUpdate) onWishlistUpdate()
        showToast('Removed from wishlist', 'success')
        window.dispatchEvent(new Event('wishlistUpdated'))
      }
    } catch (error) {} finally {
      setWishlistLoading(false)
    }
  }

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { window.location.href = '/signin?redirect=/products'; return }
    if (productStock === 0) return
    setCartLoading(true)
    try {
      const response = await apiFetch('http://localhost:5000/api/v1/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      })
      if (response.ok) {
        showToast('Added to cart!', 'success')
        window.dispatchEvent(new Event('cartUpdated'))
      }
    } catch (error) {} finally {
      setCartLoading(false)
    }
  }

  const finalImageSrc = imageUrl && !imageError ? imageUrl : '/placeholder.png'

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          <img 
            src={finalImageSrc} 
            alt={productName}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            loading="lazy"
            onError={() => setImageError(true)}
          />
          
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          <button
            onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
            disabled={wishlistLoading}
            className={`absolute top-4 right-4 z-10 p-2.5 rounded-full transition-all duration-300 ${
              isInWishlist 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25' 
                : 'bg-white/90 text-gray-700 hover:bg-white shadow-md hover:shadow-lg'
            } ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 sm:opacity-100 sm:translate-y-0'}`}
          >
            {wishlistLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-500/25">
                {discountPercentage}% OFF
              </span>
            )}
            {productStock === 0 && (
              <span className="px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">
                Sold Out
              </span>
            )}
            {productStock > 0 && productStock <= 5 && (
              <span className="px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-amber-500/25">
                Only {productStock} left
              </span>
            )}
          </div>

          <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={productStock === 0 || cartLoading}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                productStock === 0 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg'
              }`}
            >
              {cartLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            {productBrand && (
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{productBrand}</span>
            )}
            {productBrand && <span className="text-gray-300">•</span>}
            <span className="text-xs text-gray-500">{categoryName}</span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-sm leading-snug group-hover:text-violet-600 transition-colors">
            {productName}
          </h3>
          
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(productRating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-400">({productRating.toFixed(1)})</span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">{formatPrice(productPrice)}</span>
            {comparePrice && comparePrice > productPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(comparePrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

// Skeleton Loader
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-[4/5] bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-6 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
)

// Category Section Component
const CategorySection = ({ categoryName, categoryId, products, onWishlistUpdate, onViewAll }) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">{categoryName}</h2>
          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            {products.length} products
          </span>
        </div>
        <button
          onClick={() => onViewAll(categoryId)}
          className="flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors group"
        >
          View All
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product, index) => (
          <div key={product._id} className="animate-fadeInUp" style={{ animationDelay: `${index * 50}ms` }}>
            <ProductCard product={product} onWishlistUpdate={onWishlistUpdate} />
          </div>
        ))}
      </div>
    </section>
  )
}

// Main Products Page Content
function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('-createdAt')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [viewMode, setViewMode] = useState('categories')
  
  const hasFetchedRef = useRef(false)
  const isFetchingRef = useRef(false)
  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)
  const { categories, loading: categoriesLoading } = useCategoriesData()

  const productsByCategory = useMemo(() => {
    if (selectedCategory) return null
    const grouped = {}
    products.forEach(product => {
      const catId = typeof product.category === 'object' ? product.category?._id : product.category
      const catName = typeof product.category === 'object' ? product.category?.name : product.category || 'Uncategorized'
      const key = catId || catName || 'uncategorized'
      if (!grouped[key]) {
        grouped[key] = {
          categoryName: catName || 'Uncategorized',
          categoryId: catId || key,
          products: []
        }
      }
      grouped[key].products.push(product)
    })
    return grouped
  }, [products, selectedCategory])

  useEffect(() => {
    const saved = localStorage.getItem('searchHistory')
    if (saved) { try { setSearchHistory(JSON.parse(saved)) } catch (e) {} }
  }, [])

  const addToSearchHistory = (query) => {
    if (!query.trim()) return
    const updated = [query, ...searchHistory.filter(s => s !== query)].slice(0, 10)
    setSearchHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const removeFromSearchHistory = (index) => {
    const updated = searchHistory.filter((_, i) => i !== index)
    setSearchHistory(updated)
    localStorage.setItem('searchHistory', JSON.stringify(updated))
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  useEffect(() => {
    setMounted(true)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const page = searchParams.get('page')
    const sort = searchParams.get('sort')
    if (query) setSearchQuery(query)
    if (category) setSelectedCategory(category)
    if (page) setCurrentPage(parseInt(page))
    if (sort) setSortBy(sort)
  }, [])

  useEffect(() => {
    if (!mounted || hasFetchedRef.current) return
    hasFetchedRef.current = true
    fetchProducts()
  }, [mounted])

  useEffect(() => {
    let count = 0
    if (selectedCategory) count++
    if (priceRange.min || priceRange.max) count++
    if (sortBy !== '-createdAt') count++
    setActiveFiltersCount(count)
  }, [selectedCategory, priceRange, sortBy])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false)
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        searchInputRef.current?.blur()
        setIsSearchFocused(false)
        setShowHistory(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const fetchProducts = async () => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (priceRange.min) params.append('minPrice', priceRange.min)
      if (priceRange.max) params.append('maxPrice', priceRange.max)
      if (searchQuery) params.append('search', searchQuery)
      if (sortBy) params.append('sort', sortBy)
      params.append('page', currentPage.toString())
      params.append('limit', '12')
      const response = await fetch(`http://localhost:5000/api/v1/products?${params.toString()}`)
      if (response.status === 429) { setError('Server is busy.'); return }
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      let productsData = data.data?.products || data.products || (Array.isArray(data.data) ? data.data : []) || (Array.isArray(data) ? data : [])
      setProducts(productsData)
      setTotalPages(data.pagination?.pages || data.totalPages || Math.ceil(productsData.length / 12) || 1)
      setTotalProducts(data.pagination?.total || data.total || productsData.length || 0)
      setViewMode(selectedCategory ? 'all' : 'categories')
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    if (searchQuery.trim()) addToSearchHistory(searchQuery.trim())
    setShowHistory(false)
    setIsSearchFocused(false)
    hasFetchedRef.current = false
    setCurrentPage(1)
    setViewMode('all')
    setTimeout(() => { fetchProducts(); hasFetchedRef.current = true }, 100)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    hasFetchedRef.current = false
    setCurrentPage(1)
    setViewMode('categories')
    setTimeout(() => { fetchProducts(); hasFetchedRef.current = true }, 100)
    searchInputRef.current?.focus()
  }

  const handleClearFilters = () => {
    setSelectedCategory('')
    setPriceRange({ min: '', max: '' })
    setSortBy('-createdAt')
    setSearchQuery('')
    setCurrentPage(1)
    setViewMode('categories')
    hasFetchedRef.current = false
    setTimeout(() => { fetchProducts(); hasFetchedRef.current = true }, 100)
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
    setViewMode('all')
    hasFetchedRef.current = false
    setTimeout(() => { fetchProducts(); hasFetchedRef.current = true }, 100)
  }

  const handleViewAllCategory = (categoryId) => handleCategorySelect(categoryId)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    hasFetchedRef.current = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => { fetchProducts(); hasFetchedRef.current = true }, 100)
  }

  const handleApplyFilters = () => {
    setCurrentPage(1)
    hasFetchedRef.current = false
    setTimeout(() => { fetchProducts(); hasFetchedRef.current = true }, 100)
  }

  const sortOptions = [
    { value: '-createdAt', label: 'Newest' }, { value: 'createdAt', label: 'Oldest' },
    { value: 'price', label: 'Price: Low-High' }, { value: '-price', label: 'Price: High-Low' },
    { value: 'name', label: 'Name: A-Z' }, { value: '-name', label: 'Name: Z-A' },
    { value: '-rating', label: 'Top Rated' }
  ]

  const popularSearches = ['Wireless Earbuds', 'Running Shoes', 'Smart Watch', 'Laptop', 'Phone Case', 'Backpack']

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 border-b border-gray-50">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {totalProducts > 0 ? `${totalProducts.toLocaleString()} items available` : 'Discover our collection'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1">
                <button onClick={() => { setSelectedCategory(''); setViewMode('categories'); handleClearFilters(); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'categories' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Categories</button>
                <button onClick={() => setViewMode('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>All Products</button>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                {sortOptions.slice(0, 3).map((opt) => (
                  <button key={opt.value} onClick={() => setSortBy(opt.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${sortBy === opt.value ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>{opt.label}</button>
                ))}
              </div>
              <button onClick={() => setMobileFilterOpen(!mobileFilterOpen)} className="lg:hidden relative p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                {activeFiltersCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-violet-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">{activeFiltersCount}</span>}
              </button>
            </div>
          </div>

          <div className="py-4" ref={searchContainerRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className={`relative flex items-center bg-gray-50 rounded-2xl transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-violet-500 ring-offset-2 bg-white shadow-lg' : 'hover:bg-gray-100 hover:shadow-md'}`}>
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className={`w-5 h-5 transition-all duration-300 ${isSearchFocused ? 'text-violet-600 scale-110' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value.length === 0) setShowHistory(true); else setShowHistory(false); }} onFocus={() => { setIsSearchFocused(true); if (!searchQuery) setShowHistory(true); }} onBlur={() => setTimeout(() => { setIsSearchFocused(false); setShowHistory(false); }, 200)} placeholder="Search products, brands, or categories..." className="w-full pl-14 pr-28 py-4 bg-transparent text-gray-900 placeholder-gray-400 text-sm focus:outline-none" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {searchQuery && <button type="button" onClick={handleClearSearch} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>}
                    <button type="submit" className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${searchQuery.trim() ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg' : 'bg-gray-200 text-gray-500'}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg><span className="hidden sm:inline">Search</span></button>
                  </div>
                </div>
                {(showHistory || isSearchFocused) && !searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {searchHistory.length > 0 && (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3"><h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Searches</h3><button type="button" onClick={clearSearchHistory} className="text-xs text-red-400 hover:text-red-600 font-medium">Clear all</button></div>
                        <div className="space-y-1">
                          {searchHistory.map((item, index) => (
                            <div key={index} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => { setSearchQuery(item); setShowHistory(false); handleSearch(); }}>
                              <svg className="w-4 h-4 text-gray-400 group-hover:text-violet-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span className="flex-1 text-left truncate">{item}</span>
                              <span onClick={(e) => { e.stopPropagation(); e.preventDefault(); removeFromSearchHistory(index); }} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 cursor-pointer"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className={`p-4 ${searchHistory.length > 0 ? 'border-t border-gray-50' : ''}`}>
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Searches</h3>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button key={term} type="button" onClick={() => { setSearchQuery(term); setShowHistory(false); handleSearch(); }} className="px-4 py-2 bg-gray-50 hover:bg-violet-50 hover:text-violet-700 text-gray-600 rounded-xl text-sm transition-all">{term}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {selectedCategory && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-medium">{categories.find(c => (c._id || c.id) === selectedCategory)?.name || 'Category'}<span onClick={() => { setSelectedCategory(''); setViewMode('categories'); }} className="hover:text-red-500 cursor-pointer"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></span></span>}
                    {(priceRange.min || priceRange.max) && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-medium">Price: {priceRange.min || '0'} - {priceRange.max || '∞'}<span onClick={() => setPriceRange({ min: '', max: '' })} className="hover:text-red-500 cursor-pointer"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></span></span>}
                    <button onClick={handleClearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium ml-2">Clear all</button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-48 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6"><h3 className="font-semibold text-gray-900">Categories</h3>{selectedCategory && <button onClick={() => { setSelectedCategory(''); setViewMode('categories'); }} className="text-xs font-medium text-red-500 hover:text-red-600">Clear</button>}</div>
                <div className="mb-6">
                  {categoriesLoading ? <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />)}</div> :
                    <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                      <button onClick={() => { setSelectedCategory(''); setViewMode('categories'); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>All Categories</button>
                      {Array.isArray(categories) && categories.map((cat) => (
                        <button key={cat._id || cat.id} onClick={() => handleCategorySelect(cat._id || cat.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === (cat._id || cat.id) ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>{cat.name || 'Uncategorized'}</button>
                      ))}
                    </div>
                  }
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Price Range (PKR)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} placeholder="Min ₨" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                    <span className="text-gray-400 text-sm">-</span>
                    <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} placeholder="Max ₨" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sort By</label>
                  <div className="space-y-1">{sortOptions.map((opt) => (
                    <button key={opt.value} onClick={() => setSortBy(opt.value)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === opt.value ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>{opt.label}</button>
                  ))}</div>
                </div>
                <button onClick={handleApplyFilters} className="w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors">Apply Filters</button>
              </div>
            </div>
          </div>

          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto p-6 animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-between mb-6"><h3 className="font-semibold text-lg text-gray-900">Filters</h3><button onClick={() => setMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl"><svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                <div className="space-y-6">
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</label><div className="space-y-1 max-h-40 overflow-y-auto"><button onClick={() => { setSelectedCategory(''); setViewMode('categories'); }} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${!selectedCategory ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-600'}`}>All Categories</button>{Array.isArray(categories) && categories.map((cat) => (<button key={cat._id || cat.id} onClick={() => handleCategorySelect(cat._id || cat.id)} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${selectedCategory === (cat._id || cat.id) ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-600'}`}>{cat.name || 'Uncategorized'}</button>))}</div></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Price Range (PKR)</label><div className="flex items-center gap-2"><input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} placeholder="Min" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400" /><span className="text-gray-400">-</span><input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} placeholder="Max" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400" /></div></div>
                  <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sort By</label><div className="space-y-1">{sortOptions.map((opt) => (<button key={opt.value} onClick={() => setSortBy(opt.value)} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm ${sortBy === opt.value ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-600'}`}>{opt.label}</button>))}</div></div>
                  <div className="flex gap-3 pt-4"><button onClick={handleClearFilters} className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-sm text-gray-700 hover:bg-gray-50">Clear</button><button onClick={() => { handleApplyFilters(); setMobileFilterOpen(false); }} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800">Apply Filters</button></div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-12">
                {[...Array(3)].map((_, sectionIdx) => (
                  <div key={sectionIdx}>
                    <div className="flex items-center justify-between mb-6"><div className="h-7 bg-gray-200 rounded w-40 animate-pulse" /><div className="h-5 bg-gray-200 rounded w-20 animate-pulse" /></div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">{[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}</div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20"><div className="text-6xl mb-4">😕</div><h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3><p className="text-gray-500 mb-6">{error}</p><button onClick={() => { hasFetchedRef.current = false; fetchProducts(); hasFetchedRef.current = true }} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800">Try Again</button></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20"><div className="text-6xl mb-4">🔍</div><h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3><p className="text-gray-500 mb-6">Try adjusting your filters</p><button onClick={handleClearFilters} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800">Clear Filters</button></div>
            ) : (
              <>
                {viewMode === 'categories' && productsByCategory ? (
                  <>
                    {Object.entries(productsByCategory).map(([key, categoryData]) => (
                      <CategorySection key={key} categoryName={categoryData.categoryName} categoryId={categoryData.categoryId} products={categoryData.products.slice(0, 8)} onWishlistUpdate={() => {}} onViewAll={handleViewAllCategory} />
                    ))}
                    {totalPages > 1 && (
                      <div className="mt-12 flex items-center justify-center gap-2">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 disabled:opacity-30 hover:bg-gray-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
                        {[...Array(totalPages)].map((_, i) => { const page = i + 1; if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) return <button key={page} onClick={() => handlePageChange(page)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium ${currentPage === page ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{page}</button>; if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="px-1 text-gray-400">•••</span>; return null })}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 disabled:opacity-30 hover:bg-gray-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-6 flex items-center justify-between">
                      <p className="text-sm text-gray-500">Showing <span className="font-medium text-gray-900">{products.length}</span> of <span className="font-medium text-gray-900">{totalProducts}</span> products{selectedCategory && <span className="ml-2 text-violet-600">in {categories.find(c => (c._id || c.id) === selectedCategory)?.name || 'Category'}</span>}</p>
                      {activeFiltersCount > 0 && <button onClick={handleClearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium">Clear filters ({activeFiltersCount})</button>}
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {products.map((product, index) => (
                        <div key={product._id} className="animate-fadeInUp" style={{ animationDelay: `${index * 50}ms` }}><ProductCard product={product} onWishlistUpdate={() => {}} /></div>
                      ))}
                    </div>
                    {totalPages > 1 && (
                      <div className="mt-12 flex items-center justify-center gap-2">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 disabled:opacity-30 hover:bg-gray-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
                        {[...Array(totalPages)].map((_, i) => { const page = i + 1; if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) return <button key={page} onClick={() => handlePageChange(page)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium ${currentPage === page ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{page}</button>; if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="px-1 text-gray-400">•••</span>; return null })}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 disabled:opacity-30 hover:bg-gray-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out forwards; opacity: 0; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }
      `}</style>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}