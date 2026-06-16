import type { ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '../../utils/cn';

type LinkButtonVariant = 'primary' | 'secondary' | 'ghost';
type LinkButtonSize = 'md' | 'sm';

interface LinkButtonProps extends ComponentPropsWithoutRef<typeof Link> {
  size?: LinkButtonSize;
  variant?: LinkButtonVariant;
}

const variantClasses: Record<LinkButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus-visible:ring-brand-600',
  secondary:
    'border border-brand-200 bg-white text-brand-900 hover:bg-brand-50 focus-visible:ring-brand-600',
  ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-500',
};

const sizeClasses: Record<LinkButtonSize, string> = {
  md: 'min-h-10 px-4 py-2 text-sm font-semibold',
  sm: 'min-h-9 px-3 py-2 text-sm font-medium',
};

export function LinkButton({
  children,
  className,
  size = 'md',
  variant = 'primary',
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center rounded-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
