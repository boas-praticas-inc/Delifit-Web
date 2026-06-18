import { Navigate, Outlet } from 'react-router-dom';

import { getUsuarioLogado, isGestor } from '../utils/session';

export function GestorRoute() {
  const usuario = getUsuarioLogado();

  if (!isGestor(usuario)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
