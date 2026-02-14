/**
 * TicketDetail Component
 * Displays detailed ticket information with editing capabilities
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Ticket, TicketResolveData } from '@/lib/types';
import { ticketApi } from '@/lib/api';
import UrgencyBadge from './UrgencyBadge';
import StatusBadge from './StatusBadge';
import LoadingSpinner from './LoadingSpinner';

interface TicketDetailProps {
  ticket: Ticket;
  onUpdate?: () => void;
}

export default function TicketDetail({ ticket: initialTicket, onUpdate }: TicketDetailProps) {
  const router = useRouter();
  const [ticket, setTicket] = useState(initialTicket);
  const [isEditing, setIsEditing] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [editedResponse, setEditedResponse] = useState(ticket.ai_draft_response || '');
  const [agentNotes, setAgentNotes] = useState(ticket.agent_notes || '');
  const [resolvedBy, setResolvedBy] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSaveDraft = async () => {
    try {
      setError(null);
      const updated = await ticketApi.updateTicket(ticket.id, {
        final_response: editedResponse,
        agent_notes: agentNotes,
      });
      setTicket(updated);
      setIsEditing(false);
      onUpdate?.();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResolve = async () => {
    if (!resolvedBy.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!editedResponse.trim() || editedResponse.length < 10) {
      setError('Please provide a final response (at least 10 characters)');
      return;
    }

    try {
      setError(null);
      setIsResolving(true);
      const resolveData: TicketResolveData = {
        final_response: editedResponse,
        agent_notes: agentNotes,
        resolved_by: resolvedBy,
      };
      const updated = await ticketApi.resolveTicket(ticket.id, resolveData);
      setTicket(updated);
      onUpdate?.();
      
      // Show success and redirect
      setTimeout(() => {
        router.push('/tickets');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResolving(false);
    }
  };

  const canEdit = ticket.status === 'ready' || ticket.status === 'processing';
  const canResolve = ticket.status === 'ready';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={ticket.status} />
            {ticket.urgency && <UrgencyBadge urgency={ticket.urgency} />}
            {ticket.category && (
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded">
                {ticket.category.replace('_', ' ').toUpperCase()}
              </span>
            )}
            {ticket.sentiment_score !== null && (
              <span className="text-sm text-gray-600">
                Sentiment: <strong>{ticket.sentiment_score}/10</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-sm text-gray-900">{ticket.customer_email}</p>
          </div>
          {ticket.customer_name && (
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm text-gray-900">{ticket.customer_name}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">Created</p>
            <p className="text-sm text-gray-900">
              {format(new Date(ticket.created_at), 'MMM d, yyyy HH:mm:ss')}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Last Updated</p>
            <p className="text-sm text-gray-900">
              {format(new Date(ticket.updated_at), 'MMM d, yyyy HH:mm:ss')}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Complaint Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
      </div>

      {/* AI Draft Response */}
      {ticket.ai_draft_response && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            {isEditing ? 'Edit Response' : 'AI Draft Response'}
          </h2>
          
          {isEditing ? (
            <textarea
              value={editedResponse}
              onChange={(e) => setEditedResponse(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{editedResponse}</p>
          )}
        </div>
      )}

      {/* Agent Notes */}
      {(isEditing || ticket.agent_notes) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Agent Notes</h2>
          {isEditing ? (
            <textarea
              value={agentNotes}
              onChange={(e) => setAgentNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes about this ticket..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.agent_notes}</p>
          )}
        </div>
      )}

      {/* Resolve Section (only for ready tickets) */}
      {canResolve && !isEditing && !ticket.resolved_at && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Resolve Ticket</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={resolvedBy}
                onChange={(e) => setResolvedBy(e.target.value)}
                placeholder="Agent name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isResolving}
              />
            </div>
          </div>
        </div>
      )}

      {/* Resolved Information */}
      {ticket.status === 'resolved' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-3">✅ Ticket Resolved</h2>
          <div className="space-y-2 text-sm text-green-800">
            <p><strong>Resolved by:</strong> {ticket.resolved_by}</p>
            {ticket.resolved_at && (
              <p><strong>Resolved at:</strong> {format(new Date(ticket.resolved_at), 'MMM d, yyyy HH:mm:ss')}</p>
            )}
            {ticket.final_response && (
              <div className="mt-4">
                <p className="font-medium mb-2">Final Response:</p>
                <p className="whitespace-pre-wrap bg-white p-4 rounded border border-green-200">
                  {ticket.final_response}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {ticket.status === 'failed' && ticket.error_message && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-3">❌ Processing Failed</h2>
          <p className="text-sm text-red-800">
            <strong>Attempts:</strong> {ticket.processing_attempts}
          </p>
          <p className="text-sm text-red-800 mt-2">
            <strong>Error:</strong> {ticket.error_message}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        {canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Edit Draft
          </button>
        )}

        {isEditing && (
          <>
            <button
              onClick={handleSaveDraft}
              className="px-6 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedResponse(ticket.ai_draft_response || '');
                setAgentNotes(ticket.agent_notes || '');
              }}
              className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </>
        )}

        {canResolve && !isEditing && !ticket.resolved_at && (
          <button
            onClick={handleResolve}
            disabled={isResolving}
            className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isResolving ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Resolving...</span>
              </span>
            ) : (
              'Resolve Ticket'
            )}
          </button>
        )}

        <button
          onClick={() => router.push('/tickets')}
          className="ml-auto px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
