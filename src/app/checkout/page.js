// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function CheckoutPage() {
//   const router = useRouter();
//   const [cartItems, setCartItems] = useState([]);
//   const [cartData, setCartData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   // ✅ Added state field
//   const [shipping, setShipping] = useState({
//     fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'Pakistan'
//   });

//   const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

//   const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

//   const apiFetch = (url, options = {}) => {
//     const token = localStorage.getItem('token');
//     const headers = {
//       'Content-Type': 'application/json',
//       ...(token && { 'Authorization': `Bearer ${token}` }),
//     };
//     return fetch(url, { ...options, credentials: 'include', headers });
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) { router.push('/signin?redirect=/checkout'); return; }
//     fetchCart();
//   }, []);

//   const fetchCart = async () => {
//     setLoading(true);
//     const res = await apiFetch(`${API_BASE}/cart`);
//     if (res.status === 401) { router.push('/signin?redirect=/checkout'); return; }
//     const responseData = await res.json();
//     const cart = responseData.data?.cart || responseData.cart || responseData;
//     const items = cart?.items || [];
//     if (items.length === 0) { router.push('/cart'); return; }
//     setCartData(cart);
//     setCartItems(items);
//     setLoading(false);
//   };

//   const handlePlaceOrder = async () => {
//     if (!shipping.fullName || !shipping.phone || !shipping.street || !shipping.city || !shipping.state) {
//       setError('Please fill in all required fields');
//       return;
//     }
//     setSubmitting(true);
//     setError('');
//     try {
//       const addrRes = await apiFetch(`${API_BASE}/addresses`, {
//         method: 'POST',
//         body: JSON.stringify(shipping),
//       });
//       if (!addrRes.ok) {
//         const errData = await addrRes.json();
//         throw new Error(errData.message || 'Failed to save address');
//       }
//       const addrData = await addrRes.json();
//       const addressId = addrData.data?.address?._id || addrData.data?._id;

//       const orderRes = await apiFetch(`${API_BASE}/orders`, {
//         method: 'POST',
//         body: JSON.stringify({
//           shippingAddressId: addressId,
//           billingAddressId: addressId,
//           paymentMethod,
//         }),
//       });
//       if (!orderRes.ok) throw new Error('Failed to create order');
//       const orderData = await orderRes.json();
//       window.dispatchEvent(new Event('cartUpdated'));
//       router.push(`/orders/${orderData.data?.order?._id || orderData.data?._id}?success=true`);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format((price || 0) * 280);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20 pb-12">
//       <div className="max-w-3xl mx-auto px-4 py-8">
//         <div className="flex items-center gap-3 mb-8">
//           <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-xl">
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
//           </Link>
//           <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">{error}</div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//           <div className="lg:col-span-3 space-y-6">
//             {/* Shipping */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border">
//               <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
//                     <input value={shipping.fullName} onChange={(e) => setShipping({...shipping, fullName: e.target.value})} placeholder="John Doe" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:ring-2 focus:ring-violet-500" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
//                     <input value={shipping.phone} onChange={(e) => setShipping({...shipping, phone: e.target.value})} placeholder="+92 300 1234567" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:ring-2 focus:ring-violet-500" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
//                   <input value={shipping.street} onChange={(e) => setShipping({...shipping, street: e.target.value})} placeholder="123 Main Street" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:ring-2 focus:ring-violet-500" />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
//                     <input value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} placeholder="Karachi" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:ring-2 focus:ring-violet-500" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
//                     <input value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} placeholder="Sindh" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:ring-2 focus:ring-violet-500" />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
//                     <input value={shipping.zipCode} onChange={(e) => setShipping({...shipping, zipCode: e.target.value})} placeholder="74000" className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:ring-2 focus:ring-violet-500" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                     <input value={shipping.country} onChange={(e) => setShipping({...shipping, country: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 focus:ring-2 focus:ring-violet-500" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Payment */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border">
//               <h2 className="text-lg font-bold mb-4">Payment Method</h2>
//               <label className="flex items-center gap-4 p-4 bg-violet-50 border-2 border-violet-600 rounded-2xl cursor-pointer">
//                 <input type="radio" checked={paymentMethod === 'cash_on_delivery'} onChange={() => setPaymentMethod('cash_on_delivery')} className="w-5 h-5 accent-violet-600" />
//                 <div>
//                   <p className="font-semibold text-gray-900">Cash on Delivery</p>
//                   <p className="text-sm text-gray-500">Pay when you receive your order</p>
//                 </div>
//                 <div className="ml-auto text-2xl">💵</div>
//               </label>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl p-6 shadow-sm border sticky top-28">
//               <h2 className="text-lg font-bold mb-4">Order Summary</h2>
//               <div className="space-y-3 mb-6">
//                 {cartItems.map((item) => (
//                   <div key={item._id} className="flex gap-3 py-3 border-b">
//                     <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
//                       {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-sm truncate">{item.name}</p>
//                       <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
//                       <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="border-t pt-4 space-y-2 text-sm">
//                 <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cartData?.totalPrice || 0)}</span></div>
//                 <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
//                 <div className="flex justify-between text-lg font-bold pt-3 border-t"><span>Total</span><span className="text-violet-600">{formatPrice(cartData?.totalPrice || 0)}</span></div>
//               </div>
//               <button onClick={handlePlaceOrder} disabled={submitting} className="w-full mt-6 py-3.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-50">
//                 {submitting ? 'Placing Order...' : `Place Order - ${formatPrice(cartData?.totalPrice || 0)}`}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// with Stripe

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StripeCheckout from '../components/StripeCheckout';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState(null);

  const [shipping, setShipping] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'Pakistan'
  });

  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  const apiFetch = (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
    return fetch(url, { ...options, credentials: 'include', headers });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/signin?redirect=/checkout'); return; }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    const res = await apiFetch(`${API_BASE}/cart`);
    const responseData = await res.json();
    const cart = responseData.data?.cart || responseData.cart || responseData;
    setCartData(cart);
    setCartItems(cart?.items || []);
    setLoading(false);
  };

  // ✅ Get Stripe payment intent
  const initStripePayment = async () => {
    try {
      const res = await apiFetch(`${API_BASE}/orders/create-payment-intent`, { method: 'POST' });
      const data = await res.json();
      if (data.clientSecret) setClientSecret(data.clientSecret);
      else setError('Payment initialization failed');
    } catch (err) {
      setError('Failed to initialize payment');
    }
  };

  const handlePlaceOrder = async () => {
    if (!shipping.fullName || !shipping.phone || !shipping.street || !shipping.city || !shipping.state) {
      setError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const addrRes = await apiFetch(`${API_BASE}/addresses`, { method: 'POST', body: JSON.stringify(shipping) });
      if (!addrRes.ok) throw new Error('Failed to save address');
      const addrData = await addrRes.json();
      const addressId = addrData.data?.address?._id || addrData.data?._id;

      const orderRes = await apiFetch(`${API_BASE}/orders`, {
        method: 'POST',
        body: JSON.stringify({ shippingAddressId: addressId, billingAddressId: addressId, paymentMethod }),
      });
      if (!orderRes.ok) throw new Error('Failed to create order');
      const orderData = await orderRes.json();
      window.dispatchEvent(new Event('cartUpdated'));
      router.push(`/orders/${orderData.data?.order?._id || orderData.data?._id}?success=true`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format((price || 0) * 280);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Full Name *</label><input value={shipping.fullName} onChange={(e) => setShipping({...shipping, fullName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900" /></div>
                  <div><label className="block text-sm font-medium mb-1">Phone *</label><input value={shipping.phone} onChange={(e) => setShipping({...shipping, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Street *</label><input value={shipping.street} onChange={(e) => setShipping({...shipping, street: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">City *</label><input value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900" /></div>
                  <div><label className="block text-sm font-medium mb-1">State *</label><input value={shipping.state} onChange={(e) => setShipping({...shipping, state: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">ZIP Code</label><input value={shipping.zipCode} onChange={(e) => setShipping({...shipping, zipCode: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900" /></div>
                  <div><label className="block text-sm font-medium mb-1">Country</label><input value={shipping.country} onChange={(e) => setShipping({...shipping, country: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900" /></div>
                </div>
              </div>
            </div>

            {/* ✅ Payment Method with Stripe Option */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label onClick={() => setPaymentMethod('cash_on_delivery')} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 ${paymentMethod === 'cash_on_delivery' ? 'border-violet-600 bg-violet-50' : 'border-gray-200'}`}>
                  <input type="radio" checked={paymentMethod === 'cash_on_delivery'} onChange={() => setPaymentMethod('cash_on_delivery')} className="w-5 h-5 accent-violet-600" />
                  <div><p className="font-semibold">Cash on Delivery</p><p className="text-sm text-gray-500">Pay when you receive</p></div>
                  <span className="ml-auto text-2xl">💵</span>
                </label>

                <label onClick={() => { setPaymentMethod('card'); initStripePayment(); }} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer border-2 ${paymentMethod === 'card' ? 'border-violet-600 bg-violet-50' : 'border-gray-200'}`}>
                  <input type="radio" checked={paymentMethod === 'card'} onChange={() => { setPaymentMethod('card'); initStripePayment(); }} className="w-5 h-5 accent-violet-600" />
                  <div><p className="font-semibold">Credit/Debit Card</p><p className="text-sm text-gray-500">Pay securely with Stripe</p></div>
                  <span className="ml-auto text-2xl">💳</span>
                </label>

                {/* ✅ Stripe Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="mt-4 p-4 border rounded-xl">
                    <StripeCheckout clientSecret={clientSecret} onSuccess={handlePlaceOrder} onError={(msg) => setError(msg)} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border sticky top-28">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3 py-3 border-b">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                      {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">📦</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cartData?.totalPrice || 0)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t"><span>Total</span><span className="text-violet-600">{formatPrice(cartData?.totalPrice || 0)}</span></div>
              </div>
              {paymentMethod === 'cash_on_delivery' && (
                <button onClick={handlePlaceOrder} disabled={submitting} className="w-full mt-6 py-3.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-50">
                  {submitting ? 'Placing Order...' : `Place Order - ${formatPrice(cartData?.totalPrice || 0)}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}