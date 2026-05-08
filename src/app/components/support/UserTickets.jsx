'use client';

import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuth || !token) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/support/user/tickets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTickets(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': 'bg-yellow-500/20 text-yellow-400',
      'in-progress': 'bg-blue-500/20 text-blue-400',
      'resolved': 'bg-green-500/20 text-green-400',
      'closed': 'bg-gray-500/20 text-gray-400'
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-8">
        <div className="flex items-center justify-center py-8">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-aurora"></i>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <i className="fa-solid fa-ticket text-2xl text-aurora"></i>
        <h2 className="text-2xl font-bold text-white">Your Support Tickets</h2>
      </div>
      
      <div className="space-y-3">
        {tickets.slice(0, 5).map((ticket) => (
          <div
            key={ticket._id}
            onClick={() => setSelectedTicket(selectedTicket === ticket._id ? null : ticket._id)}
            className="bg-gray-700/30 rounded-lg p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <p className="text-white font-medium">{ticket.subject}</p>
                <p className="text-gray-400 text-xs mt-1">
                  Ticket: {ticket.ticketNumber} • {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                  {ticket.status}
                </span>
                <i className={`fa-solid fa-chevron-${selectedTicket === ticket._id ? 'up' : 'down'} text-gray-400`}></i>
              </div>
            </div>
            
            {selectedTicket === ticket._id && (
              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-gray-300 text-sm mb-3">{ticket.message}</p>
                {ticket.adminReply && (
                  <div className="bg-aurora/10 rounded-lg p-3 mt-2">
                    <p className="text-aurora text-xs font-medium mb-1">Admin Response:</p>
                    <p className="text-gray-300 text-sm">{ticket.adminReply}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Replied on {new Date(ticket.repliedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}