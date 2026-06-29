import { zodResolver } from '@hookform/resolvers/zod';
import { type ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Textarea } from '../../../components/common/Textarea';
import { formatarCep, formatarCnpj, formatarData, formatarTelefone } from '../../../utils/masks';
import type { Endereco } from '../../enderecos/types/enderecoTypes';
import {
  atualizarPerfilRestauranteSchema,
  type AtualizarPerfilRestauranteFormData,
} from '../schemas/perfilRestauranteSchemas';
import type { Restaurante } from '../../restaurantes/types/restauranteTypes';

interface PerfilRestauranteFormProps {
  endereco: Endereco;
  feedback?: string | null;
  formError?: string | null;
  gestorNome: string;
  onSubmit: (
    data: AtualizarPerfilRestauranteFormData,
    fotoArquivo: File | null,
  ) => Promise<void>;
  restaurante: Restaurante;
}

const TAMANHO_MAXIMO_IMAGEM_BYTES = 5 * 1024 * 1024;
const TIPOS_IMAGEM_ACEITOS = ['image/png', 'image/jpeg', 'image/webp'];

const statusLabel: Record<string, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  BLOQUEADO: 'Bloqueado',
};

const statusClasses: Record<string, string> = {
  ATIVO: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  INATIVO: 'border-amber-200 bg-amber-50 text-amber-700',
  BLOQUEADO: 'border-red-200 bg-red-50 text-red-700',
};

const IMAGEM_PADRAO_RESTAURANTE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="800" y2="600" gradientUnits="userSpaceOnUse">
        <stop stop-color="#14532D"/>
        <stop offset="0.5" stop-color="#166534"/>
        <stop offset="1" stop-color="#84CC16"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bg)"/>
    <circle cx="655" cy="108" r="120" fill="#ffffff" opacity="0.10"/>
    <circle cx="110" cy="505" r="150" fill="#ffffff" opacity="0.08"/>
    <rect x="120" y="126" width="560" height="348" rx="34" fill="#ffffff" opacity="0.92"/>
    <rect x="170" y="182" width="460" height="160" rx="24" fill="#DCFCE7"/>
    <rect x="220" y="230" width="360" height="16" rx="8" fill="#166534" opacity="0.9"/>
    <rect x="255" y="274" width="290" height="16" rx="8" fill="#16A34A" opacity="0.75"/>
    <rect x="210" y="372" width="140" height="22" rx="11" fill="#E2E8F0"/>
    <rect x="374" y="372" width="216" height="22" rx="11" fill="#E2E8F0"/>
    <path d="M330 150c18 0 33 15 33 33v32h74v-32c0-18 15-33 33-33 18 0 33 15 33 33v46c0 18-15 33-33 33H330c-18 0-33-15-33-33v-46c0-18 15-33 33-33Z" fill="#15803D"/>
    <text x="400" y="432" text-anchor="middle" fill="#166534" font-family="Arial, sans-serif" font-size="34" font-weight="700">Delifit Restaurante</text>
  </svg>
`)}`;

function montarValoresIniciais(
  restaurante: Restaurante,
  endereco: Endereco,
): AtualizarPerfilRestauranteFormData {
  return {
    nome_fantasia: restaurante.nome_fantasia,
    razao_social: restaurante.razao_social,
    cnpj: restaurante.cnpj,
    telefone: restaurante.telefone,
    descricao: restaurante.descricao ?? '',
    foto_url: restaurante.foto_url ?? null,
    cep: endereco.cep,
    logradouro: endereco.logradouro,
    numero: endereco.numero,
    bairro: endereco.bairro,
    cidade: endereco.cidade,
    estado: endereco.estado,
    complemento: endereco.complemento ?? '',
    referencia: endereco.referencia ?? '',
  };
}

export function PerfilRestauranteForm(props: PerfilRestauranteFormProps) {
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [fotoErro, setFotoErro] = useState<string | null>(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(
    props.restaurante.foto_url ?? null,
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<AtualizarPerfilRestauranteFormData>({
    resolver: zodResolver(atualizarPerfilRestauranteSchema),
    defaultValues: montarValoresIniciais(props.restaurante, props.endereco),
  });

  const restaurarEstadoDaImagem = useCallback(
    (fotoUrl: string | null, shouldDirty: boolean) => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      setFotoArquivo(null);
      setFotoErro(null);
      setFotoPreviewUrl(fotoUrl);
      setValue('foto_url', fotoUrl, { shouldDirty });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [setValue],
  );

  useEffect(() => {
    reset(montarValoresIniciais(props.restaurante, props.endereco));
    restaurarEstadoDaImagem(props.restaurante.foto_url ?? null, false);
  }, [props.restaurante, props.endereco, reset, restaurarEstadoDaImagem]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function abrirSeletorImagem() {
    fileInputRef.current?.click();
  }

  function removerImagemAtual() {
    restaurarEstadoDaImagem(null, true);
  }

  function processarSelecaoImagem(event: ChangeEvent<HTMLInputElement>) {
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

  const statusAtual = props.restaurante.status;
  const statusTexto = statusLabel[statusAtual] ?? statusAtual;
  const statusClasse =
    statusClasses[statusAtual] ?? 'border-slate-200 bg-slate-100 text-slate-700';
  const imagemExibida = fotoPreviewUrl ?? IMAGEM_PADRAO_RESTAURANTE;
  const possuiFotoPersonalizada = Boolean(fotoPreviewUrl);

  return (
    <form
      className="grid gap-6"
      onSubmit={handleSubmit((data) => props.onSubmit(data, fotoArquivo))}
    >
      <input type="hidden" {...register('foto_url')} />
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        className="sr-only"
        onChange={processarSelecaoImagem}
      />

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="bg-[linear-gradient(135deg,#14532d_0%,#166534_45%,#1f7a43_100%)] px-6 py-6 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-100">
                Perfil do restaurante
              </p>
              <h1 className="mt-3 text-3xl font-bold">{props.restaurante.nome_fantasia}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">
                Atualize os principais dados do restaurante e mantenha a identidade
                visual do perfil sempre alinhada com a operação.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusClasse}`}
              >
                Status: {statusTexto}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                Desde {formatarData(props.restaurante.criado_em)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="grid auto-rows-max content-start gap-4">
            <article className="self-start overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
              <div className="relative aspect-[4/5] min-h-[320px] overflow-hidden">
                <img
                  src={imagemExibida}
                  alt={`Foto do restaurante ${props.restaurante.nome_fantasia}`}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                  {possuiFotoPersonalizada ? (
                    <button
                      type="button"
                      onClick={removerImagemAtual}
                      className="inline-flex items-center rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-white"
                    >
                      Remover foto
                    </button>
                  ) : <span />}

                  <button
                    type="button"
                    onClick={abrirSeletorImagem}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition hover:bg-emerald-50"
                    aria-label="Alterar foto do restaurante"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>

            <article className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <InfoBloco
                label="Gestor responsável"
                value={props.gestorNome || 'Não informado'}
              />
              <InfoBloco label="CNPJ atual" value={formatarCnpj(props.restaurante.cnpj)} />
              <InfoBloco
                label="Telefone atual"
                value={formatarTelefone(props.restaurante.telefone)}
              />
            </article>
          </aside>

          <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
                Dados editáveis
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Informações do restaurante
              </h2>
            </div>

            {props.feedback ? <Alert variant="success">{props.feedback}</Alert> : null}
            {props.formError ? <Alert variant="error">{props.formError}</Alert> : null}
            {fotoErro ? <Alert variant="error">{fotoErro}</Alert> : null}

            <div className="grid gap-4 lg:grid-cols-2">
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name="cnpj"
                render={({ field }) => (
                  <Input
                    label="CNPJ"
                    inputMode="numeric"
                    maxLength={18}
                    placeholder="00.000.000/0000-00"
                    error={errors.cnpj?.message}
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
                    error={errors.telefone?.message}
                    {...field}
                    value={formatarTelefone(field.value ?? '')}
                    onChange={(event) => field.onChange(formatarTelefone(event.target.value))}
                  />
                )}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
                  Endereço do restaurante
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Mantenha o endereço de operação sempre atualizado para o perfil do restaurante.
                </p>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
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
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Input
                  label="Cidade"
                  error={errors.cidade?.message}
                  {...register('cidade')}
                />
                <Controller
                  control={control}
                  name="estado"
                  render={({ field }) => (
                    <Input
                      label="Estado"
                      maxLength={2}
                      placeholder="SE"
                      error={errors.estado?.message}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="cep"
                  render={({ field }) => (
                    <Input
                      label="CEP"
                      inputMode="numeric"
                      maxLength={9}
                      placeholder="00000-000"
                      error={errors.cep?.message}
                      {...field}
                      value={formatarCep(field.value ?? '')}
                      onChange={(event) => field.onChange(formatarCep(event.target.value))}
                    />
                  )}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
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
            </div>

            <Textarea
              label="Descrição"
              error={errors.descricao?.message}
              className="min-h-36"
              placeholder="Descreva o conceito, os diferenciais e o estilo do restaurante."
              {...register('descricao')}
            />

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
              <Button type="submit" isLoading={isSubmitting}>
                Salvar alterações
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  reset(montarValoresIniciais(props.restaurante, props.endereco));
                  restaurarEstadoDaImagem(props.restaurante.foto_url ?? null, false);
                }}
              >
                Desfazer alterações
              </Button>
            </div>
          </section>
        </div>
      </section>
    </form>
  );
}

function InfoBloco(props: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {props.label}
      </p>
      <p className="mt-1 text-sm font-medium leading-5 text-slate-900">{props.value}</p>
    </div>
  );
}

