import { z } from 'zod';

import { tipoUsuarioValues } from '../../usuarios/schemas/usuarioSchemas';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Informe o e-mail.')
    .email('Informe um e-mail válido.'),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
});

export const registerSchema = loginSchema.extend({
  tipo_usuario: z.enum(tipoUsuarioValues, {
    required_error: 'Selecione o tipo de usuário.',
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
