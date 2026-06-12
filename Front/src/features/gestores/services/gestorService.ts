import { api } from '../../../lib/api';
import type { Gestor } from '../types/gestorTypes';

export const gestorService = {
  async listarGestores() {
    const response = await api.get<Gestor[]>('/gestores');
    return response.data;
  },
};
