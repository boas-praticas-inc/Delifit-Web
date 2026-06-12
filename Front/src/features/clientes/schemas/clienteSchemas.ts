import { z } from 'zod';

export const criarClienteSchema = z.object({
  email: z.string().min(1, 'Informe o email.').email('Informe um email valido.'),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  nome_completo: z.string().min(1, 'Informe o nome completo.'),
  cpf: z.string().regex(/^[0-9]{11}$/, 'O CPF deve conter 11 digitos.'),
  telefone: z.string().min(1, 'Informe o telefone.'),
  data_nascimento: z.string().optional(),
});

export const atualizarClienteSchema = z.object({
  usuario_id: z.coerce.number().int().positive('Informe o ID do usuario.'),
  nome_completo: z.string().min(1, 'Informe o nome completo.'),
  cpf: z.string().regex(/^[0-9]{11}$/, 'O CPF deve conter 11 digitos.'),
  telefone: z.string().min(1, 'Informe o telefone.'),
  data_nascimento: z.string().optional(),
});

export type CriarClienteFormData = z.infer<typeof criarClienteSchema>;
export type AtualizarClienteFormData = z.infer<typeof atualizarClienteSchema>;
