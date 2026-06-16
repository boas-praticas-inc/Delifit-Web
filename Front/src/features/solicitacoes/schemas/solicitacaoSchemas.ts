import { z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))
  .optional();

export const criarSolicitacaoSchema = z.object({
  gestor_id: z.coerce
    .number({ invalid_type_error: 'Informe o ID do gestor.' })
    .int('Informe um ID valido.')
    .positive('Informe um ID valido.'),
  nome_fantasia: z
    .string()
    .trim()
    .min(1, 'Informe o nome fantasia.')
    .max(150, 'Use no maximo 150 caracteres.'),
  razao_social: z
    .string()
    .trim()
    .min(1, 'Informe a razao social.')
    .max(150, 'Use no maximo 150 caracteres.'),
  cnpj: z
    .string()
    .trim()
    .regex(/^[0-9]{14}$/, 'Informe 14 numeros, sem pontuacao.'),
  telefone: z
    .string()
    .trim()
    .min(1, 'Informe o telefone.')
    .max(20, 'Use no maximo 20 caracteres.'),
  cep: z
    .string()
    .trim()
    .regex(/^[0-9]{8}$/, 'Informe 8 numeros, sem pontuacao.'),
  logradouro: z
    .string()
    .trim()
    .min(1, 'Informe o logradouro.')
    .max(150, 'Use no maximo 150 caracteres.'),
  numero: z
    .string()
    .trim()
    .min(1, 'Informe o numero.')
    .max(20, 'Use no maximo 20 caracteres.'),
  bairro: z
    .string()
    .trim()
    .min(1, 'Informe o bairro.')
    .max(100, 'Use no maximo 100 caracteres.'),
  cidade: z
    .string()
    .trim()
    .min(1, 'Informe a cidade.')
    .max(100, 'Use no maximo 100 caracteres.'),
  estado: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .pipe(z.string().regex(/^[A-Z]{2}$/, 'Use a sigla do estado com 2 letras.')),
  complemento: optionalText,
  referencia: optionalText,
  descricao: optionalText,
  foto_url: optionalText,
});

export type CriarSolicitacaoFormData = z.infer<typeof criarSolicitacaoSchema>;
