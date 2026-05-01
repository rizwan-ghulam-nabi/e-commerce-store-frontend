'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    if (params.id) fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/orders/${params.id}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setOrder(data.data?.order || data.order || data.data || data);
    }
    setLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format((price || 0) * 280);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <svg className="w-12 h-12 animate-spin text-violet-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold text-green-800">Order Placed!</h2>
            <p className="text-green-600">Thank you for your order!</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex justify-between mb-6">
            <h1 className="text-xl font-bold">Order #{order.orderNumber}</h1>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold capitalize">{order.status}</span>
          </div>

          <div className="space-y-3 mb-4">
            {order.items?.map((item) => (
              <div key={item._id} className="flex justify-between py-2 border-b text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                </div>
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-violet-600">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/products" className="text-violet-600 hover:underline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}