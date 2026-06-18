export type TamanhoItem = 'PEQUENO' | 'MEDIO' | 'GRANDE';
export type StatusItemCardapio =
  | 'ATIVO'
  | 'INDISPONIVEL'
  | 'INATIVO'
  | 'ARQUIVADO';

export interface ItemCardapio {
  id: number;
  restaurante_id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  tamanho: TamanhoItem | null;
  status_item: StatusItemCardapio;
  foto_url: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface CriarItemCardapioPayload {
  restaurante_id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  tamanho: TamanhoItem | null;
  status_item: StatusItemCardapio;
  foto_url: string | null;
}

export type AtualizarItemCardapioPayload = CriarItemCardapioPayload;
