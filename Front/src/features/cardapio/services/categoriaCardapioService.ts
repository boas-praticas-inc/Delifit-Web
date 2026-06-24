import { api } from '../../../lib/api';
import type { CategoriaCardapio } from '../types/categoriaCardapioTypes';

export const categoriaCardapioService = {
  async listarCategorias() {
    const response = await api.get<CategoriaCardapio[]>('/categorias-cardapio');
    return response.data;
  },
};
