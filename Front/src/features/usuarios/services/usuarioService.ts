import { api } from '../../../lib/api';
import type { CriarUsuarioPayload, Usuario } from '../types/usuarioTypes';

export const usuarioService = {
  async listarUsuarios() {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data;
  },

  async criarUsuario(payload: CriarUsuarioPayload) {
    const response = await api.post<Usuario>('/usuarios', payload);
    return response.data;
  },
};
