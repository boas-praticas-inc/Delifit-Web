import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Textarea } from '../../../components/common/Textarea';
import { formatarCnpj, formatarData, formatarTelefone } from '../../../utils/masks';
import {
  atualizarRestauranteSchema,
  type AtualizarRestauranteFormData,
} from '../../restaurantes/schemas/restauranteSchemas';
import type { Restaurante } from '../../restaurantes/types/restauranteTypes';

interface PerfilRestauranteFormProps {
  enderecoFormatado: string;
  feedback?: string | null;
  formError?: string | null;
  gestorNome: string;
  onSubmit: (
    data: AtualizarRestauranteFormData,
    fotoArquivo: File | null,
  ) => Promise<void>;
  restaurante: Restaurante;
}

const TAMANHO_MAXIMO_IMAGEM_BYTES = 5 * 1024 * 1024;
const TIPOS_IMAGEM_ACEITOS = ['image/png', 'image/jpeg', 'image/webp'];
const INPUT_ACCEPT = '.png,.jpg,.jpeg,.webp';

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

function montarValoresIniciais(restaurante: Restaurante): AtualizarRestauranteFormData {
  return {
    nome_fantasia: restaurante.nome_fantasia,
    razao_social: restaurante.razao_social,
    cnpj: restaurante.cnpj,
    telefone: restaurante.telefone,
    descricao: restaurante.descricao ?? '',
    foto_url: restaurante.foto_url ?? null,
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
  } = useForm<AtualizarRestauranteFormData>({
    resolver: zodResolver(atualizarRestauranteSchema),
    defaultValues: montarValoresIniciais(props.restaurante),
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
    const valoresIniciais = montarValoresIniciais(props.restaurante);
    reset(valoresIniciais);
    restaurarEstadoDaImagem(props.restaurante.foto_url ?? null, false);
  }, [props.restaurante, reset, restaurarEstadoDaImagem]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

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
      restaurarEstadoDaImagem(props.restaurante.foto_url ?? null, true);
      return;
    }

    setFotoErro(null);
    setFotoPreviewUrl(null);
    setValue('foto_url', null, { shouldDirty: true });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const statusAtual = props.restaurante.status;
  const statusTexto = statusLabel[statusAtual] ?? statusAtual;
  const statusClasse =
    statusClasses[statusAtual] ?? 'border-slate-200 bg-slate-100 text-slate-700';

  return (
    <form
      className="grid gap-6"
      onSubmit={handleSubmit((data) => props.onSubmit(data, fotoArquivo))}
    >
      <input type="hidden" {...register('foto_url')} />

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

        <div className="grid gap-6 px-6 py-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="grid gap-4">
            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              {fotoPreviewUrl ? (
                <img
                  src={fotoPreviewUrl}
                  alt={`Foto do restaurante ${props.restaurante.nome_fantasia}`}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[4/3] place-items-center bg-[linear-gradient(135deg,#dcfce7_0%,#f0fdf4_50%,#ecfccb_100%)] p-8 text-center">
                  <div>
                    <div className="mx-auto grid size-20 place-items-center rounded-full border border-emerald-200 bg-white text-3xl text-emerald-700 shadow-sm">
                      R
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-900">
                      Adicione a foto principal do restaurante
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      A imagem enviada aqui será usada como foto de perfil do
                      restaurante.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-3 border-t border-slate-200 bg-white p-4">
                <label className="grid gap-1.5 text-sm font-medium text-slate-700">
                  <span>Foto do restaurante</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={INPUT_ACCEPT}
                    className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    onChange={processarSelecaoImagem}
                  />
                </label>

                <p className="text-xs leading-5 text-slate-500">
                  Envie PNG, JPG ou WEBP com até 5 MB. A URL é gerada automaticamente.
                </p>

                {fotoErro ? <Alert variant="error">{fotoErro}</Alert> : null}

                {fotoPreviewUrl ? (
                  <Button type="button" variant="secondary" onClick={limparImagem}>
                    {fotoArquivo ? 'Descartar nova imagem' : 'Remover imagem atual'}
                  </Button>
                ) : null}
              </div>
            </article>

            <article className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <InfoBloco
                label="Gestor responsável"
                value={props.gestorNome || 'Não informado'}
              />
              <InfoBloco
                label="Endereço vinculado"
                value={props.enderecoFormatado || 'Endereço não informado'}
              />
              <InfoBloco label="CNPJ atual" value={formatarCnpj(props.restaurante.cnpj)} />
            </article>
          </aside>

          <section className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6">
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

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Nome fantasia"
                error={errors.nome_fantasia?.message}
                {...register('nome_fantasia')}
              />
              <Input
                label="Razão social"
                error={errors.razao_social?.message}
                className="md:col-span-2"
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
                    error={errors.cnpj?.message}
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
                    error={errors.telefone?.message}
                    {...field}
                    value={formatarTelefone(field.value ?? '')}
                    onChange={(event) =>
                      field.onChange(formatarTelefone(event.target.value))
                    }
                  />
                )}
              />
              <Input
                label="Endereço vinculado"
                value={props.enderecoFormatado}
                readOnly
                className="md:col-span-2"
              />
              <Textarea
                label="Descrição"
                error={errors.descricao?.message}
                className="min-h-40 md:col-span-2"
                placeholder="Descreva o conceito, os diferenciais e o estilo do restaurante."
                {...register('descricao')}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row">
              <Button type="submit" isLoading={isSubmitting}>
                Salvar alterações
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  reset(montarValoresIniciais(props.restaurante));
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
      <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{props.value}</p>
    </div>
  );
}
