import { api } from '../../../lib/api';
import type {
  AtualizarRestaurantePayload,
  CriarRestaurantePayload,
  Restaurante,
} from '../types/restauranteTypes';

export const restauranteService = {
  async listarRestaurantes() {
    const response = await api.get<Restaurante[]>('/restaurantes');
    return response.data;
  },

  async buscarRestaurantePorId(restauranteId: number) {
    const response = await api.get<Restaurante>(`/restaurantes/${restauranteId}`);
    return response.data;
  },

  async criarRestaurante(payload: CriarRestaurantePayload) {
    const response = await api.post<Restaurante>('/restaurantes', payload);
    return response.data;
  },

  async atualizarRestaurante(
    restauranteId: number,
    payload: AtualizarRestaurantePayload,
  ) {
    const response = await api.put<Restaurante>(
      `/restaurantes/${restauranteId}`,
      payload,
    );
    return response.data;
  },

  async excluirRestaurante(restauranteId: number) {
    await api.delete(`/restaurantes/${restauranteId}`);
  },
};
