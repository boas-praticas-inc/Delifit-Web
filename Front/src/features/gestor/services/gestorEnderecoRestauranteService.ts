import { api } from '../../../lib/api';
import type { AtualizarEnderecoPayload, Endereco } from '../../enderecos/types/enderecoTypes';

export const gestorEnderecoRestauranteService = {
  async buscarEnderecoRestaurante() {
    const response = await api.get<Endereco>('/gestores/me/restaurante/endereco');
    return response.data;
  },

  async atualizarEnderecoRestaurante(payload: AtualizarEnderecoPayload) {
    const response = await api.put<Endereco>('/gestores/me/restaurante/endereco', payload);
    return response.data;
  },
};
