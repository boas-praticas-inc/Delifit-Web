export type TamanhoItem = 'PEQUENO' | 'MEDIO' | 'GRANDE';
export type StatusItemCardapio =
  | 'ATIVO'
  | 'INDISPONIVEL'
  | 'INATIVO'
  | 'ARQUIVADO';

export interface VariacaoItemCardapio {
  id: number | null;
  tamanho: TamanhoItem;
  preco: number;
  carboidratos: number;
  gorduras: number;
  proteina: number;
  caloria: number;
}

export interface ItemCardapio {
  id: number;
  restaurante_id: number;
  categoria_id: number;
  nome: string;
  descricao: string | null;
  variacoes: VariacaoItemCardapio[];
  status_item: StatusItemCardapio;
  foto_url: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface VariacaoItemCardapioPayload {
  tamanho: TamanhoItem;
  preco: number;
  carboidratos: number;
  gorduras: number;
  proteina: number;
  caloria: number;
}

export interface CriarItemCardapioPayload {
  restaurante_id: number;
  categoria_id: number;
  nome: string;
  descricao: string | null;
  variacoes: VariacaoItemCardapioPayload[];
  status_item: StatusItemCardapio;
  foto_url: string | null;
}

export type AtualizarItemCardapioPayload = CriarItemCardapioPayload;
