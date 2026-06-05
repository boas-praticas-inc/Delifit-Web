import { cn } from '../../utils/cn';

interface LoadingProps {
  label?: string;
  size?: 'sm' | 'md';
}

export function Loading({
  label = 'Carregando...',
  size = 'md',
}: LoadingProps) {
  return (
    <span className="inline-flex items-center gap-2" role="status">
      <span
        className={cn(
          'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
          size === 'sm' ? 'size-4' : 'size-6',
        )}
        aria-hidden="true"
      />
      <span className={size === 'sm' ? 'text-sm' : 'text-base'}>{label}</span>
    </span>
  );
}
