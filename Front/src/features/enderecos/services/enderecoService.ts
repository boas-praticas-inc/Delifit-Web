import { api } from '../../../lib/api';
import type { Endereco } from '../types/enderecoTypes';

export const enderecoService = {
  async listarEnderecos() {
    const response = await api.get<Endereco[]>('/enderecos');
    return response.data;
  },
};
