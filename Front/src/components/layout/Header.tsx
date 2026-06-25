import { Link } from 'react-router-dom';

interface HeaderProps {
  homeTo?: string;
  title?: string;
  subtitle?: string;
}

export function Header({
  homeTo = '/dashboard',
  title = 'Delifit',
  subtitle = 'Painel web',
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link to={homeTo} className="flex items-center gap-3 font-bold">
          <span className="grid size-10 place-items-center rounded-md bg-brand-600 text-white">
            D
          </span>
          <span className="text-lg text-brand-900">{title}</span>
        </Link>
        <div className="text-right text-sm text-slate-600">
          <p className="font-medium text-slate-900">{subtitle}</p>
          <p>Integrado a API REST</p>
        </div>
      </div>
    </header>
  );
}
