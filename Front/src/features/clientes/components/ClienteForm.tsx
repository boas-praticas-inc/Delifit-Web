import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { formatarCpf, formatarTelefone } from '../../../utils/masks';
import {
  atualizarClienteSchema,
  criarClienteSchema,
  type AtualizarClienteFormData,
  type CriarClienteFormData,
} from '../schemas/clienteSchemas';

type Props =
  | {
      mode: 'create';
      defaultValues?: Partial<CriarClienteFormData>;
      formError?: string | null;
      submitLabel: string;
      onSubmit: (data: CriarClienteFormData) => Promise<void>;
    }
  | {
      mode: 'edit';
      defaultValues?: Partial<AtualizarClienteFormData>;
      formError?: string | null;
      submitLabel: string;
      onSubmit: (data: AtualizarClienteFormData) => Promise<void>;
    };

type ClienteFormValues = Partial<CriarClienteFormData & AtualizarClienteFormData>;

export function ClienteForm(props: Props) {
  const schema =
    props.mode === 'create' ? criarClienteSchema : atualizarClienteSchema;
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: props.defaultValues,
  });

  useEffect(() => {
    reset(props.defaultValues);
  }, [props.defaultValues, reset]);

  function getErrorMessage(value: unknown) {
    return typeof value === 'string' ? value : undefined;
  }

  return (
    <form
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5"
      onSubmit={handleSubmit((data) =>
        props.mode === 'create'
          ? props.onSubmit(data as CriarClienteFormData)
          : props.onSubmit(data as AtualizarClienteFormData),
      )}
    >
      {props.mode === 'create' ? (
        <>
          <Input
            label="E-mail"
            type="email"
            error={getErrorMessage(errors.email?.message)}
            {...register('email')}
          />
          <Input
            label="Senha"
            type="password"
            error={getErrorMessage(errors.senha?.message)}
            {...register('senha')}
          />
        </>
      ) : null}

      <Input
        label="Nome completo"
        error={getErrorMessage(errors.nome_completo?.message)}
        {...register('nome_completo')}
      />
      <Controller
        control={control}
        name="cpf"
        render={({ field }) => (
          <Input
            label="CPF"
            inputMode="numeric"
            maxLength={14}
            placeholder="000.000.000-00"
            error={getErrorMessage(errors.cpf?.message)}
            {...field}
            value={formatarCpf(field.value ?? '')}
            onChange={(event) => field.onChange(formatarCpf(event.target.value))}
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
        label="Data de nascimento"
        type="date"
        error={getErrorMessage(errors.data_nascimento?.message)}
        {...register('data_nascimento')}
      />

      {props.formError ? <Alert variant="error">{props.formError}</Alert> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" isLoading={isSubmitting}>
          {props.submitLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => reset(props.defaultValues)}
        >
          Limpar
        </Button>
      </div>
    </form>
  );
}
