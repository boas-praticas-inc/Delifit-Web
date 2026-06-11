import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { UsuarioDonoSelect } from './UsuarioDonoSelect';
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
  const schema =
    props.mode === 'create'
      ? criarRestauranteSchema
      : atualizarRestauranteSchema;

  const {
    formState: { errors },
    formState,
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: props.defaultValues,
  });

  const usuarioDonoId = watch('usuario_dono_id', '');

  useEffect(() => {
    reset(props.defaultValues);
  }, [props.defaultValues, reset]);

  return (
    <form
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5"
      onSubmit={handleSubmit(props.onSubmit)}
    >
      {props.mode === 'create' ? (
        <UsuarioDonoSelect
          value={String(usuarioDonoId ?? '')}
          onChange={(selectedValue) =>
            setValue('usuario_dono_id', Number(selectedValue), {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          error={
            'usuario_dono_id' in errors
              ? errors.usuario_dono_id?.message
              : undefined
          }
        />
      ) : null}

      <Input
        label="Nome fantasia"
        error={errors.nome_fantasia?.message}
        {...register('nome_fantasia')}
      />
      <Input
        label="Razao social"
        error={errors.razao_social?.message}
        {...register('razao_social')}
      />
      <Input
        label="CNPJ"
        inputMode="numeric"
        maxLength={14}
        error={errors.cnpj?.message}
        {...register('cnpj')}
      />
      <Input
        label="Telefone"
        error={errors.telefone?.message}
        {...register('telefone')}
      />
      <Input
        label="Logo URL"
        type="url"
        error={errors.logo_url?.message}
        {...register('logo_url')}
      />

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300"
          {...register('validado')}
        />
        Restaurante validado
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
