/**
 * Ticket Detail Page
 * Shows detailed ticket information and allows editing/resolving
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ticketApi } from '@/lib/api';
import { Ticket } from '@/lib/types';
import TicketDetail from '@/components/TicketDetail';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchTicket = async () => {
    try {
      setError(null);
      const data = await ticketApi.getTicket(ticketId);
      setTicket(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  // Auto-refresh every 3 seconds (for pending/processing tickets)
  useEffect(() => {
    if (!autoRefresh || !ticket) return;
    
    // Only auto-refresh for pending/processing tickets
    if (ticket.status === 'pending' || ticket.status === 'processing') {
      const interval = setInterval(fetchTicket, 3000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, ticket?.status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading ticket..." />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
          <p className="text-red-800">{error || 'Ticket not found'}</p>
          <button
            onClick={() => router.push('/tickets')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Auto-refresh indicator */}
      {(ticket.status === 'pending' || ticket.status === 'processing') && autoRefresh && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-blue-800">
              Auto-refreshing... Ticket is being processed by AI
            </span>
          </div>
          <button
            onClick={() => setAutoRefresh(false)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Stop auto-refresh
          </button>
        </div>
      )}

      <TicketDetail ticket={ticket} onUpdate={fetchTicket} />
    </div>
  );
}
