export interface Solicitacao {
  id: number;
  gestor_id: number;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string | null;
  referencia: string | null;
  descricao: string | null;
  foto_url: string | null;
  status_solicitacao: 'EM_ANALISE' | 'APROVADO' | 'REPROVADO';
  motivo_reprovacao: string | null;
  criado_em: string;
  analisado_em: string | null;
  analisado_por_admin_id: number | null;
}

export interface CriarSolicitacaoPayload {
  gestor_id: number;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string | null;
  referencia?: string | null;
  descricao?: string | null;
  foto_url?: string | null;
}

export interface SolicitarAdesaoPayload {
  email: string;
  senha: string;
  nome_completo: string;
  cpf: string;
  telefone_gestor: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  telefone_restaurante: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string | null;
  referencia?: string | null;
  descricao?: string | null;
  foto_url?: string | null;
}
