import { z } from 'zod';

import { somenteDigitos } from '../../../utils/masks';

export const tipoUsuarioValues = ['CLIENTE', 'GESTOR', 'ADMIN'] as const;

export const criarUsuarioSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido.').optional(),
  telefone: z.preprocess(
    (value) => (typeof value === 'string' ? somenteDigitos(value) : value),
    z
      .string()
      .min(10, 'Informe um telefone com DDD.')
      .max(11, 'Informe um telefone válido com até 11 dígitos.')
      .optional(),
  ),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  tipo_usuario: z.enum(tipoUsuarioValues, {
    required_error: 'Selecione o tipo de usuário.',
  }),
}).superRefine((data, context) => {
  if (data.tipo_usuario === 'CLIENTE' && !data.telefone) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Informe o telefone do cliente.',
      path: ['telefone'],
    });
  }

  if (data.tipo_usuario !== 'CLIENTE' && !data.email) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Informe o e-mail.',
      path: ['email'],
    });
  }
});

export type CriarUsuarioFormData = z.infer<typeof criarUsuarioSchema>;
