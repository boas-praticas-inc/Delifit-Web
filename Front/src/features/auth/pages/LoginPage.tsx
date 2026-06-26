import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { getApiErrorMessage } from '../../../lib/api';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';
import { authService } from '../services/authService';
import { salvarTokenAcesso, salvarUsuarioLogado } from '../utils/session';

type LoginLocationState = {
  message?: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const state = location.state as LoginLocationState | null;
    if (state?.message) {
      setMessage(state.message);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  async function onSubmit(data: LoginFormData) {
    setMessage(null);

    try {
      const { access_token, usuario } = await authService.login(data);
      salvarTokenAcesso(access_token);
      salvarUsuarioLogado(usuario);

      if (usuario.tipo_usuario === 'ADMIN') {
        navigate('/dashboard');
        return;
      }

      if (usuario.tipo_usuario === 'GESTOR') {
        navigate('/gestor');
        return;
      }

      setMessage('Este perfil ainda não possui área web configurada.');
    } catch (error) {
      setMessage(getApiErrorMessage(error));
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
            Acesse sua área usando e-mail e senha cadastrados.
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

        <div className="mt-5 border-t border-slate-200 pt-5">
          <Link
            to="/solicitar-adesao"
            className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Solicitar adesão
          </Link>
        </div>
      </section>
    </main>
  );
}
