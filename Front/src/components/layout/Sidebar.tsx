import { NavLink } from 'react-router-dom';

import { cn } from '../../utils/cn';

const links = [
  { to: '/', label: 'Início' },
  { to: '/solicitacoes', label: 'Solicitações' },
  { to: '/clientes', label: 'Listar Clientes' },
  { to: '/clientes/novo', label: 'Adicionar Cliente' },
  { to: '/restaurantes', label: 'Listar Restaurantes' },
  { to: '/restaurantes/novo', label: 'Adicionar Restaurante' },
];

export function Sidebar() {
  return (
    <aside className="border-b border-slate-200 bg-white p-3 md:min-h-[calc(100vh-4rem)] md:w-64 md:border-b-0 md:border-r">
      <nav className="flex gap-2 overflow-x-auto md:grid">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-brand-100 text-brand-900'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
