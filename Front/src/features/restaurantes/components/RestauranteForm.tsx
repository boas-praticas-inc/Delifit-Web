import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Textarea } from '../../../components/common/Textarea';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarCnpj, formatarTelefone } from '../../../utils/masks';
import { enderecoService } from '../../enderecos/services/enderecoService';
import type { Endereco } from '../../enderecos/types/enderecoTypes';
import { gestorService } from '../../gestores/services/gestorService';
import type { Gestor } from '../../gestores/types/gestorTypes';
import { solicitacaoService } from '../../solicitacoes/services/solicitacaoService';
import type { Solicitacao } from '../../solicitacoes/types/solicitacaoTypes';
import {
  atualizarRestauranteSchema,
  criarRestauranteSchema,
  type AtualizarRestauranteFormData,
  type CriarRestauranteFormData,
} from '../schemas/restauranteSchemas';

type Props =
  | {
      mode: 'create';
      defaultValues?: Partial<CriarRestauranteFormData>;
      formError?: string | null;
      submitLabel: string;
      onSubmit: (data: CriarRestauranteFormData) => Promise<void>;
      onReset?: () => void;
    }
  | {
      mode: 'edit';
      defaultValues?: Partial<AtualizarRestauranteFormData>;
      formError?: string | null;
      submitLabel: string;
      onSubmit: (data: AtualizarRestauranteFormData) => Promise<void>;
      onReset?: () => void;
      relationLabels: {
        gestor: string;
        endereco: string;
        solicitacao: string;
      };
    };

type RestauranteFormValues = Partial<
  CriarRestauranteFormData & AtualizarRestauranteFormData
>;

export function RestauranteForm(props: Props) {
  const [gestores, setGestores] = useState<Gestor[]>([]);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(props.mode === 'create');
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const schema =
    props.mode === 'create'
      ? criarRestauranteSchema
      : atualizarRestauranteSchema;

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<RestauranteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: props.defaultValues,
  });

  useEffect(() => {
    reset(props.defaultValues);
  }, [props.defaultValues, reset]);

  useEffect(() => {
    if (props.mode !== 'create') {
      return;
    }

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
  }, [props.mode]);

  function getErrorMessage(value: unknown) {
    return typeof value === 'string' ? value : undefined;
  }

  return (
    <form
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5"
      onSubmit={handleSubmit((data) =>
        props.mode === 'create'
          ? props.onSubmit(data as CriarRestauranteFormData)
          : props.onSubmit(data as AtualizarRestauranteFormData),
      )}
    >
      {props.mode === 'create' ? (
        <>
          <Select
            label="Gestor"
            disabled={isLoadingOptions}
            error={getErrorMessage(errors.gestor_id?.message)}
            {...register('gestor_id')}
          >
            <option value="">Selecione um gestor</option>
            {gestores.map((gestor) => (
              <option key={gestor.id} value={gestor.id}>
                {gestor.nome_completo}
              </option>
            ))}
          </Select>

          <Select
            label="Endereço"
            disabled={isLoadingOptions}
            error={getErrorMessage(errors.endereco_id?.message)}
            {...register('endereco_id')}
          >
            <option value="">Selecione um endereço</option>
            {enderecos.map((endereco) => (
              <option key={endereco.id} value={endereco.id}>
                {endereco.logradouro}, {endereco.numero} - {endereco.bairro}
              </option>
            ))}
          </Select>

          <Select
            label="Solicitação de adesão"
            disabled={isLoadingOptions}
            error={getErrorMessage(errors.solicitacao_adesao_id?.message)}
            {...register('solicitacao_adesao_id')}
          >
            <option value="">Sem vinculação</option>
            {solicitacoes.map((solicitacao) => (
              <option key={solicitacao.id} value={solicitacao.id}>
                {solicitacao.nome_fantasia} - {solicitacao.status_solicitacao}
              </option>
            ))}
          </Select>
        </>
      ) : (
        <div className="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4">
          <Input
            label="Gestor vinculado"
            value={props.relationLabels.gestor}
            readOnly
          />
          <Input
            label="Endereço vinculado"
            value={props.relationLabels.endereco}
            readOnly
          />
          <Input
            label="Solicitação vinculada"
            value={props.relationLabels.solicitacao}
            readOnly
          />
        </div>
      )}

      {optionsError ? <Alert variant="error">{optionsError}</Alert> : null}

      <Input
        label="Nome fantasia"
        error={getErrorMessage(errors.nome_fantasia?.message)}
        {...register('nome_fantasia')}
      />
      <Input
        label="Razão social"
        error={getErrorMessage(errors.razao_social?.message)}
        {...register('razao_social')}
      />
      <Controller
        control={control}
        name="cnpj"
        render={({ field }) => (
          <Input
            label="CNPJ"
            inputMode="numeric"
            maxLength={18}
            placeholder="00.000.000/0000-00"
            error={getErrorMessage(errors.cnpj?.message)}
            {...field}
            value={formatarCnpj(field.value ?? '')}
            onChange={(event) =>
              field.onChange(formatarCnpj(event.target.value))
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
            error={getErrorMessage(errors.telefone?.message)}
            {...field}
            value={formatarTelefone(field.value ?? '')}
            onChange={(event) =>
              field.onChange(formatarTelefone(event.target.value))
            }
          />
        )}
      />
      <Input
        label="URL da foto"
        type="url"
        error={getErrorMessage(errors.foto_url?.message)}
        {...register('foto_url')}
      />
      <Textarea
        label="Descrição"
        error={getErrorMessage(errors.descricao?.message)}
        {...register('descricao')}
      />

      {props.formError ? <Alert variant="error">{props.formError}</Alert> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" isLoading={isSubmitting}>
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
