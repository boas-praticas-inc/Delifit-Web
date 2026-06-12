import { z } from 'zod';

export const criarRestauranteSchema = z.object({
  gestor_id: z.coerce.number().int().positive('Informe o gestor.'),
  endereco_id: z.coerce.number().int().positive('Informe o endereco.'),
  solicitacao_adesao_id: z
    .union([z.coerce.number().int().positive('Informe uma solicitacao valida.'), z.literal('')])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  nome_fantasia: z.string().min(1, 'Informe o nome fantasia.'),
  razao_social: z.string().min(1, 'Informe a razao social.'),
  cnpj: z
    .string()
    .regex(/^[0-9]{14}$/, 'O CNPJ deve conter 14 digitos.')
    .min(14, 'O CNPJ deve conter 14 digitos.'),
  telefone: z.string().min(1, 'Informe o telefone.'),
  descricao: z.string().optional(),
  foto_url: z
    .union([z.string().url('Informe uma URL valida.'), z.literal('')])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
});

export const atualizarRestauranteSchema = criarRestauranteSchema;

export type CriarRestauranteFormData = z.infer<typeof criarRestauranteSchema>;
export type AtualizarRestauranteFormData = z.infer<
  typeof atualizarRestauranteSchema
>;
