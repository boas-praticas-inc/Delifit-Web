import { api } from '../../../lib/api';
import type {
  AtualizarItemCardapioPayload,
  CriarItemCardapioPayload,
  ItemCardapio,
} from '../types/itemCardapioTypes';

export const itemCardapioService = {
  async listarItens(restauranteId?: number) {
    const response = await api.get<ItemCardapio[]>('/itens-cardapio', {
      params: restauranteId ? { restaurante_id: restauranteId } : undefined,
    });
    return response.data;
  },

  async criarItem(payload: CriarItemCardapioPayload) {
    const response = await api.post<ItemCardapio>('/itens-cardapio', payload);
    return response.data;
  },

  async atualizarItem(itemId: number, payload: AtualizarItemCardapioPayload) {
    const response = await api.put<ItemCardapio>(
      `/itens-cardapio/${itemId}`,
      payload,
    );
    return response.data;
  },

  async excluirItem(itemId: number) {
    await api.delete(`/itens-cardapio/${itemId}`);
  },
};
