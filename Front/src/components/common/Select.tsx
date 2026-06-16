import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '../../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, error, id, label, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        <span>{label}</span>
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <span id={`${selectId}-error`} className="text-xs text-red-600">
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);

Select.displayName = 'Select';
