import { z } from 'zod';

import { somenteDigitos } from '../../../utils/masks';

export const criarClienteSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Informe o e-mail.')
    .email('Informe um e-mail válido.'),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  nome_completo: z.string().trim().min(3, 'Informe o nome completo.'),
  cpf: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z.string().length(11, 'O CPF deve conter 11 dígitos.'),
  ),
  telefone: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z
      .string()
      .min(10, 'Informe um telefone com DDD.')
      .max(11, 'Informe um telefone válido com até 11 dígitos.'),
  ),
  data_nascimento: z.string().optional(),
});

export const atualizarClienteSchema = z.object({
  nome_completo: z.string().trim().min(3, 'Informe o nome completo.'),
  cpf: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z.string().length(11, 'O CPF deve conter 11 dígitos.'),
  ),
  data_nascimento: z.string().optional(),
});

export type CriarClienteFormData = z.infer<typeof criarClienteSchema>;
export type AtualizarClienteFormData = z.infer<typeof atualizarClienteSchema>;
