import { z } from 'zod';

export const itemCardapioSchema = z.object({
  nome: z.string().trim().min(2, 'Informe o nome do item.'),
  descricao: z.string().optional(),
  preco: z.coerce.number().min(0, 'Informe um preço válido.'),
  tamanho: z
    .union([z.enum(['PEQUENO', 'MEDIO', 'GRANDE']), z.literal('')])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  status_item: z.enum(['ATIVO', 'INDISPONIVEL', 'INATIVO', 'ARQUIVADO']),
  foto_url: z
    .union([z.string().trim().url('Informe uma URL válida.'), z.literal('')])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
});

export type ItemCardapioFormData = z.infer<typeof itemCardapioSchema>;
