import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { adminService } from '../../admins/services/adminService';
import { clienteService } from '../../clientes/services/clienteService';
import { gestorService } from '../../gestores/services/gestorService';
import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarCpf, formatarTelefone, somenteDigitos } from '../../../utils/masks';
import {
  criarUsuarioSchema,
  tipoUsuarioValues,
  type CriarUsuarioFormData,
} from '../schemas/usuarioSchemas';
import { usuarioService } from '../services/usuarioService';

const clienteComplementoSchema = z.object({
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

const gestorComplementoSchema = z.object({
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
});

const adminComplementoSchema = z.object({
  nome_completo: z.string().trim().min(3, 'Informe o nome completo.'),
  cargo: z.string().trim().max(100, 'Informe um cargo com até 100 caracteres.').optional(),
});

const criarUsuarioComPerfilSchema = z.discriminatedUnion('tipo_usuario', [
  criarUsuarioSchema.extend({
    tipo_usuario: z.literal('CLIENTE'),
    ...clienteComplementoSchema.shape,
  }),
  criarUsuarioSchema.extend({
    tipo_usuario: z.literal('GESTOR'),
    ...gestorComplementoSchema.shape,
  }),
  criarUsuarioSchema.extend({
    tipo_usuario: z.literal('ADMIN'),
    ...adminComplementoSchema.shape,
  }),
]);

type CriarUsuarioComPerfilFormData = z.infer<typeof criarUsuarioComPerfilSchema>;
type CriarUsuarioComPerfilFormValues = {
  email?: string;
  senha?: string;
  tipo_usuario?: 'CLIENTE' | 'GESTOR' | 'ADMIN';
  nome_completo?: string;
  cpf?: string;
  telefone?: string;
  data_nascimento?: string;
  cargo?: string;
};

export function CriarUsuarioPage() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<CriarUsuarioComPerfilFormValues>({
    resolver: zodResolver(criarUsuarioComPerfilSchema),
    defaultValues: {
      tipo_usuario: 'CLIENTE',
      nome_completo: '',
      cpf: '',
      telefone: '',
      data_nascimento: '',
      cargo: '',
    },
  });

  const tipoUsuario = watch('tipo_usuario');

  async function onSubmit(data: CriarUsuarioComPerfilFormData) {
    setError(null);
    setFeedback(null);

    try {
      const usuario = await usuarioService.criarUsuario({
        email: data.email,
        senha: data.senha,
        tipo_usuario: data.tipo_usuario,
      } satisfies CriarUsuarioFormData);

      if (data.tipo_usuario === 'CLIENTE') {
        await clienteService.criarCliente({
          usuario_id: usuario.id,
          nome_completo: data.nome_completo,
          cpf: data.cpf,
          telefone: data.telefone,
          data_nascimento: data.data_nascimento || null,
        });
      }

      if (data.tipo_usuario === 'GESTOR') {
        await gestorService.criarGestor({
          usuario_id: usuario.id,
          nome_completo: data.nome_completo,
          cpf: data.cpf,
          telefone: data.telefone,
        });
      }

      if (data.tipo_usuario === 'ADMIN') {
        await adminService.criarAdmin({
          usuario_id: usuario.id,
          nome_completo: data.nome_completo,
          cargo: data.cargo?.trim() ? data.cargo.trim() : null,
        });
      }

      setFeedback('Usuário e cadastro complementar criados com sucesso.');
      reset({
        tipo_usuario: 'CLIENTE',
        email: '',
        senha: '',
        nome_completo: '',
        cpf: '',
        telefone: '',
        data_nascimento: '',
        cargo: '',
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <div>
        <Link to="/" className="text-sm font-semibold text-brand-700">
          Voltar para o início
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Adicionar usuário
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          O formulário cria o usuário base e também o cadastro complementar na
          tabela correta, conforme o tipo selecionado.
        </p>
      </div>

      <form
        className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5"
        onSubmit={handleSubmit((data) =>
          onSubmit(data as CriarUsuarioComPerfilFormData),
        )}
      >
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          error={errors.senha?.message}
          {...register('senha')}
        />
        <Select
          label="Tipo de usuário"
          error={errors.tipo_usuario?.message}
          {...register('tipo_usuario')}
        >
          {tipoUsuarioValues.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </Select>

        <Input
          label="Nome completo"
          error={errors.nome_completo?.message}
          {...register('nome_completo')}
        />

        {tipoUsuario === 'CLIENTE' || tipoUsuario === 'GESTOR' ? (
          <>
            <Controller
              control={control}
              name="cpf"
              render={({ field }) => (
                <Input
                  label="CPF"
                  inputMode="numeric"
                  maxLength={14}
                  placeholder="000.000.000-00"
                  error={errors.cpf?.message}
                  {...field}
                  value={formatarCpf(field.value ?? '')}
                  onChange={(event) =>
                    field.onChange(formatarCpf(event.target.value))
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="telefone"
              render={({ field }) => (
                <Input
                  label="Telefone"
                  inputMode="tel"
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                  error={errors.telefone?.message}
                  {...field}
                  value={formatarTelefone(field.value ?? '')}
                  onChange={(event) =>
                    field.onChange(formatarTelefone(event.target.value))
                  }
                />
              )}
            />
          </>
        ) : null}

        {tipoUsuario === 'CLIENTE' ? (
          <Input
            label="Data de nascimento"
            type="date"
            error={errors.data_nascimento?.message}
            {...register('data_nascimento')}
          />
        ) : null}

        {tipoUsuario === 'ADMIN' ? (
          <Input
            label="Cargo"
            error={errors.cargo?.message}
            {...register('cargo')}
          />
        ) : null}

        {feedback ? <Alert variant="success">{feedback}</Alert> : null}
        {error ? <Alert variant="error">{error}</Alert> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" isLoading={isSubmitting}>
            Salvar usuário
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              reset({
                tipo_usuario: 'CLIENTE',
                email: '',
                senha: '',
                nome_completo: '',
                cpf: '',
                telefone: '',
                data_nascimento: '',
                cargo: '',
              })
            }
          >
            Limpar
          </Button>
        </div>
      </form>
    </section>
  );
}
