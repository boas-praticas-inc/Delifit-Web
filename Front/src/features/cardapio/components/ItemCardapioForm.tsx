import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Textarea } from '../../../components/common/Textarea';
import type { CategoriaCardapio } from '../types/categoriaCardapioTypes';
import {
  itemCardapioSchema,
  type ItemCardapioFormData,
} from '../schemas/itemCardapioSchemas';

interface ItemCardapioFormProps {
  categorias: CategoriaCardapio[];
  defaultValues?: Partial<ItemCardapioFormData>;
  formError?: string | null;
  isLoadingCategorias?: boolean;
  submitLabel: string;
  onSubmit: (data: ItemCardapioFormData) => Promise<void>;
  onCancel?: () => void;
}

const tamanhosDisponiveis = ['PEQUENO', 'MEDIO', 'GRANDE'] as const;

function criarVariacaoPadrao(tamanho: (typeof tamanhosDisponiveis)[number] = 'MEDIO') {
  return {
    tamanho,
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
  } = useForm<ItemCardapioFormData>({
    resolver: zodResolver(itemCardapioSchema),
    defaultValues: criarValoresPadrao(defaultValues),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variacoes',
  });

  useEffect(() => {
    reset(criarValoresPadrao(defaultValues));
  }, [defaultValues, reset]);

  const variacoes = useWatch({
    control,
    name: 'variacoes',
  });
  const tamanhosSelecionados = (variacoes ?? []).map((variacao) => variacao.tamanho);
  const proximoTamanhoDisponivel = useMemo(
    () =>
      tamanhosDisponiveis.find((tamanho) => !tamanhosSelecionados.includes(tamanho)) ??
      'MEDIO',
    [tamanhosSelecionados],
  );

  const podeAdicionarVariacao = fields.length < tamanhosDisponiveis.length;

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

      <div className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Variações de tamanho</h2>
            <p className="mt-1 text-sm text-slate-600">
              Configure preço e macros de cada tamanho disponível para o item.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            disabled={!podeAdicionarVariacao}
            onClick={() => append(criarVariacaoPadrao(proximoTamanhoDisponivel))}
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
                    Tamanho e valores nutricionais
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
                <Select
                  label="Tamanho"
                  error={errors.variacoes?.[index]?.tamanho?.message}
                  {...register(`variacoes.${index}.tamanho`)}
                >
                  {tamanhosDisponiveis.map((tamanho) => (
                    <option key={tamanho} value={tamanho}>
                      {tamanho === 'PEQUENO'
                        ? 'Pequeno'
                        : tamanho === 'MEDIO'
                          ? 'Médio'
                          : 'Grande'}
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
