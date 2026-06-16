import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { getApiErrorMessage } from '../../../lib/api';
import { somenteDigitos } from '../../../utils/masks';
import { gestorService } from '../../gestores/services/gestorService';
import {
  criarUsuarioSchema,
  tipoUsuarioValues,
  type CriarUsuarioFormData,
} from '../schemas/usuarioSchemas';
import { usuarioService } from '../services/usuarioService';

export function CriarUsuarioPage() {
  const navigate = useNavigate();
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
      tipo_usuario: 'GESTOR',
    },
  });

  async function onSubmit(data: CriarUsuarioFormData) {
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

      reset({
        email: '',
        senha: '',
        tipo_usuario: 'GESTOR',
        nome_completo: '',
        cpf: '',
        telefone: '',
      });
      setFeedback('Gestor criado com sucesso. Agora complete a solicitação de adesão.');
      navigate('/solicitar-adesao', {
        state: {
          gestorId: gestor.id,
        },
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
          Cadastrar gestor
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Crie o usuário do gestor para, em seguida, preencher os dados da solicitação do restaurante.
        </p>
      </div>

      {feedback ? <Alert variant="success">{feedback}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      <form
        className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5"
        onSubmit={handleSubmit(onSubmit)}
      >
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

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <Link
            to="/"
            className="inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Cancelar
          </Link>
          <Button type="submit" isLoading={isSubmitting}>
            Continuar
          </Button>
        </div>
      </form>
    </section>
  );
}
