'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

export default function WishlistPage() {
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)
  const [addingToCart, setAddingToCart] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('isAuthenticated') === 'true'
      const token = localStorage.getItem('token')
      setIsAuthenticated(isAuth && !!token)
      setAuthChecked(true)
      
      if (!isAuth || !token) {
        router.push('/signin?redirect=/wishlist')
        return
      }
      
      fetchWishlist()
    }
    
    checkAuth()
    
    const handleWishlistUpdate = () => fetchWishlist()
    window.addEventListener('wishlistUpdated', handleWishlistUpdate)
    window.addEventListener('focus', fetchWishlist)
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate)
      window.removeEventListener('focus', fetchWishlist)
    }
  }, [])

  const fetchWishlist = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await apiFetch('http://localhost:5000/api/v1/wishlist')

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        router.push('/signin?redirect=/wishlist')
        return
      }

      if (!response.ok) throw new Error('Failed to fetch wishlist')

      const data = await response.json()
      
      // Extract products from response: data.data.wishlist.products
      let items = []
      if (data.data?.wishlist?.products) {
        items = data.data.wishlist.products
      } else if (data.data?.wishlist) {
        items = data.data.wishlist
      } else if (data.wishlist?.products) {
        items = data.wishlist.products
      } else if (Array.isArray(data.data)) {
        items = data.data
      } else if (Array.isArray(data)) {
        items = data
      }
      
      // Handle mongoose populated objects
      const validItems = Array.isArray(items) ? items.map(item => {
        if (item._id && item.name && item.price) {
          return { product: item }
        }
        if (item.product && typeof item.product === 'object') {
          return item
        }
        return null
      }).filter(Boolean) : []
      
      setWishlistItems(validItems)
      window.dispatchEvent(new Event('wishlistUpdated'))
      
    } catch (err) {
      console.error('Error fetching wishlist:', err)
      setError(err.message || 'Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId) => {
    setRemovingId(productId)
    try {
      const response = await apiFetch(`http://localhost:5000/api/v1/wishlist/${productId}`, {
        method: 'DELETE',
      })

      if (response.status === 401) {
        router.push('/signin?redirect=/wishlist')
        return
      }
      if (!response.ok) throw new Error('Failed to remove')

      setWishlistItems(prev => prev.filter(item => {
        const id = item.product?._id || item._id
        return id !== productId
      }))
      window.dispatchEvent(new Event('wishlistUpdated'))
      showToast('Removed from wishlist', 'success')
    } catch (err) {
      showToast('Failed to remove item', 'error')
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = async (productId) => {
    setAddingToCart(productId)
    try {
      const response = await apiFetch('http://localhost:5000/api/v1/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (response.status === 401) {
        router.push('/signin?redirect=/wishlist')
        return
      }
      if (!response.ok) throw new Error('Failed to add to cart')

      showToast('Added to cart!', 'success')
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (err) {
      showToast('Failed to add to cart', 'error')
    } finally {
      setAddingToCart(null)
    }
  }

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div')
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 animate-slideUp ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
  }

  const clearWishlist = async () => {
    if (!confirm('Remove all items?')) return
    setLoading(true)
    try {
      await apiFetch('http://localhost:5000/api/v1/wishlist', { method: 'DELETE' })
      setWishlistItems([])
      window.dispatchEvent(new Event('wishlistUpdated'))
      showToast('Wishlist cleared!', 'success')
    } catch (err) {
      showToast('Failed to clear wishlist', 'error')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency', currency: 'PKR', minimumFractionDigits: 0
    }).format((price || 0) * 280)
  }

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={fetchWishlist} className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700">Try Again</button>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="text-8xl mb-6">🤍</div>
          <h3 className="text-3xl font-bold text-gray-800 mb-3">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-8">Save your favorite items and they&apos;ll appear here</p>
          <Link href="/products" className="px-8 py-4 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-all">Browse Products</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved</p>
          </div>
          <div className="flex gap-3">
            <Link href="/products" className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:shadow-lg transition-all">Continue Shopping</Link>
            <button onClick={clearWishlist} className="px-6 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium hover:bg-red-100 transition-all">Clear All</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item, index) => {
            const product = item.product || item
            const productId = product._id || item._id
            const productName = product.name || 'Untitled Product'
            const productPrice = product.price || 0
            const comparePrice = product.comparePrice || null
            const discountPercentage = comparePrice && comparePrice > productPrice ? Math.round((1 - productPrice / comparePrice) * 100) : 0
            const imageUrl = product.images?.[0]?.url || product.image || '/placeholder.png'
            const inStock = (product.stock || 0) > 0
            const rating = product.rating || product.averageRating || 0

            return (
              <div key={productId || index} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <Link href={`/products/${productId}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                  <img src={imageUrl} alt={productName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.target.src = '/placeholder.png' }} />
                  {discountPercentage > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full">-{discountPercentage}%</span>
                    </div>
                  )}
                  {!inStock && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1.5 bg-red-500/90 text-white text-xs font-semibold rounded-full">Out of Stock</span>
                    </div>
                  )}
                </Link>

                <button onClick={() => removeFromWishlist(productId)} disabled={removingId === productId} className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all">
                  {removingId === productId ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  )}
                </button>

                <div className="p-5">
                  {product.brand && <p className="text-xs font-medium text-violet-600 mb-1">{product.brand}</p>}
                  <Link href={`/products/${productId}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-violet-600 transition-colors">{productName}</h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({rating.toFixed(1)})</span>
                  </div>
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(productPrice)}</span>
                      {comparePrice && comparePrice > productPrice && (
                        <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(comparePrice)}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleAddToCart(productId)} disabled={!inStock || addingToCart === productId}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${inStock ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    {addingToCart === productId ? 'Adding...' : inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}