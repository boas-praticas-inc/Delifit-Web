import { z } from 'zod';

import { somenteDigitos } from '../../../utils/masks';

export const criarRestauranteSchema = z.object({
  gestor_id: z.coerce.number().int().positive('Informe o gestor.'),
  endereco_id: z.coerce.number().int().positive('Informe o endereço.'),
  solicitacao_adesao_id: z
    .union([
      z.coerce.number().int().positive('Informe uma solicitação válida.'),
      z.literal(''),
    ])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  nome_fantasia: z.string().trim().min(2, 'Informe o nome fantasia.'),
  razao_social: z.string().trim().min(3, 'Informe a razão social.'),
  cnpj: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z.string().length(14, 'O CNPJ deve conter 14 dígitos.'),
  ),
  telefone: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z
      .string()
      .min(10, 'Informe um telefone com DDD.')
      .max(11, 'Informe um telefone válido com até 11 dígitos.'),
  ),
  descricao: z.string().optional(),
  foto_url: z
    .union([z.string().trim().url('Informe uma URL válida.'), z.literal('')])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
});

export const atualizarRestauranteSchema = z.object({
  nome_fantasia: z.string().trim().min(2, 'Informe o nome fantasia.'),
  razao_social: z.string().trim().min(3, 'Informe a razão social.'),
  cnpj: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z.string().length(14, 'O CNPJ deve conter 14 dígitos.'),
  ),
  telefone: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z
      .string()
      .min(10, 'Informe um telefone com DDD.')
      .max(11, 'Informe um telefone válido com até 11 dígitos.'),
  ),
  descricao: z.string().optional(),
  foto_url: z
    .union([z.string().trim().url('Informe uma URL válida.'), z.literal('')])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
});

export type CriarRestauranteFormData = z.infer<typeof criarRestauranteSchema>;
export type AtualizarRestauranteFormData = z.infer<
  typeof atualizarRestauranteSchema
>;
