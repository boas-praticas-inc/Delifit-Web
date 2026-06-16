import { z } from 'zod';

import { criarUsuarioSchema } from '../../usuarios/schemas/usuarioSchemas';

export const loginSchema = criarUsuarioSchema.pick({
  email: true,
  senha: true,
});

export const registerSchema = criarUsuarioSchema;

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
