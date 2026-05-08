'use client';

import { useState, useEffect } from 'react';
import SupportTicketForm from '../components/support/SupportTicketForm';
import SupportFAQ from '../components/support/SupportFAQ';
import UserTickets from '../components/support/UserTickets';
import SupportQuickActions from '../components/support/SupportQuickActions';

export default function SupportPage() {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(isAuth && !!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How Can We Help?
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Quick Actions */}
        <SupportQuickActions onContactSupport={() => setShowTicketForm(true)} />

        {/* User's Tickets (if authenticated) */}
        {isAuthenticated && <UserTickets />}

        {/* FAQ Section */}
        <SupportFAQ />

        {/* Still Need Help? */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-aurora/10 to-amethyst/10 rounded-2xl p-8 border border-aurora/20">
            <i className="fa-solid fa-headset text-4xl text-aurora mb-4 block"></i>
            <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
            <p className="text-gray-400 mb-4">Our support team is ready to assist you</p>
            <button
              onClick={() => setShowTicketForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-aurora to-amethyst text-white rounded-lg hover:opacity-90 transition-all"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Form Modal */}
      <SupportTicketForm
        isOpen={showTicketForm}
        onClose={() => setShowTicketForm(false)}
        onSuccess={() => {
          setShowTicketForm(false);
          window.location.reload();
        }}
      />
    </div>
  );
}