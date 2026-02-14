/**
 * API client for the Complaint Triage System backend
 */

import axios, { AxiosError } from 'axios';
import type {
  Ticket,
  TicketCreateData,
  TicketCreateResponse,
  TicketListResponse,
  TicketUpdateData,
  TicketResolveData,
  TicketStats,
  TicketStatus,
  TicketUrgency,
  TicketCategory,
  ApiError,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Error handler
const handleApiError = (error: AxiosError<ApiError>): never => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.detail || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    // Request made but no response
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Something else happened
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

export const ticketApi = {
  /**
   * Create a new ticket (non-blocking)
   */
  async createTicket(data: TicketCreateData): Promise<TicketCreateResponse> {
    try {
      const response = await api.post<TicketCreateResponse>('/api/tickets/', data);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError<ApiError>);
    }
  },

  /**
   * Get list of tickets with optional filters
   */
  async listTickets(params?: {
    status?: TicketStatus;
    urgency?: TicketUrgency;
    category?: TicketCategory;
    limit?: number;
    offset?: number;
  }): Promise<TicketListResponse> {
    try {
      const response = await api.get<TicketListResponse>('/api/tickets/', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError<ApiError>);
    }
  },

  /**
   * Get a specific ticket by ID
   */
  async getTicket(id: string): Promise<Ticket> {
    try {
      const response = await api.get<Ticket>(`/api/tickets/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError<ApiError>);
    }
  },

  /**
   * Update a ticket (edit draft)
   */
  async updateTicket(id: string, data: TicketUpdateData): Promise<Ticket> {
    try {
      const response = await api.patch<Ticket>(`/api/tickets/${id}`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError<ApiError>);
    }
  },

  /**
   * Resolve a ticket
   */
  async resolveTicket(id: string, data: TicketResolveData): Promise<Ticket> {
    try {
      const response = await api.post<Ticket>(`/api/tickets/${id}/resolve`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError<ApiError>);
    }
  },

  /**
   * Delete a ticket
   */
  async deleteTicket(id: string): Promise<void> {
    try {
      await api.delete(`/api/tickets/${id}`);
    } catch (error) {
      return handleApiError(error as AxiosError<ApiError>);
    }
  },

  /**
   * Get ticket statistics
   */
  async getStats(): Promise<TicketStats> {
    try {
      const response = await api.get<TicketStats>('/api/tickets/stats/summary');
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError<ApiError>);
    }
  },
};

export default api;
