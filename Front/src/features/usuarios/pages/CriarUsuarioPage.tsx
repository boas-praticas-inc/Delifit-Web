import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { getApiErrorMessage } from '../../../lib/api';
import {
  criarUsuarioSchema,
  tipoUsuarioValues,
  type CriarUsuarioFormData,
} from '../schemas/usuarioSchemas';
import { usuarioService } from '../services/usuarioService';

export function CriarUsuarioPage() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<CriarUsuarioFormData>({
    resolver: zodResolver(criarUsuarioSchema),
    defaultValues: {
      tipo_usuario: 'CLIENTE',
    },
  });

  async function onSubmit(data: CriarUsuarioFormData) {
    setError(null);
    setFeedback(null);

    try {
      await usuarioService.criarUsuario(data);
      setFeedback('Usuario criado com sucesso.');
      reset({ email: '', senha: '', tipo_usuario: 'CLIENTE' });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <div>
        <Link to="/usuarios" className="text-sm font-semibold text-brand-700">
          Voltar para usuarios
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Criar usuario
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Envie apenas email, senha e tipo de usuario para o backend.
        </p>
      </div>

      <form
        className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          autoComplete="new-password"
          error={errors.senha?.message}
          {...register('senha')}
        />

        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          <span>Tipo de usuario</span>
          <select
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            {...register('tipo_usuario')}
          >
            {tipoUsuarioValues.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          {errors.tipo_usuario?.message ? (
            <span className="text-xs text-red-600">
              {errors.tipo_usuario.message}
            </span>
          ) : null}
        </label>

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

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" isLoading={isSubmitting}>
            Salvar usuario
          </Button>
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Limpar
          </Button>
        </div>
      </form>
    </section>
  );
}
