import type { TextareaHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '../../utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, id, label, ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        <span>{label}</span>
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'min-h-28 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error ? (
          <span id={`${textareaId}-error`} className="text-xs text-red-600">
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);

Textarea.displayName = 'Textarea';
