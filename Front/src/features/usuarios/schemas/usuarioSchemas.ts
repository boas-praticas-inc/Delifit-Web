import { z } from 'zod';

export const tipoUsuarioValues = [
  'CLIENTE',
  'RESTAURANTE',
  'ENTREGADOR',
  'ADMIN',
] as const;

export const criarUsuarioSchema = z.object({
  email: z
    .string()
    .min(1, 'Informe o email.')
    .email('Informe um email valido.'),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  tipo_usuario: z.enum(tipoUsuarioValues, {
    required_error: 'Selecione o tipo de usuario.',
  }),
});

export type CriarUsuarioFormData = z.infer<typeof criarUsuarioSchema>;
