import { z } from 'zod';

export const variacaoItemCardapioSchema = z.object({
  quantidade: z.coerce.number().positive('Informe uma quantidade válida.'),
  unidade_medida: z.enum(['G', 'KG', 'ML', 'L', 'UNIDADE']),
  preco: z.coerce.number().min(0, 'Informe um preço válido.'),
  carboidratos: z.coerce
    .number()
    .min(0, 'Informe um valor válido para carboidratos.'),
  gorduras: z.coerce.number().min(0, 'Informe um valor válido para gorduras.'),
  proteina: z.coerce.number().min(0, 'Informe um valor válido para proteína.'),
  caloria: z.coerce.number().min(0, 'Informe um valor válido para caloria.'),
});

export const itemCardapioSchema = z
  .object({
    categoria_id: z.coerce
      .number()
      .int()
      .positive('Selecione uma categoria.'),
    nome: z.string().trim().min(2, 'Informe o nome do item.'),
    descricao: z.string().optional(),
    variacoes: z
      .array(variacaoItemCardapioSchema)
      .min(1, 'Adicione pelo menos uma variação.'),
    tags: z
      .array(
        z.enum([
          'LOW_CARB',
          'ALTO_EM_PROTEINA',
          'VEGANO',
          'VEGETARIANO',
          'ZERO_LACTOSE',
          'ZERO_GLUTEN',
          'SEM_ACUCAR',
        ]),
      )
      .default([]),
    status_item: z.enum(['ATIVO', 'INDISPONIVEL', 'INATIVO', 'ARQUIVADO']),
    foto_url: z
      .union([z.string().trim().url('Informe uma URL válida.'), z.literal('')])
      .transform((value) => (value === '' ? null : value))
      .nullable(),
  })
  .superRefine((data, context) => {
    const identificadores = data.variacoes.map(
      (variacao) => `${variacao.quantidade}-${variacao.unidade_medida}`,
    );
    const identificadoresDuplicados = identificadores.filter(
      (identificador, index) => identificadores.indexOf(identificador) !== index,
    );

    if (identificadoresDuplicados.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Cada combinação de quantidade e unidade pode ser informada apenas uma vez.',
        path: ['variacoes'],
      });
    }
  });

export type ItemCardapioFormData = z.infer<typeof itemCardapioSchema>;
