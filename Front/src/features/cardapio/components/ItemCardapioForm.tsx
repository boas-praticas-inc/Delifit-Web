import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Textarea } from '../../../components/common/Textarea';
import {
  itemCardapioSchema,
  type ItemCardapioFormData,
} from '../schemas/itemCardapioSchemas';
import type { CategoriaCardapio } from '../types/categoriaCardapioTypes';
import {
  TAG_ITEM_CARDAPIO_OPTIONS,
  type UnidadeMedidaVariacao,
} from '../types/itemCardapioTypes';

interface ItemCardapioFormProps {
  categorias: CategoriaCardapio[];
  defaultValues?: Partial<ItemCardapioFormData>;
  formError?: string | null;
  isLoadingCategorias?: boolean;
  submitLabel: string;
  onSubmit: (data: ItemCardapioFormData, fotoArquivo: File | null) => Promise<void>;
  onCancel?: () => void;
}

const unidadesMedidaDisponiveis: UnidadeMedidaVariacao[] = [
  'G',
  'KG',
  'ML',
  'L',
  'UNIDADE',
];
const TAMANHO_MAXIMO_IMAGEM_BYTES = 5 * 1024 * 1024;
const TIPOS_IMAGEM_ACEITOS = ['image/png', 'image/jpeg', 'image/webp'];
const INPUT_ACCEPT = '.png,.jpg,.jpeg,.webp';

function criarVariacaoPadrao(unidadeMedida: UnidadeMedidaVariacao = 'G') {
  return {
    quantidade: 0,
    unidade_medida: unidadeMedida,
    preco: 0,
    carboidratos: 0,
    gorduras: 0,
    proteina: 0,
    caloria: 0,
  };
}

function criarValoresPadrao(
  defaultValues?: Partial<ItemCardapioFormData>,
): ItemCardapioFormData {
  return {
    categoria_id: defaultValues?.categoria_id ?? 0,
    nome: defaultValues?.nome ?? '',
    descricao: defaultValues?.descricao ?? '',
    variacoes:
      defaultValues?.variacoes && defaultValues.variacoes.length > 0
        ? defaultValues.variacoes
        : [criarVariacaoPadrao()],
    tags: defaultValues?.tags ?? [],
    status_item: defaultValues?.status_item ?? 'ATIVO',
    foto_url: defaultValues?.foto_url ?? '',
  };
}

export function ItemCardapioForm({
  categorias,
  defaultValues,
  formError,
  isLoadingCategorias = false,
  submitLabel,
  onSubmit,
  onCancel,
}: ItemCardapioFormProps) {
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [fotoPreviewUrl, setFotoPreviewUrl] = useState<string | null>(
    defaultValues?.foto_url ?? null,
  );
  const [fotoErro, setFotoErro] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<ItemCardapioFormData>({
    resolver: zodResolver(itemCardapioSchema),
    defaultValues: criarValoresPadrao(defaultValues),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variacoes',
  });
  const tagsSelecionadas = watch('tags') ?? [];

  const restaurarEstadoDaImagem = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const fotoUrlInicial = defaultValues?.foto_url ?? null;
    setFotoArquivo(null);
    setFotoErro(null);
    setFotoPreviewUrl(fotoUrlInicial);
    setValue('foto_url', fotoUrlInicial, { shouldDirty: false });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [defaultValues?.foto_url, setValue]);

  useEffect(() => {
    reset(criarValoresPadrao(defaultValues));
    restaurarEstadoDaImagem();
  }, [defaultValues, reset, restaurarEstadoDaImagem]);

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
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      const fotoUrlInicial = defaultValues?.foto_url ?? null;
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
      className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit((data) => onSubmit(data, fotoArquivo))}
    >
      <input type="hidden" {...register('foto_url')} />

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Categoria"
          disabled={isLoadingCategorias}
          error={errors.categoria_id?.message}
          {...register('categoria_id')}
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nome}
            </option>
          ))}
        </Select>

        <Select
          label="Status"
          error={errors.status_item?.message}
          {...register('status_item')}
        >
          <option value="ATIVO">Ativo</option>
          <option value="INDISPONIVEL">Indisponível</option>
          <option value="INATIVO">Inativo</option>
          <option value="ARQUIVADO">Arquivado</option>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start">
        <div className="grid gap-4">
          <Input
            label="Nome do item"
            error={errors.nome?.message}
            {...register('nome')}
          />

          <Textarea
            label="Descrição"
            error={errors.descricao?.message}
            {...register('descricao')}
          />
        </div>

        <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:self-start">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Foto do item</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
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
                alt="Pré-visualização da imagem do item do cardápio"
                className="aspect-[4/3] w-full rounded-lg border border-slate-200 object-cover bg-white"
              />
              {fotoArquivo ? (
                <p className="text-xs text-slate-500">
                  Nova imagem selecionada: {fotoArquivo.name}
                </p>
              ) : (
                <p className="text-xs text-slate-500">Imagem atual do item.</p>
              )}
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
              Nenhuma imagem selecionada.
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Tags e restrições</h2>
          <p className="mt-1 text-sm text-slate-600">
            Marque os atributos que ajudam a identificar o item no cardápio.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TAG_ITEM_CARDAPIO_OPTIONS.map((tag) => {
            const selecionada = tagsSelecionadas.includes(tag.value);

            return (
              <label
                key={tag.value}
                className={`cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  selecionada
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
                }`}
              >
                <input
                  type="checkbox"
                  value={tag.value}
                  className="sr-only"
                  {...register('tags')}
                />
                {tag.label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Variações de medida</h2>
            <p className="mt-1 text-sm text-slate-600">
              Configure quantidade, unidade, preço e macros de cada variação do item.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => append(criarVariacaoPadrao())}
          >
            Adicionar variação
          </Button>
        </div>

        {errors.variacoes?.message ? (
          <Alert variant="error">{errors.variacoes.message}</Alert>
        ) : null}

        <div className="grid gap-4">
          {fields.map((field, index) => (
            <article
              key={field.id}
              className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Variação {index + 1}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-slate-950">
                    Medida e valores nutricionais
                  </h3>
                </div>
                {fields.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                  >
                    Remover variação
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Input
                  label="Quantidade"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  error={errors.variacoes?.[index]?.quantidade?.message}
                  {...register(`variacoes.${index}.quantidade`)}
                />

                <Select
                  label="Unidade"
                  error={errors.variacoes?.[index]?.unidade_medida?.message}
                  {...register(`variacoes.${index}.unidade_medida`)}
                >
                  {unidadesMedidaDisponiveis.map((unidadeMedida) => (
                    <option key={unidadeMedida} value={unidadeMedida}>
                      {unidadeMedida === 'UNIDADE' ? 'Unidade' : unidadeMedida}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Preço"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  error={errors.variacoes?.[index]?.preco?.message}
                  {...register(`variacoes.${index}.preco`)}
                />

                <Input
                  label="Caloria"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  error={errors.variacoes?.[index]?.caloria?.message}
                  {...register(`variacoes.${index}.caloria`)}
                />

                <Input
                  label="Carboidratos (g)"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  error={errors.variacoes?.[index]?.carboidratos?.message}
                  {...register(`variacoes.${index}.carboidratos`)}
                />

                <Input
                  label="Gorduras (g)"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  error={errors.variacoes?.[index]?.gorduras?.message}
                  {...register(`variacoes.${index}.gorduras`)}
                />

                <Input
                  label="Proteína (g)"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  error={errors.variacoes?.[index]?.proteina?.message}
                  {...register(`variacoes.${index}.proteina`)}
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      {formError ? <Alert variant="error">{formError}</Alert> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset(criarValoresPadrao(defaultValues));
            restaurarEstadoDaImagem();
            onCancel?.();
          }}
        >
          Limpar
        </Button>
      </div>
    </form>
  );
}

