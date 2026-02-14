/**
 * StatusBadge Component
 * Displays ticket status with appropriate styling
 */

import { TicketStatus } from '@/lib/types';
import { clsx } from '@/lib/utils';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-gray-100 text-gray-800 border-gray-300',
  },
  processing: {
    label: 'Processing',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  ready: {
    label: 'Ready',
    className: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
