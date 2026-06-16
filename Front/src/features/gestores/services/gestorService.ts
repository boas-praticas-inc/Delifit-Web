import { api } from '../../../lib/api';
import type { CriarGestorPayload, Gestor } from '../types/gestorTypes';

export const gestorService = {
  async listarGestores() {
    const response = await api.get<Gestor[]>('/gestores');
    return response.data;
  },

  async criarGestor(payload: CriarGestorPayload) {
    const response = await api.post<Gestor>('/gestores', payload);
    return response.data;
  },
};
