'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function StripeForm({ onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    const { error } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
    if (error) onError(error.message);
    else onSuccess();
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || processing} className="w-full mt-4 py-3 bg-violet-600 text-white rounded-xl font-semibold">
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function StripeCheckout({ clientSecret, onSuccess, onError }) {
  if (!clientSecret) return <p className="text-red-500">Payment not available</p>;
  
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripeForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}