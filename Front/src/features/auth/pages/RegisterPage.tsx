import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarCpf, formatarTelefone } from '../../../utils/masks';
import { authService } from '../services/authService';
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas';

export function RegisterPage() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setError(null);
    setFeedback(null);

    try {
      await authService.register(data);
      setFeedback('Cadastro criado com sucesso.');
      reset({
        nome_completo: '',
        cpf: '',
        telefone: '',
        senha: '',
        data_nascimento: '',
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-brand-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-brand-100 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <Link to="/" className="text-sm font-semibold text-brand-700">
            Delifit
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-slate-950">
            Criar cadastro
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Cadastre sua conta de cliente com telefone e senha.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nome completo"
            error={errors.nome_completo?.message}
            {...register('nome_completo')}
          />
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
                onChange={(event) => field.onChange(formatarCpf(event.target.value))}
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
          <Input
            label="Senha"
            type="password"
            autoComplete="new-password"
            error={errors.senha?.message}
            {...register('senha')}
          />
          <Input
            label="Data de nascimento"
            type="date"
            error={errors.data_nascimento?.message}
            {...register('data_nascimento')}
          />

          {feedback ? (
            <p className="rounded-md bg-brand-50 px-3 py-2 text-sm text-brand-900">
              {feedback}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <Button type="submit" isLoading={isSubmitting}>
            Cadastrar
          </Button>
        </form>
      </section>
    </main>
  );
}
