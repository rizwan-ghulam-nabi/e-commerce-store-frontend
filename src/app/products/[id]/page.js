'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const apiFetch = (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  return fetch(url, { ...options, credentials: 'include', headers });
};

const RECENTLY_VIEWED_KEY = 'recentlyViewed';

const getRecentlyViewed = () => {
  try { return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]'); }
  catch { return []; }
};

const addToRecentlyViewed = (product) => {
  const recent = getRecentlyViewed();
  const filtered = recent.filter(item => item._id !== product._id);
  const updated = [{ 
    _id: product._id, 
    name: product.name, 
    price: product.price, 
    image: product.images?.[0]?.url || product.image,
    rating: product.rating || product.averageRating || 0 
  }, ...filtered].slice(0, 8);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
};

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState([])

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

  useEffect(() => {
    if (params.id) fetchProduct()
    setRecentlyViewed(getRecentlyViewed())
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/products/${params.id}`)
      if (!response.ok) throw new Error('Product not found')
      const data = await response.json()
      const productData = data.data?.product || data.product || data.data || data
      setProduct(productData)
      if (productData) addToRecentlyViewed(productData)
      setRecentlyViewed(getRecentlyViewed())
    } catch (err) {
      setError(err.message || 'Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token')
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    if (!isAuth || !token) {
      router.push('/signin?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }
    setAddingToCart(true)
    try {
      const response = await apiFetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        body: JSON.stringify({ productId: product._id, quantity }),
      })
      if (response.ok) {
        setAddedToCart(true)
        window.dispatchEvent(new Event('cartUpdated'))
        setTimeout(() => setAddedToCart(false), 2000)
      }
    } catch (err) {
      console.error('Add to cart error:', err)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    router.push('/cart')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency', currency: 'PKR', minimumFractionDigits: 0
    }).format((price || 0) * 280)
  }

  // Get category info
  const getCategoryName = () => {
    if (!product) return null
    if (typeof product.category === 'object' && product.category) {
      return { name: product.category.name, id: product.category._id || product.category.id }
    }
    if (product.category && typeof product.category === 'string') {
      return { name: product.category, id: product.category }
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/products" className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors">Browse Products</Link>
        </div>
      </div>
    )
  }

  const category = getCategoryName()
  const productName = product.name || 'Untitled Product'
  const productPrice = product.price || 0
  const comparePrice = product.comparePrice || null
  const discountPercentage = comparePrice && comparePrice > productPrice ? Math.round((1 - productPrice / comparePrice) * 100) : 0
  const inStock = (product.stock || 0) > 0
  const rating = product.rating || product.averageRating || 0
  const images = product.images || []
  const mainImage = images[selectedImage]?.url || product.image || '/placeholder.png'

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb with Category */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap">
          <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          <Link href="/products" className="hover:text-violet-600 transition-colors">Products</Link>
          {category && (
            <>
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              <Link href={`/products?category=${category.id}`} className="hover:text-violet-600 transition-colors capitalize">{category.name}</Link>
            </>
          )}
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium truncate">{productName}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 mb-4">
              <img src={mainImage} alt={productName} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/placeholder.png' }} />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button key={index} onClick={() => setSelectedImage(index)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === index ? 'border-violet-600' : 'border-gray-200'}`}>
                    <img src={img.url} alt={`${productName} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.brand && <p className="text-sm font-medium text-violet-600 mb-2">{product.brand}</p>}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{productName}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">({rating.toFixed(1)})</span>
              {category && (
                <Link href={`/products?category=${category.id}`} className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-full font-medium hover:bg-violet-100 transition-colors capitalize">
                  {category.name}
                </Link>
              )}
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(productPrice)}</span>
              {comparePrice && comparePrice > productPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(comparePrice)}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">-{discountPercentage}%</span>
                </>
              )}
            </div>

            <div className="mb-6">
              {inStock ? (
                <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 text-sm font-medium">Out of Stock</span>
              )}
            </div>

            {inStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-xl">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-xl">−</button>
                  <span className="w-12 h-10 flex items-center justify-center font-semibold bg-gray-50">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-xl">+</button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleAddToCart} disabled={!inStock || addingToCart} className={`flex-1 py-3.5 rounded-xl font-semibold text-base transition-all ${addedToCart ? 'bg-green-500 text-white' : inStock ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/25' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                {addingToCart ? 'Adding...' : addedToCart ? '✓ Added to Cart!' : inStock ? `Add to Cart - ${formatPrice(productPrice * quantity)}` : 'Out of Stock'}
              </button>
              <button onClick={handleBuyNow} disabled={!inStock} className="px-8 py-3.5 bg-white border-2 border-violet-600 text-violet-600 rounded-xl font-semibold hover:bg-violet-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Buy Now</button>
            </div>

            {product.description && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
              {product.sku && <div><span className="text-gray-500">SKU:</span> <span className="text-gray-900 font-medium">{product.sku}</span></div>}
              {category && <div><span className="text-gray-500">Category:</span> <Link href={`/products?category=${category.id}`} className="text-violet-600 font-medium hover:underline capitalize">{category.name}</Link></div>}
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentlyViewed.map((item) => (
                <Link key={item._id} href={`/products/${item._id}`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">📦</div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-violet-600">{item.name}</h3>
                    <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(item.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}