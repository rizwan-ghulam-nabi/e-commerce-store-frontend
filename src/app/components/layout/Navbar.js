'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedSearchCategory, setSelectedSearchCategory] = useState("all");
  const [selectedCategoryName, setSelectedCategoryName] = useState("All");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('deliveryLocation');
      return saved || "Pakistan";
    }
    return "Pakistan";
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "Faisalabad",
    area: "",
    landmark: "",
    isDefault: true
  });

  const categoriesRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchRef = useRef(null);
  const locationRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const popularCities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Gujranwala", "Sialkot"];

  // Fetch categories directly from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch(`${API_BASE}/categories`, {
          credentials: "include",
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Categories API response:", data);
          
          // Extract categories from different possible response structures
          let categoriesList = [];
          if (data.data?.categories && Array.isArray(data.data.categories)) {
            categoriesList = data.data.categories;
          } else if (data.categories && Array.isArray(data.categories)) {
            categoriesList = data.categories;
          } else if (Array.isArray(data)) {
            categoriesList = data;
          } else if (data.data && Array.isArray(data.data)) {
            categoriesList = data.data;
          }
          
          console.log("Extracted categories:", categoriesList);
          setCategories(categoriesList);
        } else {
          console.error("Failed to fetch categories:", response.status);
          // Set some default categories for testing
          setCategories([
            { _id: "electronics", name: "Electronics", productCount: 0 },
            { _id: "fashion", name: "Fashion", productCount: 0 },
            { _id: "home", name: "Home & Kitchen", productCount: 0 },
            { _id: "books", name: "Books", productCount: 0 },
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Set default categories for testing
        setCategories([
          { _id: "electronics", name: "Electronics", productCount: 0 },
          { _id: "fashion", name: "Fashion", productCount: 0 },
          { _id: "home", name: "Home & Kitchen", productCount: 0 },
          { _id: "books", name: "Books", productCount: 0 },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    setMounted(true);
    const savedAddress = localStorage.getItem('userDeliveryAddress');
    if (savedAddress) {
      try {
        const address = JSON.parse(savedAddress);
        setDeliveryLocation(`${address.city}, ${address.area || ''}`);
      } catch (e) {}
    }
  }, []);

  const saveDeliveryLocation = (location) => {
    setDeliveryLocation(location);
    localStorage.setItem('deliveryLocation', location);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('deliveryLocationUpdated', { detail: { location } }));
    }
    setShowLocationDropdown(false);
  };

  const saveFullAddress = (addressData) => {
    const fullAddress = `${addressData.address}, ${addressData.area}, ${addressData.city}`;
    setDeliveryLocation(fullAddress);
    localStorage.setItem('deliveryLocation', fullAddress);
    localStorage.setItem('userDeliveryAddress', JSON.stringify(addressData));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('deliveryLocationUpdated', { detail: { location: fullAddress, addressData } }));
    }
    setShowAddressModal(false);
    setAddressForm({
      fullName: "", phone: "", address: "", city: "Faisalabad", area: "", landmark: "", isDefault: true
    });
  };

  const fetchCartAndWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuth || !token) return;

    try {
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
      const [cartRes, wishlistRes] = await Promise.allSettled([
        fetch(`${API_BASE}/cart`, { credentials: "include", headers }),
        fetch(`${API_BASE}/wishlist`, { credentials: "include", headers }),
      ]);

      if (cartRes.status === "fulfilled" && cartRes.value.ok) {
        const cartData = await cartRes.value.json();
        const cartItems = cartData.data?.cart?.items || cartData.data?.items || [];
        const total = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
        setCartCount(total);
      }

      if (wishlistRes.status === "fulfilled" && wishlistRes.value.ok) {
        const wishlistData = await wishlistRes.value.json();
        let items = wishlistData.data?.wishlist?.products || wishlistData.data?.wishlist || wishlistData.data || [];
        if (items && !Array.isArray(items) && items.products) items = items.products;
        if (Array.isArray(items)) setWishlistCount(items.length);
      }
    } catch (error) {
      console.error("Error fetching cart/wishlist:", error);
    }
  }, []);

  const fetchSearchSuggestions = async (query) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      let url = `${API_BASE}/products?search=${encodeURIComponent(query)}&limit=5`;
      if (selectedSearchCategory !== "all") {
        url += `&category=${selectedSearchCategory}`;
      }
      const response = await fetch(url, { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        const products = data.data?.products || data.products || [];
        setSearchSuggestions(Array.isArray(products) ? products.slice(0, 5) : []);
        setShowSuggestions(products.length > 0);
      }
    } catch (error) {}
  };

  const searchTimeoutRef = useRef(null);
  const handleSearchInput = (value) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (value.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => fetchSearchSuggestions(value), 300);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 80) {
        setShowCategories(false);
        setShowSuggestions(false);
        setShowLocationDropdown(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const checkAuth = () => {
      const isAuth = localStorage.getItem("isAuthenticated") === "true";
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("userData");
      setIsAuthenticated(isAuth && !!token);
      if (isAuth && token && userData) {
        try { setUser(JSON.parse(userData)); } catch (e) {}
        fetchCartAndWishlist();
      }
    };
    checkAuth();
    
    const handleCartUpdate = () => fetchCartAndWishlist();
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("wishlistUpdated", handleCartUpdate);
    window.addEventListener("storage", (e) => {
      if (e.key === "isAuthenticated" || e.key === "userData") checkAuth();
    });
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("wishlistUpdated", handleCartUpdate);
    };
  }, [mounted, fetchCartAndWishlist]);

  useEffect(() => {
    setIsOpen(false);
    setShowCategories(false);
    setShowSuggestions(false);
    setShowLocationDropdown(false);
  }, [pathname]);

  useEffect(() => {
    if (!mounted) return;
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) setShowCategories(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSuggestions(false);
      if (locationRef.current && !locationRef.current.contains(event.target)) setShowLocationDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mounted]);

  const handleSearch = (e) => {
    e.preventDefault();
    let url = `/products?search=${encodeURIComponent(searchQuery)}`;
    if (selectedSearchCategory !== "all") {
      url += `&category=${selectedSearchCategory}`;
    }
    router.push(url);
    setSearchQuery("");
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  };

  const handleSearchCategoryChange = (categoryId, categoryName) => {
    console.log("Changing category to:", { categoryId, categoryName });
    setSelectedSearchCategory(categoryId);
    setSelectedCategoryName(categoryName);
    setShowCategories(false);
    // Refetch suggestions with new category
    if (searchQuery.length >= 2) {
      fetchSearchSuggestions(searchQuery);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
    } catch (error) {}
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    setCartCount(0);
    setWishlistCount(0);
    router.push("/");
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split("@")[0];
    return "Account";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (name === "Account") return "A";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  // Debug: Log current state
  useEffect(() => {
    console.log("Current state:", {
      selectedSearchCategory,
      selectedCategoryName,
      categoriesCount: categories.length,
      categories: categories
    });
  }, [selectedSearchCategory, selectedCategoryName, categories]);

  if (!mounted) {
    return <div className="h-20 bg-[#131921]" />;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#131921] text-white shadow-lg">
        {/* Top Bar */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] gap-4">
            
            {/* LEFT - Logo & Delivery */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#FFD814] to-[#FFA41C] rounded flex items-center justify-center shadow-md">
                    <span className="text-[#131921] font-bold text-lg">S</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight hidden sm:block">
                    Swift<span className="text-[#FFD814]">Cart</span>
                  </span>
                </div>
              </Link>

              {/* Delivery Location */}
              <div className="relative" ref={locationRef}>
                <button
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="flex items-center px-2 py-1 rounded hover:border hover:border-white/20 cursor-pointer transition-colors"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Deliver to</div>
                    <div className="text-sm font-bold truncate max-w-[120px]">{deliveryLocation}</div>
                  </div>
                  <svg className="w-3 h-3 ml-1 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showLocationDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Choose your location</h3>
                      <p className="text-xs text-gray-500 mt-1">Select a delivery location</p>
                    </div>
                    <button
                      onClick={() => { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(() => saveDeliveryLocation("Current Location")); } }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b"
                    >
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">Use Current Location</div>
                        <div className="text-xs text-gray-500">Detect your location</div>
                      </div>
                    </button>
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 px-3 py-2">POPULAR CITIES</div>
                      {popularCities.map((city) => (
                        <button key={city} onClick={() => saveDeliveryLocation(city)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          {city}
                        </button>
                      ))}
                    </div>
                    <div className="border-t p-3">
                      <button onClick={() => setShowAddressModal(true)} className="w-full text-center text-sm text-[#007185] hover:text-[#C45500] py-2 font-medium">
                        + Add your full address
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CENTER - Search Bar */}
            <div ref={searchRef} className="flex-1 relative">
              <form onSubmit={handleSearch} className="flex w-full group">
                <div className="relative flex-1 flex group-hover:shadow-lg transition-all duration-300 rounded-md">
                  {/* Categories Dropdown for Search */}
                  <div className="relative" ref={categoriesRef}>
                    <button
                      type="button"
                      onClick={() => setShowCategories(!showCategories)}
                      className="h-12 px-4 bg-[#f3f3f3] text-gray-700 text-sm rounded-l-md border-r border-gray-300 focus:outline-none cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-1 whitespace-nowrap min-w-[100px]"
                    >
                      {selectedCategoryName}
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showCategories && (
                      <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-b-md shadow-xl border z-50 max-h-80 overflow-y-auto">
                        <button
                          onClick={() => handleSearchCategoryChange("all", "All")}
                          className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors border-b ${selectedSearchCategory === "all" ? "bg-gray-100 text-[#FFA41C] font-medium" : "text-gray-700"}`}
                        >
                          All Categories
                        </button>
                        {loadingCategories ? (
                          <div className="p-4 text-center text-gray-500">
                            <svg className="animate-spin h-5 w-5 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading...
                          </div>
                        ) : categories.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">No categories found</div>
                        ) : (
                          categories.map((cat) => {
                            // Get the category ID and name safely
                            const catId = cat._id || cat.id;
                            const catName = cat.name || cat.title || "Unnamed";
                            
                            console.log("Rendering category:", { catId, catName, raw: cat });
                            
                            return (
                              <button
                                key={catId}
                                onClick={() => handleSearchCategoryChange(catId, catName)}
                                className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors border-b ${selectedSearchCategory === catId ? "bg-gray-100 text-[#FFA41C] font-medium" : "text-gray-700"}`}
                              >
                                {catName}
                                {cat.productCount > 0 && (
                                  <span className="float-right text-xs text-gray-400">({cat.productCount})</span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Search products..."
                    className="flex-1 h-12 px-5 text-gray-900 placeholder-gray-500 focus:outline-none text-base bg-white"
                  />
                  <button
                    type="submit"
                    className="px-8 h-12 bg-[#FFD814] hover:bg-[#F7CA00] text-[#131921] rounded-r-md transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="hidden lg:inline text-sm font-medium">Search</span>
                  </button>
                </div>
              </form>
              
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-b-lg shadow-xl border z-50 max-h-[400px] overflow-y-auto">
                  {searchSuggestions.map((item, idx) => (
                    <Link key={item._id} href={`/products/${item._id}`} className={`flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors ${idx !== searchSuggestions.length - 1 ? 'border-b border-gray-100' : ''}`} onClick={() => { setShowSuggestions(false); setSearchQuery(""); }}>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                          {item.images?.[0]?.url ? (
                            <img src={item.images[0].url} alt={item.name} className="w-8 h-8 object-contain" />
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.category?.name || "Product"}</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-[#B12704]">₨ {(item.price * 280).toLocaleString()}</div>
                    </Link>
                  ))}
                  <div className="p-2 border-t border-gray-100 bg-gray-50">
                    <button onClick={() => { handleSearch(new Event('submit')); }} className="w-full text-center text-sm text-[#007185] hover:text-[#C45500] py-2">
                      See all results for "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT - Account and Cart */}
            <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
              <div className="hidden lg:flex items-center gap-1 px-3 py-2 rounded hover:border hover:border-white/20 cursor-pointer transition-colors">
                <span className="text-sm font-bold">🇵🇰</span>
                <span className="text-xs">EN</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {!isAuthenticated ? (
                <Link href="/signin" className="flex flex-col px-2 py-1 rounded hover:border hover:border-white/20 transition-colors">
                  <span className="text-xs text-gray-300">Hello, Sign in</span>
                  <span className="text-sm font-bold">Account & Lists</span>
                </Link>
              ) : (
                <div className="relative group">
                  <button className="flex flex-col px-2 py-1 rounded hover:border hover:border-white/20 transition-colors">
                    <span className="text-xs text-gray-300">Hello, {getUserDisplayName().split(" ")[0]}</span>
                    <span className="text-sm font-bold">Account & Lists</span>
                  </button>
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-md shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="p-5 border-b">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FFD814] to-[#FFA41C] rounded-full flex items-center justify-center text-[#131921] font-bold text-lg">{getUserInitials()}</div>
                        <div><p className="font-semibold text-gray-900">{getUserDisplayName()}</p><p className="text-sm text-gray-500">{user?.email}</p></div>
                      </div>
                      <Link href="/profile" className="block w-full bg-[#FFD814] text-[#131921] text-center py-2.5 rounded-md font-semibold hover:bg-[#F7CA00]">Your Account</Link>
                    </div>
                    <div className="p-3">
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"><svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>Your Orders</Link>
                      <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"><svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>Your Wishlist <span className="ml-auto text-[#B12704]">({wishlistCount})</span></Link>
                      <div className="border-t my-2"></div>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg"><svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>Sign Out</button>
                    </div>
                  </div>
                </div>
              )}

              <Link href="/orders" className="hidden lg:flex flex-col px-2 py-1 rounded hover:border hover:border-white/20 transition-colors">
                <span className="text-xs text-gray-300">Returns</span>
                <span className="text-sm font-bold">& Orders</span>
              </Link>

              <Link href="/cart" className="flex items-center gap-2 px-2 py-1 rounded hover:border hover:border-white/20 transition-colors relative">
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FFD814] text-[#131921] text-xs font-bold rounded-full px-1.5 min-w-[20px] text-center">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold hidden lg:inline">Cart</span>
              </Link>

              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Bar */}
        <div className="bg-[#232F3E] border-t border-white/10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 h-10 text-sm overflow-x-auto scrollbar-hide">
              <Link href="/products" className="whitespace-nowrap hover:text-gray-300 transition-colors">Today's Deals</Link>
              <Link href="/products?sort=-soldCount" className="whitespace-nowrap hover:text-gray-300 transition-colors">Best Sellers</Link>
              <Link href="/products?sort=-createdAt" className="whitespace-nowrap hover:text-gray-300 transition-colors">New Releases</Link>
              <Link href="/support" className="whitespace-nowrap hover:text-gray-300 transition-colors">Customer Service</Link>
              <Link href="/gift-cards" className="whitespace-nowrap hover:text-gray-300 transition-colors">Gift Cards</Link>
              <Link href="/products?category=electronics" className="whitespace-nowrap hover:text-gray-300 transition-colors">Electronics</Link>
              <Link href="/products?category=fashion" className="whitespace-nowrap hover:text-gray-300 transition-colors">Fashion</Link>
              <Link href="/products?category=home" className="whitespace-nowrap hover:text-gray-300 transition-colors">Home & Kitchen</Link>
              <Link href="/products?category=books" className="whitespace-nowrap hover:text-gray-300 transition-colors">Books</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowAddressModal(false)} />
          <div className="relative bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Add Delivery Address</h2>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={addressForm.fullName} onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD814]" placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="03XXXXXXXXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  {popularCities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area / Sector</label>
                <input type="text" value={addressForm.area} onChange={(e) => setAddressForm({...addressForm, area: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g., DHA Phase 2, Gulberg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                <textarea value={addressForm.address} onChange={(e) => setAddressForm({...addressForm, address: e.target.value})} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="House/Flat No., Building Name, Street Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                <input type="text" value={addressForm.landmark} onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Near any landmark" />
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex gap-3">
              <button onClick={() => setShowAddressModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
              <button onClick={() => saveFullAddress(addressForm)} className="flex-1 px-4 py-2 bg-[#FFD814] text-[#131921] rounded-lg font-semibold hover:bg-[#F7CA00]">Save Address</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 left-0 w-80 h-full bg-white z-50 shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-[#131921] text-white p-5 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FFD814] to-[#FFA41C] rounded flex items-center justify-center">
                    <span className="text-[#131921] font-bold">S</span>
                  </div>
                  <span className="font-bold text-lg">SwiftCart</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {!isAuthenticated && (
                <Link href="/signin" className="flex items-center justify-between mt-5 p-4 bg-[#FFD814] text-[#131921] rounded-lg font-semibold">
                  Sign in <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </Link>
              )}
              {isAuthenticated && user && (
                <div className="mt-5 p-4 bg-white/10 rounded-lg">
                  <p className="font-semibold">Hello, {getUserDisplayName()}</p>
                  <p className="text-sm text-gray-300 truncate">{user.email}</p>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="font-semibold text-gray-600 text-xs uppercase tracking-wider mb-3">Shop by Category</div>
              {loadingCategories ? (
                <div className="py-6 text-center text-gray-500">Loading...</div>
              ) : categories.length === 0 ? (
                <div className="py-6 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <p className="text-sm">No categories available</p>
                </div>
              ) : (
                categories.map((cat) => {
                  const catId = cat._id || cat.id;
                  const catName = cat.name || cat.title || "Unnamed";
                  return (
                    <button key={catId} onClick={() => { router.push(`/products?category=${catId}`); setIsOpen(false); }} className="block w-full text-left py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      {catName}
                    </button>
                  );
                })
              )}
              <div className="border-t my-4"></div>
              <Link href="/products" className="block py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>All Products</Link>
              <Link href="/products?sort=-discount" className="block py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Today's Deals</Link>
              <Link href="/products?sort=-soldCount" className="block py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Best Sellers</Link>
              <Link href="/wishlist" className="block py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Wishlist ({wishlistCount})</Link>
              <Link href="/cart" className="block py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Cart ({cartCount})</Link>
              {isAuthenticated && (
                <>
                  <div className="border-t my-4"></div>
                  <Link href="/orders" className="block py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Your Orders</Link>
                  <Link href="/profile" className="block py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Profile</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg">Sign Out</button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <div className="h-[90px]" />
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}