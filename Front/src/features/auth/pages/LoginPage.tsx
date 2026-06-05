import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { authService } from '../services/authService';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';

export function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setMessage(null);

    try {
      await authService.login(data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Nao foi possivel entrar.',
      );
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-brand-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-brand-100 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <Link to="/" className="text-sm font-semibold text-brand-700">
            Delifit
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-slate-950">Entrar</h1>
          <p className="mt-2 text-sm text-slate-600">
            Acesse o painel web para acompanhar usuarios, pedidos e
            restaurantes.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            error={errors.senha?.message}
            {...register('senha')}
          />

          {message ? (
            <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {message}
            </p>
          ) : null}

          <Button type="submit" isLoading={isSubmitting}>
            Entrar
          </Button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Ainda nao tem conta?{' '}
          <Link to="/cadastro" className="font-semibold text-brand-700">
            Criar cadastro
          </Link>
        </p>
      </section>
    </main>
  );
}
