import type { Usuario } from '../../usuarios/types/usuarioTypes';
import { api } from '../../../lib/api';
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from '../types/authTypes';

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post<Usuario>('/usuarios', payload);
    return response.data;
  },
};
