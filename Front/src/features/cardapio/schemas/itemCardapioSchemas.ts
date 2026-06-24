import { z } from 'zod';

export const itemCardapioSchema = z.object({
  categoria_id: z.coerce
    .number()
    .int()
    .positive('Selecione uma categoria.'),
  nome: z.string().trim().min(2, 'Informe o nome do item.'),
  descricao: z.string().optional(),
  preco: z.coerce.number().min(0, 'Informe um preço válido.'),
  carboidratos: z.coerce.number().min(0, 'Informe um valor válido para carboidratos.'),
  gorduras: z.coerce.number().min(0, 'Informe um valor válido para gorduras.'),
  proteina: z.coerce.number().min(0, 'Informe um valor válido para proteína.'),
  caloria: z.coerce.number().min(0, 'Informe um valor válido para caloria.'),
  tamanho: z.enum(['PEQUENO', 'MEDIO', 'GRANDE']),
  status_item: z.enum(['ATIVO', 'INDISPONIVEL', 'INATIVO', 'ARQUIVADO']),
  foto_url: z
    .union([z.string().trim().url('Informe uma URL válida.'), z.literal('')])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
});

export type ItemCardapioFormData = z.infer<typeof itemCardapioSchema>;
