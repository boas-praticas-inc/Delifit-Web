import type { HTMLAttributes } from 'react';

import { cn } from '../../utils/cn';

type AlertVariant = 'error' | 'success' | 'info';

interface AlertProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: AlertVariant;
}

const variants: Record<AlertVariant, string> = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-brand-200 bg-brand-50 text-brand-900',
  info: 'border-slate-200 bg-slate-50 text-slate-700',
};

export function Alert({
  children,
  className,
  variant = 'info',
  ...props
}: AlertProps) {
  return (
    <p
      className={cn(
        'rounded-md border px-3 py-2 text-sm',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
