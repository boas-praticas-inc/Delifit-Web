export interface Restaurante {
  id: number;
  gestor_id: number;
  endereco_id: number;
  solicitacao_adesao_id: number | null;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  telefone: string;
  descricao: string | null;
  foto_url: string | null;
  status: string;
  criado_em: string;
}

export interface CriarRestaurantePayload {
  gestor_id: number;
  endereco_id: number;
  solicitacao_adesao_id: number | null;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  telefone: string;
  descricao: string | null;
  foto_url: string | null;
}

export interface AtualizarRestaurantePayload extends CriarRestaurantePayload {}
