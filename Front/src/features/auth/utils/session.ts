import type { Usuario } from '../../usuarios/types/usuarioTypes';

const STORAGE_KEY = 'delifit_usuario';
const TOKEN_STORAGE_KEY = 'delifit_token';

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

export function getTokenAcesso() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function salvarTokenAcesso(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function limparUsuarioLogado() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function isAdmin(usuario: Usuario | null) {
  return usuario?.tipo_usuario === 'ADMIN';
}

export function isGestor(usuario: Usuario | null) {
  return usuario?.tipo_usuario === 'GESTOR';
}
