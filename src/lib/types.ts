/**
 * TypeScript type definitions for the Complaint Triage System
 */

export type TicketCategory = 'billing' | 'technical' | 'feature_request';
export type TicketUrgency = 'high' | 'medium' | 'low';
export type TicketStatus = 'pending' | 'processing' | 'ready' | 'resolved' | 'failed';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  customer_email: string;
  customer_name: string | null;
  
  category: TicketCategory | null;
  sentiment_score: number | null;
  urgency: TicketUrgency | null;
  ai_draft_response: string | null;
  
  final_response: string | null;
  agent_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  
  status: TicketStatus;
  error_message: string | null;
  processing_attempts: number;
  
  created_at: string;
  updated_at: string;
}

export interface TicketCreateData {
  title: string;
  description: string;
  customer_email: string;
  customer_name?: string;
}

export interface TicketUpdateData {
  final_response?: string;
  agent_notes?: string;
}

export interface TicketResolveData {
  final_response: string;
  agent_notes?: string;
  resolved_by: string;
}

export interface TicketCreateResponse {
  id: string;
  status: TicketStatus;
  message: string;
}

export interface TicketListResponse {
  total: number;
  items: Ticket[];
}

export interface TicketStats {
  total: number;
  by_status: {
    pending: number;
    processing: number;
    ready: number;
    resolved: number;
    failed: number;
  };
  by_urgency: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface ApiError {
  detail: string;
}
