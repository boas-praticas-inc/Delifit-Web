export type UnidadeMedidaVariacao = 'G' | 'KG' | 'ML' | 'L' | 'UNIDADE';
export type TagItemCardapio =
  | 'LOW_CARB'
  | 'ALTO_EM_PROTEINA'
  | 'VEGANO'
  | 'VEGETARIANO'
  | 'ZERO_LACTOSE'
  | 'ZERO_GLUTEN'
  | 'SEM_ACUCAR';
export type StatusItemCardapio =
  | 'ATIVO'
  | 'INDISPONIVEL'
  | 'INATIVO'
  | 'ARQUIVADO';

export const TAG_ITEM_CARDAPIO_OPTIONS: Array<{
  value: TagItemCardapio;
  label: string;
}> = [
  { value: 'LOW_CARB', label: 'Low carb' },
  { value: 'ALTO_EM_PROTEINA', label: 'Alto em proteína' },
  { value: 'VEGANO', label: 'Vegano' },
  { value: 'VEGETARIANO', label: 'Vegetariano' },
  { value: 'ZERO_LACTOSE', label: 'Zero lactose' },
  { value: 'ZERO_GLUTEN', label: 'Zero glúten' },
  { value: 'SEM_ACUCAR', label: 'Sem açúcar' },
];

export interface VariacaoItemCardapio {
  id: number | null;
  descricao_variacao: string;
  quantidade: number | null;
  unidade_medida: UnidadeMedidaVariacao | null;
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
  tags: TagItemCardapio[];
  status_item: StatusItemCardapio;
  foto_url: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface VariacaoItemCardapioPayload {
  quantidade: number;
  unidade_medida: UnidadeMedidaVariacao;
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
  tags: TagItemCardapio[];
  status_item: StatusItemCardapio;
  foto_url: string | null;
}

export type AtualizarItemCardapioPayload = CriarItemCardapioPayload;
