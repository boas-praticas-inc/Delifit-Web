import { api } from '../../../lib/api';
import type {
  AtualizarClientePayload,
  Cliente,
  CriarClientePayload,
} from '../types/clienteTypes';

export const clienteService = {
  async listarClientes() {
    const response = await api.get<Cliente[]>('/clientes');
    return response.data;
  },

  async buscarClientePorId(clienteId: number) {
    const response = await api.get<Cliente>(`/clientes/${clienteId}`);
    return response.data;
  },

  async criarCliente(payload: CriarClientePayload) {
    const response = await api.post<Cliente>('/clientes', payload);
    return response.data;
  },

  async atualizarCliente(clienteId: number, payload: AtualizarClientePayload) {
    const response = await api.put<Cliente>(`/clientes/${clienteId}`, payload);
    return response.data;
  },

  async excluirCliente(clienteId: number) {
    await api.delete(`/clientes/${clienteId}`);
  },
};
