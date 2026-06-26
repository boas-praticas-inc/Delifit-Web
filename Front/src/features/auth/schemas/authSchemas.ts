import { z } from 'zod';

import { somenteDigitos } from '../../../utils/masks';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Informe o e-mail.')
    .email('Informe um e-mail válido.'),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
});

export const registerSchema = z.object({
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
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  data_nascimento: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
