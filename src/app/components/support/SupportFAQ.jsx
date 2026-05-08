'use client';

import { useState } from 'react';

const faqs = [
  {
    id: 1,
    question: 'How do I track my order?',
    answer: 'You can track your order by logging into your account and visiting "My Orders" section. Click on the order number to see real-time tracking information.',
    category: 'orders'
  },
  {
    id: 2,
    question: 'What is your return policy?',
    answer: 'We offer a 7-day easy return policy. Items must be unused and in original packaging. To initiate a return, go to "My Orders" and click "Return Item".',
    category: 'returns'
  },
  {
    id: 3,
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days.',
    category: 'shipping'
  },
  {
    id: 4,
    question: 'Do you offer cash on delivery?',
    answer: 'Yes, we offer Cash on Delivery (COD) for orders under Rs. 50,000.',
    category: 'payment'
  },
  {
    id: 5,
    question: 'How can I change or cancel my order?',
    answer: 'Orders can be cancelled within 1 hour of placing. Contact support immediately.',
    category: 'orders'
  },
  {
    id: 6,
    question: 'Are your products authentic?',
    answer: 'Yes, all products are 100% authentic and sourced from authorized distributors.',
    category: 'products'
  },
  {
    id: 7,
    question: 'How do I apply a coupon code?',
    answer: 'Enter your coupon code at checkout in the "Promo Code" field and click "Apply".',
    category: 'payment'
  },
  {
    id: 8,
    question: 'What payment methods do you accept?',
    answer: 'We accept Credit/Debit Cards, Bank Transfer, EasyPaisa, JazzCash, and COD.',
    category: 'payment'
  }
];

const categories = [
  { id: 'all', name: 'All Questions', icon: 'fa-solid fa-list' },
  { id: 'orders', name: 'Orders', icon: 'fa-solid fa-truck' },
  { id: 'returns', name: 'Returns', icon: 'fa-solid fa-rotate-left' },
  { id: 'shipping', name: 'Shipping', icon: 'fa-solid fa-shipping-fast' },
  { id: 'payment', name: 'Payment', icon: 'fa-solid fa-credit-card' },
  { id: 'products', name: 'Products', icon: 'fa-solid fa-box' }
];

export default function SupportFAQ() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <i className="fa-solid fa-question-circle text-2xl text-aurora"></i>
        <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-aurora text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <i className={cat.icon}></i>
            {cat.name}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div key={faq.id} className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-700/50 transition-colors"
            >
              <span className="text-white font-medium">{faq.question}</span>
              <i className={`fa-solid fa-chevron-${openFaq === faq.id ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
            </button>
            {openFaq === faq.id && (
              <div className="p-4 bg-gray-700/30 border-t border-gray-700">
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}