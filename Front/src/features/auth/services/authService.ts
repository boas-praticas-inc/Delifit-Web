import { api } from '../../../lib/api';
import type { LoginPayload, RegisterPayload } from '../types/authTypes';
import type { Usuario } from '../../usuarios/types/usuarioTypes';

export const authService = {
  async login(payload: LoginPayload) {
    void payload;
    throw new Error(
      'Endpoint de login ainda não configurado no backend. Ajuste authService.login quando a rota existir.',
    );
  },

  async register(payload: RegisterPayload) {
    const response = await api.post<Usuario>('/usuarios', payload);
    return response.data;
  },
};
