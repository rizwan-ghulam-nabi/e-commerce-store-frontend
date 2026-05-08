'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function Footer() {
  const [openSections, setOpenSections] = useState({
    quickLinks: false,
    support: false,
    contact: false,
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ type: 'success', message: data.message });
        setEmail('');
        setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      } else {
        setStatus({ type: 'error', message: data.message });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  const location = {
    name: 'SwiftCart',
    address: 'Near Super Ideal bakers',
    city: 'Faisalabad, Pakistan',
    phone: '+92 302 7972606',
    email: 'SwiftCartStore@gamil.com',
  };

  return (
    <footer className="relative bg-deep-space text-white overflow-hidden">
      {/* Background Effects - Matching your theme */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-aurora/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amethyst/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-coral/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-aurora to-amethyst bg-clip-text text-transparent">
               SwiftCart 
              </h3>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                Your trusted destination for quality products in Faisalabad. Visit us near Super Ideal Bakers.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.892h-2.33v6.987C18.343 21.128 22 16.991 22 12z', label: 'Facebook' },
                { icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.337-11.66c0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', label: 'Twitter' },
                { icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z', label: 'Instagram' },
                { icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z', label: 'LinkedIn' },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-aurora hover:border-aurora/30 hover:bg-aurora/10 transition-all group"
                  aria-label={social.label}
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <button onClick={() => toggleSection('quickLinks')} className="w-full flex items-center justify-between md:cursor-default">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <svg className={`w-5 h-5 text-gray-400 md:hidden transition-transform ${openSections.quickLinks ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul className={`mt-4 space-y-3 md:block ${openSections.quickLinks ? 'block' : 'hidden'}`}>
              {[
                { href: '/about', label: 'About Us' },
                { href: '/products', label: 'Products' },
                { href: '/new-arrivals', label: 'New Arrivals' },
                { href: '/deals', label: 'Special Deals' },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-aurora transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-aurora transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <button onClick={() => toggleSection('support')} className="w-full flex items-center justify-between md:cursor-default">
              <h4 className="text-lg font-semibold text-white">Support</h4>
              <svg className={`w-5 h-5 text-gray-400 md:hidden transition-transform ${openSections.support ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul className={`mt-4 space-y-3 md:block ${openSections.support ? 'block' : 'hidden'}`}>
              {[
                { href: '/faq', label: 'FAQ' },
                { href: '/shipping', label: 'Shipping Info' },
                { href: '/returns', label: 'Returns & Exchange' },
                { href: '/size-guide', label: 'Size Guide' },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-aurora transition-colors text-sm flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-aurora transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <button onClick={() => toggleSection('contact')} className="w-full flex items-center justify-between md:cursor-default">
              <h4 className="text-lg font-semibold text-white">Contact Us</h4>
              <svg className={`w-5 h-5 text-gray-400 md:hidden transition-transform ${openSections.contact ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul className={`mt-4 space-y-4 md:block ${openSections.contact ? 'block' : 'hidden'}`}>
              <li>
                <a href="https://www.google.com/maps?q=31.405349,73.104911" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-gray-400 hover:text-aurora transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-aurora/10 flex items-center justify-center flex-shrink-0 group-hover:bg-aurora/20 transition-colors">
                    <svg className="w-4 h-4 text-aurora" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p>{location.address}</p>
                    <p>{location.city}</p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${location.email}`} className="flex items-center gap-3 text-gray-400 hover:text-aurora transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-aurora/10 flex items-center justify-center flex-shrink-0 group-hover:bg-aurora/20 transition-colors">
                    <svg className="w-4 h-4 text-aurora" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm">{location.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-400 hover:text-aurora transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-aurora/10 flex items-center justify-center flex-shrink-0 group-hover:bg-aurora/20 transition-colors">
                    <svg className="w-4 h-4 text-aurora" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-sm">{location.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-aurora/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-aurora" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm">Mon-Sat: 9AM - 9PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/10 mt-12 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">📧 Stay in the Loop</h4>
              <p className="text-gray-400 text-sm">
                Subscribe to get exclusive deals, new arrivals, and special offers directly in your inbox.
              </p>
            </div>
            <div>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-aurora/50 focus:bg-white/[0.07] transition-all text-sm disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-aurora to-amethyst text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-aurora/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Wait...</span>
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
              
              {/* Status Messages */}
              {status.type === 'success' && (
                <p className="text-emerald text-sm mt-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {status.message}
                </p>
              )}
              {status.type === 'error' && (
                <p className="text-coral text-sm mt-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {status.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} SwiftCart All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-500 hover:text-aurora text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-aurora text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-aurora text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}