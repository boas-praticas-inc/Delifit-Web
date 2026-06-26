import { api } from '../../../lib/api';
import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from '../types/authTypes';

export const authService = {
  async login(payload: LoginPayload) {
    const response = await api.post<LoginResponse>('/auth/staff/login', payload);
    return response.data;
  },

  async register(payload: RegisterPayload) {
    const response = await api.post<RegisterResponse>(
      '/auth/clientes/registro',
      payload,
    );
    return response.data;
  },
};
