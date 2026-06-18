import type { Usuario } from '../../usuarios/types/usuarioTypes';

const STORAGE_KEY = 'delifit_usuario';
export const ADMIN_PRINCIPAL_EMAIL = 'admin@delifit.com';

export function getUsuarioLogado() {
  const rawUsuario = localStorage.getItem(STORAGE_KEY);

  if (!rawUsuario) {
    return null;
  }

  try {
    return JSON.parse(rawUsuario) as Usuario;
  } catch {
    return null;
  }
}

export function salvarUsuarioLogado(usuario: Usuario) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

export function limparUsuarioLogado() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAdminPrincipal(usuario: Usuario | null) {
  return (
    usuario?.tipo_usuario === 'ADMIN' &&
    usuario.email.toLowerCase() === ADMIN_PRINCIPAL_EMAIL
  );
}
