import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/dashboard" className="flex items-center gap-3 font-bold">
          <span className="grid size-10 place-items-center rounded-md bg-brand-600 text-white">
            D
          </span>
          <span className="text-lg text-brand-900">Delifit</span>
        </Link>
        <div className="text-right text-sm text-slate-600">
          <p className="font-medium text-slate-900">Painel web</p>
          <p>Integrado a API REST</p>
        </div>
      </div>
    </header>
  );
}
