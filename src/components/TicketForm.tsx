/**
 * TicketForm Component
 * Form for creating new tickets
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ticketApi } from '@/lib/api';
import { TicketCreateData } from '@/lib/types';
import LoadingSpinner from './LoadingSpinner';

export default function TicketForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<TicketCreateData>({
    title: '',
    description: '',
    customer_email: '',
    customer_name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await ticketApi.createTicket(formData);
      setSuccess(true);
      
      // Show success message briefly then redirect
      setTimeout(() => {
        router.push('/tickets');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          minLength={5}
          maxLength={255}
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Brief description of the issue"
          disabled={isSubmitting}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          rows={6}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Please provide detailed information about your complaint..."
          disabled={isSubmitting}
        />
      </div>

      {/* Customer Email */}
      <div>
        <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="customer_email"
          name="customer_email"
          required
          value={formData.customer_email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="your.email@example.com"
          disabled={isSubmitting}
        />
      </div>

      {/* Customer Name (Optional) */}
      <div>
        <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name (Optional)
        </label>
        <input
          type="text"
          id="customer_name"
          name="customer_name"
          maxLength={100}
          value={formData.customer_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="John Doe"
          disabled={isSubmitting}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            ✅ Ticket created successfully! Redirecting to dashboard...
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Submitting...</span>
            </span>
          ) : (
            'Submit Complaint'
          )}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
