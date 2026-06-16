import { z } from 'zod';

export const tipoUsuarioValues = ['GESTOR'] as const;

export const criarUsuarioSchema = z.object({
  nome_completo: z.string().trim().min(3, 'Informe o nome completo.'),
  cpf: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ''))
    .refine((value) => value.length === 11, {
      message: 'O CPF deve conter 11 dígitos.',
    }),
  telefone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ''))
    .refine((value) => value.length >= 10 && value.length <= 11, {
      message: 'Informe um telefone válido com DDD.',
    }),
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
