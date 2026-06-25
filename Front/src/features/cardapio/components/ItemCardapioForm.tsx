import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
  onSubmit: (data: ItemCardapioFormData) => Promise<void>;
  onCancel?: () => void;
}

const unidadesMedidaDisponiveis: UnidadeMedidaVariacao[] = [
  'G',
  'KG',
  'ML',
  'L',
  'UNIDADE',
];

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
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
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

  useEffect(() => {
    reset(criarValoresPadrao(defaultValues));
  }, [defaultValues, reset]);

  return (
    <form
      className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
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

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nome do item"
          error={errors.nome?.message}
          {...register('nome')}
        />
        <Input
          label="URL da foto"
          type="url"
          error={errors.foto_url?.message}
          {...register('foto_url')}
        />
      </div>

      <Textarea
        label="Descrição"
        error={errors.descricao?.message}
        {...register('descricao')}
      />

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
            onCancel?.();
          }}
        >
          Limpar
        </Button>
      </div>
    </form>
  );
}
