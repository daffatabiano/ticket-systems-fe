/**
 * TicketList Component
 * Displays a list of tickets with color-coded urgency
 */

'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Ticket } from '@/lib/types';
import UrgencyBadge from './UrgencyBadge';
import StatusBadge from './StatusBadge';

interface TicketListProps {
  tickets: Ticket[];
}

export default function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tickets found</p>
        <p className="text-gray-400 text-sm mt-2">Create a new complaint to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/tickets/${ticket.id}`}
          className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left: Ticket Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {ticket.title}
                </h3>
                <StatusBadge status={ticket.status} />
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {ticket.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {ticket.customer_email}
                </span>

                {ticket.customer_name && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {ticket.customer_name}
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {format(new Date(ticket.created_at), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
            </div>

            {/* Right Urgency Badge and Category */}
            <div className="flex flex-col items-end gap-2">
              {ticket.urgency && <UrgencyBadge urgency={ticket.urgency} />}
              
              {ticket.category && (
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {ticket.category.replace('_', ' ').toUpperCase()}
                </span>
              )}

              {ticket.sentiment_score !== null && (
                <span className="text-xs text-gray-500">
                  Sentiment: {ticket.sentiment_score}/10
                </span>
              )}
            </div>
          </div>

          {/* AI Draft Response Preview (for ready tickets) */}
          {ticket.status === 'ready' && ticket.ai_draft_response && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-700 mb-1">AI Draft Response:</p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {ticket.ai_draft_response}
              </p>
            </div>
          )}

          {/* Error Message (for failed tickets) */}
          {ticket.status === 'failed' && ticket.error_message && (
            <div className="mt-4 pt-4 border-t border-red-100">
              <p className="text-xs font-medium text-red-700 mb-1">Error:</p>
              <p className="text-sm text-red-600">
                {ticket.error_message}
              </p>
            </div>
          )}

          {/* Resolved Info */}
          {ticket.status === 'resolved' && ticket.resolved_by && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Resolved by <span className="font-medium">{ticket.resolved_by}</span>
                {ticket.resolved_at && (
                  <span> on {format(new Date(ticket.resolved_at), 'MMM d, yyyy HH:mm')}</span>
                )}
              </p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
