import { api } from '../../../lib/api';
import type {
  CriarSolicitacaoPayload,
  Solicitacao,
} from '../types/solicitacaoTypes';

export const solicitacaoService = {
  async criarSolicitacao(payload: CriarSolicitacaoPayload) {
    const response = await api.post<Solicitacao>(
      '/solicitacoes-adesao-restaurante',
      payload,
    );
    return response.data;
  },

  async listarSolicitacoes() {
    const response = await api.get<Solicitacao[]>('/solicitacoes-adesao-restaurante');
    return response.data;
  },

  async aprovarSolicitacao(solicitacaoId: number, analisado_por_admin_id: number) {
    const response = await api.patch<Solicitacao>(
      `/solicitacoes-adesao-restaurante/${solicitacaoId}/aprovar`,
      { analisado_por_admin_id },
    );
    return response.data;
  },

  async recusarSolicitacao(
    solicitacaoId: number,
    analisado_por_admin_id: number,
    motivo_reprovacao: string,
  ) {
    const response = await api.patch<Solicitacao>(
      `/solicitacoes-adesao-restaurante/${solicitacaoId}/recusar`,
      { analisado_por_admin_id, motivo_reprovacao },
    );
    return response.data;
  },
};
