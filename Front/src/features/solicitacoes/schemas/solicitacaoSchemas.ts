import { z } from 'zod';

import { somenteDigitos } from '../../../utils/masks';

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .optional();

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Informe o e-mail.')
  .email('Informe um e-mail válido.');

const senhaSchema = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.');

export const dadosGestorSchema = z.object({
  email: emailSchema,
  senha: senhaSchema,
  nome_completo: z
    .string()
    .trim()
    .min(1, 'Informe o nome completo.')
    .max(150, 'Use no máximo 150 caracteres.'),
  cpf: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z.string().length(11, 'Informe 11 números.'),
  ),
  telefone_gestor: z
    .string()
    .trim()
    .min(1, 'Informe o telefone do gestor.')
    .max(20, 'Use no máximo 20 caracteres.'),
});

export const dadosEnderecoSchema = z.object({
  cep: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z.string().length(8, 'Informe 8 números.'),
  ),
  logradouro: z
    .string()
    .trim()
    .min(1, 'Informe o logradouro.')
    .max(150, 'Use no máximo 150 caracteres.'),
  numero: z
    .string()
    .trim()
    .min(1, 'Informe o número.')
    .max(20, 'Use no máximo 20 caracteres.'),
  bairro: z
    .string()
    .trim()
    .min(1, 'Informe o bairro.')
    .max(100, 'Use no máximo 100 caracteres.'),
  cidade: z
    .string()
    .trim()
    .min(1, 'Informe a cidade.')
    .max(100, 'Use no máximo 100 caracteres.'),
  estado: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .pipe(z.string().regex(/^[A-Z]{2}$/, 'Use a sigla do estado com 2 letras.')),
  complemento: optionalText,
  referencia: optionalText,
});

export const dadosRestauranteSchema = z.object({
  nome_fantasia: z
    .string()
    .trim()
    .min(1, 'Informe o nome fantasia.')
    .max(150, 'Use no máximo 150 caracteres.'),
  razao_social: z
    .string()
    .trim()
    .min(1, 'Informe a razão social.')
    .max(150, 'Use no máximo 150 caracteres.'),
  cnpj: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z.string().length(14, 'Informe 14 números.'),
  ),
  telefone_restaurante: z
    .string()
    .trim()
    .min(1, 'Informe o telefone do restaurante.')
    .max(20, 'Use no máximo 20 caracteres.'),
  descricao: optionalText,
  foto_url: optionalText,
});

export const criarSolicitacaoSchema = dadosGestorSchema
  .merge(dadosEnderecoSchema)
  .merge(dadosRestauranteSchema);

export type DadosGestorFormData = z.infer<typeof dadosGestorSchema>;
export type DadosEnderecoFormData = z.infer<typeof dadosEnderecoSchema>;
export type DadosRestauranteFormData = z.infer<typeof dadosRestauranteSchema>;
export type CriarSolicitacaoFormData = z.infer<typeof criarSolicitacaoSchema>;
