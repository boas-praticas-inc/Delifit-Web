import { api } from '../../../lib/api';
import type { CriarEnderecoPayload, Endereco } from '../types/enderecoTypes';

export const enderecoService = {
  async criarEndereco(payload: CriarEnderecoPayload) {
    const response = await api.post<Endereco>('/enderecos', payload);
    return response.data;
  },

  async listarEnderecos() {
    const response = await api.get<Endereco[]>('/enderecos');
    return response.data;
  },
};
