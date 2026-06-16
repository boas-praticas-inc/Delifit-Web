import { z } from 'zod';

export const tipoUsuarioValues = ['CLIENTE', 'GESTOR', 'ADMIN'] as const;

export const criarUsuarioSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Informe o e-mail.')
    .email('Informe um e-mail válido.'),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  tipo_usuario: z.enum(tipoUsuarioValues, {
    required_error: 'Selecione o tipo de usuário.',
  }),
});

export type CriarUsuarioFormData = z.infer<typeof criarUsuarioSchema>;
