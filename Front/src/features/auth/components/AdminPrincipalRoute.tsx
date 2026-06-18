import { Navigate, Outlet } from 'react-router-dom';

import { getUsuarioLogado, isAdminPrincipal } from '../utils/session';

export function AdminPrincipalRoute() {
  const usuario = getUsuarioLogado();

  if (!isAdminPrincipal(usuario)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
