export interface Endereco {
  id: number;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento: string | null;
  referencia: string | null;
  label: string | null;
  cliente_id: number | null;
}

export interface CriarEnderecoPayload {
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string | null;
  referencia?: string | null;
  label?: string | null;
  cliente_id?: number | null;
}

export interface AtualizarEnderecoPayload {
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  complemento?: string | null;
  referencia?: string | null;
}
