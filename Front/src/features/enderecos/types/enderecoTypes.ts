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
