/**
 * UrgencyBadge Component
 * Displays color-coded urgency badge (Red/Yellow/Green)
 */

import { TicketUrgency } from '@/lib/types';
import { clsx } from '@/lib/utils';

interface UrgencyBadgeProps {
  urgency: TicketUrgency;
  className?: string;
}

const urgencyConfig = {
  high: {
    label: 'HIGH',
    className: 'bg-red-100 text-red-800 border-red-300',
    emoji: '🔴',
  },
  medium: {
    label: 'MEDIUM',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    emoji: '🟡',
  },
  low: {
    label: 'LOW',
    className: 'bg-green-100 text-green-800 border-green-300',
    emoji: '🟢',
  },
};

export default function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  const config = urgencyConfig[urgency];

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border',
        config.className,
        className
      )}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
}
