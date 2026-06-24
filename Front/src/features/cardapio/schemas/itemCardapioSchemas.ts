import { z } from 'zod';

export const variacaoItemCardapioSchema = z.object({
  tamanho: z.enum(['PEQUENO', 'MEDIO', 'GRANDE']),
  preco: z.coerce.number().min(0, 'Informe um preço válido.'),
  carboidratos: z.coerce
    .number()
    .min(0, 'Informe um valor válido para carboidratos.'),
  gorduras: z.coerce.number().min(0, 'Informe um valor válido para gorduras.'),
  proteina: z.coerce.number().min(0, 'Informe um valor válido para proteína.'),
  caloria: z.coerce.number().min(0, 'Informe um valor válido para caloria.'),
});

export const itemCardapioSchema = z.object({
  categoria_id: z.coerce
    .number()
    .int()
    .positive('Selecione uma categoria.'),
  nome: z.string().trim().min(2, 'Informe o nome do item.'),
  descricao: z.string().optional(),
  variacoes: z
    .array(variacaoItemCardapioSchema)
    .min(1, 'Adicione pelo menos uma variação de tamanho.'),
  status_item: z.enum(['ATIVO', 'INDISPONIVEL', 'INATIVO', 'ARQUIVADO']),
  foto_url: z
    .union([z.string().trim().url('Informe uma URL válida.'), z.literal('')])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
}).superRefine((data, context) => {
  const tamanhos = data.variacoes.map((variacao) => variacao.tamanho);
  const tamanhosDuplicados = tamanhos.filter(
    (tamanho, index) => tamanhos.indexOf(tamanho) !== index,
  );

  if (tamanhosDuplicados.length > 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cada tamanho pode ser informado apenas uma vez.',
      path: ['variacoes'],
    });
  }
});

export type ItemCardapioFormData = z.infer<typeof itemCardapioSchema>;
