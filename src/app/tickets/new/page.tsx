/**
 * New Ticket Page
 * Form to create a new complaint
 */

import TicketForm from '@/components/TicketForm';

export default function NewTicketPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submit a Complaint</h1>
        <p className="text-gray-600 mt-2">
          Fill out the form below to submit your complaint. Our AI system will analyze it
          and an agent will respond shortly.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <TicketForm />
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Note:</strong> Your complaint will be processed immediately and you'll
          receive a confirmation. Our AI system will analyze your issue and generate a draft
          response within seconds. An agent will review and finalize the response.
        </p>
      </div>
    </div>
  );
}
