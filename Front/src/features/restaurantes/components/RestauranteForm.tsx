import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { getApiErrorMessage } from '../../../lib/api';
import { enderecoService } from '../../enderecos/services/enderecoService';
import type { Endereco } from '../../enderecos/types/enderecoTypes';
import { gestorService } from '../../gestores/services/gestorService';
import type { Gestor } from '../../gestores/types/gestorTypes';
import { solicitacaoService } from '../../solicitacoes/services/solicitacaoService';
import type { Solicitacao } from '../../solicitacoes/types/solicitacaoTypes';
import type {
  AtualizarRestauranteFormData,
  CriarRestauranteFormData,
} from '../schemas/restauranteSchemas';
import {
  atualizarRestauranteSchema,
  criarRestauranteSchema,
} from '../schemas/restauranteSchemas';

type Props =
  | {
      mode: 'create';
      defaultValues?: Partial<CriarRestauranteFormData>;
      submitLabel: string;
      onSubmit: (data: CriarRestauranteFormData) => Promise<void>;
      onReset?: () => void;
    }
  | {
      mode: 'edit';
      defaultValues?: Partial<AtualizarRestauranteFormData>;
      submitLabel: string;
      onSubmit: (data: AtualizarRestauranteFormData) => Promise<void>;
      onReset?: () => void;
    };

export function RestauranteForm(props: Props) {
  const [gestores, setGestores] = useState<Gestor[]>([]);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const schema =
    props.mode === 'create'
      ? criarRestauranteSchema
      : atualizarRestauranteSchema;

  const {
    formState: { errors },
    formState,
    handleSubmit,
    register,
    reset,
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: props.defaultValues,
  });

  useEffect(() => {
    reset(props.defaultValues);
  }, [props.defaultValues, reset]);

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [gestoresData, enderecosData, solicitacoesData] =
          await Promise.all([
            gestorService.listarGestores(),
            enderecoService.listarEnderecos(),
            solicitacaoService.listarSolicitacoes(),
          ]);

        setGestores(gestoresData);
        setEnderecos(enderecosData);
        setSolicitacoes(solicitacoesData);
      } catch (requestError) {
        setOptionsError(getApiErrorMessage(requestError));
      } finally {
        setIsLoadingOptions(false);
      }
    }

    void carregarOpcoes();
  }, []);

  function getErrorMessage(value: unknown) {
    return typeof value === 'string' ? value : undefined;
  }

  return (
    <form
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5"
      onSubmit={handleSubmit(props.onSubmit)}
    >
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        <span>Gestor</span>
        <select
          className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          disabled={isLoadingOptions}
          {...register('gestor_id')}
        >
          <option value="">Selecione um gestor</option>
          {gestores.map((gestor) => (
            <option key={gestor.id} value={gestor.id}>
              {gestor.nome_completo} - ID {gestor.id}
            </option>
          ))}
        </select>
        {getErrorMessage(errors.gestor_id?.message) ? (
          <span className="text-xs text-red-600">
            {getErrorMessage(errors.gestor_id?.message)}
          </span>
        ) : null}
      </label>

      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        <span>Endereço</span>
        <select
          className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          disabled={isLoadingOptions}
          {...register('endereco_id')}
        >
          <option value="">Selecione um endereço</option>
          {enderecos.map((endereco) => (
            <option key={endereco.id} value={endereco.id}>
              {endereco.logradouro}, {endereco.numero} - {endereco.bairro}
            </option>
          ))}
        </select>
        {getErrorMessage(errors.endereco_id?.message) ? (
          <span className="text-xs text-red-600">
            {getErrorMessage(errors.endereco_id?.message)}
          </span>
        ) : null}
      </label>

      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        <span>Solicitação de Adesão</span>
        <select
          className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          disabled={isLoadingOptions}
          {...register('solicitacao_adesao_id')}
        >
          <option value="">Sem Vinculação</option>
          {solicitacoes.map((solicitacao) => (
            <option key={solicitacao.id} value={solicitacao.id}>
              {solicitacao.nome_fantasia} - {solicitacao.status_solicitacao}
            </option>
          ))}
        </select>
        {getErrorMessage(errors.solicitacao_adesao_id?.message) ? (
          <span className="text-xs text-red-600">
            {getErrorMessage(errors.solicitacao_adesao_id?.message)}
          </span>
        ) : null}
      </label>

      {optionsError ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {optionsError}
        </p>
      ) : null}

      <Input
        label="Nome fantasia"
        error={getErrorMessage(errors.nome_fantasia?.message)}
        {...register('nome_fantasia')}
      />
      <Input
        label="Razão Social"
        error={getErrorMessage(errors.razao_social?.message)}
        {...register('razao_social')}
      />
      <Input
        label="CNPJ"
        inputMode="numeric"
        maxLength={14}
        error={getErrorMessage(errors.cnpj?.message)}
        {...register('cnpj')}
      />
      <Input
        label="Telefone"
        error={getErrorMessage(errors.telefone?.message)}
        {...register('telefone')}
      />
      <Input
        label="Foto URL"
        type="url"
        error={getErrorMessage(errors.foto_url?.message)}
        {...register('foto_url')}
      />
      <label className="grid gap-1.5 text-sm font-medium text-slate-700">
        <span>Descrição</span>
        <textarea
          className="min-h-28 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          {...register('descricao')}
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" isLoading={formState.isSubmitting}>
          {props.submitLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset(props.defaultValues);
            props.onReset?.();
          }}
        >
          Limpar
        </Button>
      </div>
    </form>
  );
}
