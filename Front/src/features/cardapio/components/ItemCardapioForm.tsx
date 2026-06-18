import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Textarea } from '../../../components/common/Textarea';
import {
  itemCardapioSchema,
  type ItemCardapioFormData,
} from '../schemas/itemCardapioSchemas';

interface ItemCardapioFormProps {
  defaultValues?: Partial<ItemCardapioFormData>;
  formError?: string | null;
  submitLabel: string;
  onSubmit: (data: ItemCardapioFormData) => Promise<void>;
  onCancel?: () => void;
}

export function ItemCardapioForm({
  defaultValues,
  formError,
  submitLabel,
  onSubmit,
  onCancel,
}: ItemCardapioFormProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ItemCardapioFormData>({
    resolver: zodResolver(itemCardapioSchema),
    defaultValues: {
      status_item: 'ATIVO',
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset({
      status_item: 'ATIVO',
      ...defaultValues,
    });
  }, [defaultValues, reset]);

  return (
    <form
      className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Nome do item"
        error={errors.nome?.message}
        {...register('nome')}
      />
      <Input
        label="Preço"
        type="number"
        min="0"
        step="0.01"
        error={errors.preco?.message}
        {...register('preco')}
      />
      <Select
        label="Tamanho"
        error={errors.tamanho?.message}
        {...register('tamanho')}
      >
        <option value="">Sem tamanho</option>
        <option value="PEQUENO">Pequeno</option>
        <option value="MEDIO">Médio</option>
        <option value="GRANDE">Grande</option>
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
      <Input
        label="URL da foto"
        type="url"
        error={errors.foto_url?.message}
        {...register('foto_url')}
      />
      <Textarea
        label="Descrição"
        error={errors.descricao?.message}
        {...register('descricao')}
      />

      {formError ? <Alert variant="error">{formError}</Alert> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset({
              status_item: 'ATIVO',
              ...defaultValues,
            });
            onCancel?.();
          }}
        >
          Limpar
        </Button>
      </div>
    </form>
  );
}
