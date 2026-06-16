import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { getApiErrorMessage } from '../../../lib/api';
import { tipoUsuarioValues } from '../../usuarios/schemas/usuarioSchemas';
import { authService } from '../services/authService';
import { registerSchema, type RegisterFormData } from '../schemas/authSchemas';

export function RegisterPage() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tipo_usuario: 'CLIENTE',
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setError(null);
    setFeedback(null);

    try {
      await authService.register(data);
      setFeedback('Cadastro criado com sucesso.');
      reset({ email: '', senha: '', tipo_usuario: 'CLIENTE' });
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
            Cadastre um usuário inicial para testar a integração com a API.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
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
