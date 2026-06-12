import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
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
      submitLabel: string;
      onSubmit: (data: CriarClienteFormData) => Promise<void>;
    }
  | {
      mode: 'edit';
      defaultValues?: Partial<AtualizarClienteFormData>;
      submitLabel: string;
      onSubmit: (data: AtualizarClienteFormData) => Promise<void>;
    };

export function ClienteForm(props: Props) {
  const schema =
    props.mode === 'create' ? criarClienteSchema : atualizarClienteSchema;
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<any>({
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
      onSubmit={handleSubmit(props.onSubmit)}
    >
      {props.mode === 'create' ? (
        <>
          <Input
            label="Email"
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
      ) : (
        <Input
          label="ID do Usuário"
          inputMode="numeric"
          error={getErrorMessage(errors.usuario_id?.message)}
          {...register('usuario_id')}
        />
      )}

      <Input
        label="Nome Completo"
        error={getErrorMessage(errors.nome_completo?.message)}
        {...register('nome_completo')}
      />
      <Input
        label="CPF"
        inputMode="numeric"
        maxLength={11}
        error={getErrorMessage(errors.cpf?.message)}
        {...register('cpf')}
      />
      <Input
        label="Telefone"
        error={getErrorMessage(errors.telefone?.message)}
        {...register('telefone')}
      />
      <Input
        label="Data de Nascimento"
        type="date"
        error={getErrorMessage(errors.data_nascimento?.message)}
        {...register('data_nascimento')}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" isLoading={isSubmitting}>
          {props.submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={() => reset(props.defaultValues)}>
          Limpar
        </Button>
      </div>
    </form>
  );
}
