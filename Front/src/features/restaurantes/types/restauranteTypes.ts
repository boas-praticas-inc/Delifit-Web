export interface Restaurante {
  id: number;
  usuario_dono_id: number;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  telefone: string;
  validado: boolean;
  logo_url: string | null;
  criado_em: string;
  atualizado_em: string | null;
}

export interface CriarRestaurantePayload {
  usuario_dono_id: number;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  telefone: string;
  validado: boolean;
  logo_url: string | null;
}

export interface AtualizarRestaurantePayload {
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  telefone: string;
  validado: boolean;
  logo_url: string | null;
}
