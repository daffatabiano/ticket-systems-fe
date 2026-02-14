/**
 * LoadingSpinner Component
 * Simple loading indicator
 */

import { clsx } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

export default function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center gap-2', className)}>
      <div
        className={clsx(
          'animate-spin rounded-full border-primary-600 border-t-transparent',
          sizeClasses[size]
        )}
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}
