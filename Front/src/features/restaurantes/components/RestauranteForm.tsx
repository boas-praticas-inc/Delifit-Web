import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef, useState } from 'react';
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
      onSubmit: (
        data: CriarRestauranteFormData,
        fotoArquivo: File | null,
      ) => Promise<void>;
      onReset?: () => void;
    }
  | {
      mode: 'edit';
      defaultValues?: Partial<AtualizarRestauranteFormData>;
      formError?: string | null;
      submitLabel: string;
      onSubmit: (
        data: AtualizarRestauranteFormData,
        fotoArquivo: File | null,
      ) => Promise<void>;
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

const TAMANHO_MAXIMO_IMAGEM_BYTES = 5 * 1024 * 1024;
const TIPOS_IMAGEM_ACEITOS = ['image/png', 'image/jpeg', 'image/webp'];
const INPUT_ACCEPT = '.png,.jpg,.jpeg,.webp';

export function RestauranteForm(props: Props) {
  const [gestores, setGestores] = useState<Gestor[]>([]);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(props.mode === 'create');
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(
    props.defaultValues?.foto_url ?? null,
  );
  const [fotoErro, setFotoErro] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const schema =
    props.mode === 'create' ? criarRestauranteSchema : atualizarRestauranteSchema;

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<RestauranteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: props.defaultValues,
  });

  const restaurarEstadoDaImagem = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const fotoUrlInicial = props.defaultValues?.foto_url ?? null;
    setFotoArquivo(null);
    setFotoErro(null);
    setFotoPreviewUrl(fotoUrlInicial);
    setValue('foto_url', fotoUrlInicial, { shouldDirty: false });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [props.defaultValues?.foto_url, setValue]);

  useEffect(() => {
    reset(props.defaultValues);
    restaurarEstadoDaImagem();
  }, [props.defaultValues, reset, restaurarEstadoDaImagem]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (props.mode !== 'create') {
      return;
    }

    async function carregarOpcoes() {
      try {
        const [gestoresData, enderecosData, solicitacoesData] = await Promise.all([
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

  function processarSelecaoImagem(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivoSelecionado = event.target.files?.[0] ?? null;

    if (!arquivoSelecionado) {
      return;
    }

    if (!TIPOS_IMAGEM_ACEITOS.includes(arquivoSelecionado.type)) {
      setFotoErro('Selecione uma imagem PNG, JPG ou WEBP.');
      event.target.value = '';
      return;
    }

    if (arquivoSelecionado.size > TAMANHO_MAXIMO_IMAGEM_BYTES) {
      setFotoErro('A imagem deve ter no máximo 5 MB.');
      event.target.value = '';
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(arquivoSelecionado);
    objectUrlRef.current = previewUrl;
    setFotoErro(null);
    setFotoArquivo(arquivoSelecionado);
    setFotoPreviewUrl(previewUrl);
  }

  function limparImagem() {
    if (fotoArquivo) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      const fotoUrlInicial = props.defaultValues?.foto_url ?? null;
      setFotoArquivo(null);
      setFotoErro(null);
      setFotoPreviewUrl(fotoUrlInicial);
      setValue('foto_url', fotoUrlInicial, { shouldDirty: true });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setFotoErro(null);
    setFotoPreviewUrl(null);
    setValue('foto_url', null, { shouldDirty: true });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <form
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5"
      onSubmit={handleSubmit((data) =>
        props.mode === 'create'
          ? props.onSubmit(data as CriarRestauranteFormData, fotoArquivo)
          : props.onSubmit(data as AtualizarRestauranteFormData, fotoArquivo),
      )}
    >
      <input type="hidden" {...register('foto_url')} />

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
          <Input label="Gestor vinculado" value={props.relationLabels.gestor} readOnly />
          <Input label="Endereço vinculado" value={props.relationLabels.endereco} readOnly />
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
            onChange={(event) => field.onChange(formatarCnpj(event.target.value))}
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
            onChange={(event) => field.onChange(formatarTelefone(event.target.value))}
          />
        )}
      />

      <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">Foto do restaurante</p>
            <p className="text-xs text-slate-500">
              Envie uma imagem PNG, JPG ou WEBP com até 5 MB. A URL será gerada automaticamente.
            </p>
          </div>
          {fotoPreviewUrl ? (
            <Button type="button" variant="secondary" onClick={limparImagem}>
              {fotoArquivo ? 'Descartar nova imagem' : 'Remover imagem'}
            </Button>
          ) : null}
        </div>

        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
          <span>Selecionar imagem</span>
          <input
            ref={fileInputRef}
            type="file"
            accept={INPUT_ACCEPT}
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            onChange={processarSelecaoImagem}
          />
        </label>

        {fotoErro ? <Alert variant="error">{fotoErro}</Alert> : null}

        {fotoPreviewUrl ? (
          <div className="grid gap-2">
            <img
              src={fotoPreviewUrl}
              alt="Pré-visualização da imagem do restaurante"
              className="h-48 w-full rounded-md border border-slate-200 object-cover"
            />
            {fotoArquivo ? (
              <p className="text-xs text-slate-500">
                Nova imagem selecionada: {fotoArquivo.name}
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Imagem atual do restaurante.
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
            Nenhuma imagem selecionada.
          </div>
        )}
      </div>

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
            restaurarEstadoDaImagem();
            props.onReset?.();
          }}
        >
          Limpar
        </Button>
      </div>
    </form>
  );
}


