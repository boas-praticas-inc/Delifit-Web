import { z } from 'zod';

export const criarRestauranteSchema = z.object({
  usuario_dono_id: z.coerce.number().int().positive('Informe o usuario dono.'),
  nome_fantasia: z.string().min(1, 'Informe o nome fantasia.'),
  razao_social: z.string().min(1, 'Informe a razao social.'),
  cnpj: z
    .string()
    .regex(/^[0-9]{14}$/, 'O CNPJ deve conter 14 digitos.')
    .min(14, 'O CNPJ deve conter 14 digitos.'),
  telefone: z.string().min(1, 'Informe o telefone.'),
  validado: z.coerce.boolean(),
  logo_url: z
    .union([z.string().url('Informe uma URL valida.'), z.literal('')])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
});

export const atualizarRestauranteSchema = z.object({
  nome_fantasia: z.string().min(1, 'Informe o nome fantasia.'),
  razao_social: z.string().min(1, 'Informe a razao social.'),
  cnpj: z
    .string()
    .regex(/^[0-9]{14}$/, 'O CNPJ deve conter 14 digitos.')
    .min(14, 'O CNPJ deve conter 14 digitos.'),
  telefone: z.string().min(1, 'Informe o telefone.'),
  validado: z.coerce.boolean(),
  logo_url: z
    .union([z.string().url('Informe uma URL valida.'), z.literal('')])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
});

export type CriarRestauranteFormData = z.infer<typeof criarRestauranteSchema>;
export type AtualizarRestauranteFormData = z.infer<
  typeof atualizarRestauranteSchema
>;
