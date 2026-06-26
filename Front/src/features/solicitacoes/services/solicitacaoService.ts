import { api } from '../../../lib/api';
import type {
  CriarSolicitacaoPayload,
  SolicitarAdesaoPayload,
  Solicitacao,
} from '../types/solicitacaoTypes';
import { gestorService } from '../../gestores/services/gestorService';
import { usuarioService } from '../../usuarios/services/usuarioService';

export const solicitacaoService = {
  async solicitarAdesao(payload: SolicitarAdesaoPayload) {
    const usuario = await usuarioService.criarUsuario({
      email: payload.email,
      telefone: null,
      senha: payload.senha,
      tipo_usuario: 'GESTOR',
    });

    const gestor = await gestorService.criarGestor({
      usuario_id: usuario.id,
      nome_completo: payload.nome_completo,
      cpf: payload.cpf,
      telefone: payload.telefone_gestor,
    });

    return this.criarSolicitacao({
      gestor_id: gestor.id,
      nome_fantasia: payload.nome_fantasia,
      razao_social: payload.razao_social,
      cnpj: payload.cnpj,
      telefone: payload.telefone_restaurante,
      cep: payload.cep,
      logradouro: payload.logradouro,
      numero: payload.numero,
      bairro: payload.bairro,
      cidade: payload.cidade,
      estado: payload.estado,
      complemento: payload.complemento ?? null,
      referencia: payload.referencia ?? null,
      descricao: payload.descricao ?? null,
      foto_url: payload.foto_url ?? null,
    });
  },

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

  async solicitarNovaAnalise(solicitacaoId: number) {
    const response = await api.patch<Solicitacao>(
      `/solicitacoes-adesao-restaurante/${solicitacaoId}/solicitar-nova-analise`,
    );
    return response.data;
  },
};
