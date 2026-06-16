import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { getApiErrorMessage } from '../../../lib/api';
import { somenteDigitos } from '../../../utils/masks';
import { gestorService } from '../../gestores/services/gestorService';
import {
  registerSchema,
  type RegisterFormData,
} from '../schemas/authSchemas';
import { usuarioService } from '../../usuarios/services/usuarioService';

export function RegisterPage() {
  const navigate = useNavigate();
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
      tipo_usuario: 'GESTOR',
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setError(null);
    setFeedback(null);

    try {
      const usuario = await usuarioService.criarUsuario(data);
      const gestor = await gestorService.criarGestor({
        usuario_id: usuario.id,
        nome_completo: data.nome_completo,
        cpf: somenteDigitos(data.cpf),
        telefone: somenteDigitos(data.telefone),
      });
      setFeedback('Cadastro de gestor criado com sucesso.');
      reset({
        email: '',
        senha: '',
        tipo_usuario: 'GESTOR',
        nome_completo: '',
        cpf: '',
        telefone: '',
      });
      navigate('/solicitar-adesao', {
        state: { gestorId: gestor.id },
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
          <h1 className="mt-3 text-2xl font-bold text-slate-950">Cadastre-se</h1>
          <p className="mt-2 text-sm text-slate-600">
            Crie seu usuário de gestor para iniciar a solicitação de adesão do
            restaurante.
          </p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nome completo"
            error={errors.nome_completo?.message}
            {...register('nome_completo')}
          />
          <Input
            label="CPF"
            inputMode="numeric"
            maxLength={14}
            placeholder="000.000.000-00"
            error={errors.cpf?.message}
            {...register('cpf')}
          />
          <Input
            label="Telefone"
            inputMode="tel"
            maxLength={15}
            placeholder="(00) 00000-0000"
            error={errors.telefone?.message}
            {...register('telefone')}
          />
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
          <Input label="Tipo de usuário" readOnly value="GESTOR" />

          {feedback ? (
            <Alert variant="success">{feedback}</Alert>
          ) : null}
          {error ? (
            <Alert variant="error">{error}</Alert>
          ) : null}

          <Button type="submit" isLoading={isSubmitting}>
            Continuar
          </Button>
        </form>
      </section>
    </main>
  );
}
