import { NavLink } from 'react-router-dom';

import { cn } from '../../utils/cn';

const links = [
  { to: '/gestor/inicio', label: 'Início' },
  { to: '/gestor/cardapio', label: 'Cardápio' },
  { to: '/gestor/perfil', label: 'Perfil' },
  { to: '/gestor/faturamento', label: 'Faturamento' },
  { to: '/gestor/avaliacoes', label: 'Avaliações' },
  { to: '/gestor/pagamento', label: 'Pagamento' },
];

export function GestorSidebar() {
  return (
    <aside className="border-b border-slate-200 bg-white p-3 md:min-h-[calc(100vh-4rem)] md:w-72 md:border-b-0 md:border-r">
      <nav className="flex gap-2 overflow-x-auto md:grid">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition',
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
