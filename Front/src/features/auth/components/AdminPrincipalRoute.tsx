import { Navigate, Outlet } from 'react-router-dom';

import { getUsuarioLogado, isAdmin } from '../utils/session';

export function AdminPrincipalRoute() {
  const usuario = getUsuarioLogado();

  if (!isAdmin(usuario)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
