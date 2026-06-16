export interface Cliente {
  id: number;
  usuario_id: number;
  nome_completo: string;
  cpf: string;
  telefone: string;
  data_nascimento: string | null;
}

export interface CriarClientePayload {
  usuario_id: number;
  nome_completo: string;
  cpf: string;
  telefone: string;
  data_nascimento: string | null;
}

export type AtualizarClientePayload = CriarClientePayload;
