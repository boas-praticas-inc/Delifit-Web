import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Textarea } from '../../../components/common/Textarea';
import { getApiErrorMessage } from '../../../lib/api';
import {
  criarSolicitacaoSchema,
  type CriarSolicitacaoFormData,
} from '../schemas/solicitacaoSchemas';
import { solicitacaoService } from '../services/solicitacaoService';

type LocationState = {
  gestorId?: number;
};

export function SolicitarAdesaoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [feedback, setFeedback] = useState<{
    message: string;
    variant: 'error' | 'success';
  } | null>(null);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<CriarSolicitacaoFormData>({
    resolver: zodResolver(criarSolicitacaoSchema),
  });

  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.gestorId) {
      setValue('gestor_id', state.gestorId);
    }
  }, [location.state, setValue]);

  async function onSubmit(data: CriarSolicitacaoFormData) {
    setFeedback(null);

    try {
      await solicitacaoService.criarSolicitacao(data);
      reset();
      setFeedback({
        message:
          'Solicitação enviada com sucesso. Um administrador irá analisar o cadastro.',
        variant: 'success',
      });
      navigate('/solicitacoes');
    } catch (error) {
      setFeedback({
        message: getApiErrorMessage(error),
        variant: 'error',
      });
    }
  }

  return (
    <main className="min-h-screen bg-brand-50 px-4 py-8">
      <section className="mx-auto grid w-full max-w-4xl gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/cadastro" className="text-sm font-semibold text-brand-700">
              Delifit
            </Link>
            <h1 className="mt-3 text-2xl font-bold text-slate-950">
              Solicitar adesão
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Preencha os dados do restaurante e do endereço. O restaurante só
              será criado após aprovação.
            </p>
          </div>
          <Link
            to="/cadastro"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-900 transition hover:bg-brand-50"
          >
            Voltar ao cadastro
          </Link>
        </div>

        <form
          className="grid gap-6 rounded-lg border border-brand-100 bg-white p-6 shadow-soft"
          onSubmit={handleSubmit(onSubmit)}
        >
          {feedback ? <Alert variant={feedback.variant}>{feedback.message}</Alert> : null}

          <fieldset className="grid gap-4">
            <legend className="text-base font-bold text-slate-950">
              Responsável
            </legend>
            <Input
              label="ID do gestor"
              type="number"
              min={1}
              error={errors.gestor_id?.message}
              {...register('gestor_id')}
            />
          </fieldset>

          <fieldset className="grid gap-4">
            <legend className="text-base font-bold text-slate-950">
              Dados do restaurante
            </legend>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Nome fantasia"
                error={errors.nome_fantasia?.message}
                {...register('nome_fantasia')}
              />
              <Input
                label="Razão social"
                error={errors.razao_social?.message}
                {...register('razao_social')}
              />
              <Input
                label="CNPJ"
                inputMode="numeric"
                placeholder="Somente números"
                error={errors.cnpj?.message}
                {...register('cnpj')}
              />
              <Input
                label="Telefone"
                error={errors.telefone?.message}
                {...register('telefone')}
              />
            </div>
          </fieldset>

          <fieldset className="grid gap-4">
            <legend className="text-base font-bold text-slate-950">
              Endereço
            </legend>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="CEP"
                inputMode="numeric"
                placeholder="Somente números"
                error={errors.cep?.message}
                {...register('cep')}
              />
              <Input
                label="Logradouro"
                error={errors.logradouro?.message}
                {...register('logradouro')}
              />
              <Input
                label="Número"
                error={errors.numero?.message}
                {...register('numero')}
              />
              <Input
                label="Bairro"
                error={errors.bairro?.message}
                {...register('bairro')}
              />
              <Input
                label="Cidade"
                error={errors.cidade?.message}
                {...register('cidade')}
              />
              <Input
                label="Estado"
                maxLength={2}
                placeholder="SE"
                error={errors.estado?.message}
                {...register('estado')}
              />
              <Input
                label="Complemento"
                error={errors.complemento?.message}
                {...register('complemento')}
              />
              <Input
                label="Referência"
                error={errors.referencia?.message}
                {...register('referencia')}
              />
            </div>
          </fieldset>

          <fieldset className="grid gap-4">
            <legend className="text-base font-bold text-slate-950">
              Informações adicionais
            </legend>
            <Textarea
              label="Descrição"
              error={errors.descricao?.message}
              {...register('descricao')}
            />
            <Input
              label="URL da foto"
              type="url"
              error={errors.foto_url?.message}
              {...register('foto_url')}
            />
          </fieldset>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <Link
              to="/"
              className="inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </Link>
            <Button type="submit" isLoading={isSubmitting}>
              Enviar solicitação
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
