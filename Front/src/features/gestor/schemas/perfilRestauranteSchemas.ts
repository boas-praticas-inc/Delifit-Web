import { z } from 'zod';

import { somenteDigitos } from '../../../utils/masks';
import {
  atualizarRestauranteSchema,
  type AtualizarRestauranteFormData,
} from '../../restaurantes/schemas/restauranteSchemas';

const complementoSchema = z
  .union([
    z.string().trim().max(100, 'O complemento deve ter no máximo 100 caracteres.'),
    z.literal(''),
  ])
  .transform((value) => (value === '' ? null : value))
  .nullable();

const referenciaSchema = z
  .union([
    z.string().trim().max(150, 'A referência deve ter no máximo 150 caracteres.'),
    z.literal(''),
  ])
  .transform((value) => (value === '' ? null : value))
  .nullable();

export const atualizarPerfilRestauranteSchema = atualizarRestauranteSchema.extend({
  cep: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z.string().length(8, 'O CEP deve conter 8 dígitos.'),
  ),
  logradouro: z
    .string()
    .trim()
    .min(1, 'Informe o logradouro.')
    .max(150, 'O logradouro deve ter no máximo 150 caracteres.'),
  numero: z
    .string()
    .trim()
    .min(1, 'Informe o número.')
    .max(20, 'O número deve ter no máximo 20 caracteres.'),
  bairro: z
    .string()
    .trim()
    .min(1, 'Informe o bairro.')
    .max(100, 'O bairro deve ter no máximo 100 caracteres.'),
  cidade: z
    .string()
    .trim()
    .min(1, 'Informe a cidade.')
    .max(100, 'A cidade deve ter no máximo 100 caracteres.'),
  estado: z.preprocess(
    (value) =>
      typeof value === 'string' ? value.trim().toUpperCase() : value,
    z.string().regex(/^[A-Z]{2}$/, 'Use a sigla do estado com 2 letras.'),
  ),
  complemento: complementoSchema,
  referencia: referenciaSchema,
});

export type AtualizarPerfilRestauranteFormData = z.infer<
  typeof atualizarPerfilRestauranteSchema
>;

export function mapearDadosRestaurante(
  data: AtualizarPerfilRestauranteFormData,
): AtualizarRestauranteFormData {
  return {
    nome_fantasia: data.nome_fantasia,
    razao_social: data.razao_social,
    cnpj: data.cnpj,
    telefone: data.telefone,
    descricao: data.descricao,
    foto_url: data.foto_url,
  };
}
