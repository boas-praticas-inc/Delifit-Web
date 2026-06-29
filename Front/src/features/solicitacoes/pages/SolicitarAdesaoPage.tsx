import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Textarea } from '../../../components/common/Textarea';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarCep, formatarCnpj, formatarCpf, formatarTelefone } from '../../../utils/masks';
import {
  dadosEnderecoSchema,
  dadosGestorSchema,
  dadosRestauranteSchema,
  type CriarSolicitacaoFormData,
  type DadosEnderecoFormData,
  type DadosGestorFormData,
  type DadosRestauranteFormData,
} from '../schemas/solicitacaoSchemas';
import { solicitacaoService } from '../services/solicitacaoService';

type Etapa = 1 | 2 | 3;

const MENSAGEM_SUCESSO =
  'Solicitação enviada com sucesso. Aguarde a análise do administrador.';

export function SolicitarAdesaoPage() {
  const navigate = useNavigate();
  const [etapaAtual, setEtapaAtual] = useState<Etapa>(1);
  const [dadosFormulario, setDadosFormulario] =
    useState<Partial<CriarSolicitacaoFormData>>({});
  const [erro, setErro] = useState<string | null>(null);

  const gestorForm = useForm<DadosGestorFormData>({
    resolver: zodResolver(dadosGestorSchema),
    defaultValues: {
      email: dadosFormulario.email ?? '',
      senha: dadosFormulario.senha ?? '',
      nome_completo: dadosFormulario.nome_completo ?? '',
      cpf: dadosFormulario.cpf ?? '',
      telefone_gestor: dadosFormulario.telefone_gestor ?? '',
    },
  });

  const enderecoForm = useForm<DadosEnderecoFormData>({
    resolver: zodResolver(dadosEnderecoSchema),
    defaultValues: {
      cep: dadosFormulario.cep ?? '',
      logradouro: dadosFormulario.logradouro ?? '',
      numero: dadosFormulario.numero ?? '',
      bairro: dadosFormulario.bairro ?? '',
      cidade: dadosFormulario.cidade ?? '',
      estado: dadosFormulario.estado ?? '',
      complemento: dadosFormulario.complemento ?? '',
      referencia: dadosFormulario.referencia ?? '',
    },
  });

  const restauranteForm = useForm<DadosRestauranteFormData>({
    resolver: zodResolver(dadosRestauranteSchema),
    defaultValues: {
      nome_fantasia: dadosFormulario.nome_fantasia ?? '',
      razao_social: dadosFormulario.razao_social ?? '',
      cnpj: dadosFormulario.cnpj ?? '',
      telefone_restaurante: dadosFormulario.telefone_restaurante ?? '',
      descricao: dadosFormulario.descricao ?? '',
    },
  });

  function avancarComDados(
    data: Partial<CriarSolicitacaoFormData>,
    proximaEtapa: Etapa,
  ) {
    setErro(null);
    setDadosFormulario((current) => ({ ...current, ...data }));
    setEtapaAtual(proximaEtapa);
  }

  async function finalizarCadastro(data: DadosRestauranteFormData) {
    setErro(null);
    const payload = { ...dadosFormulario, ...data } as CriarSolicitacaoFormData;

    try {
      await solicitacaoService.solicitarAdesao(payload);
      navigate('/', { replace: true, state: { message: MENSAGEM_SUCESSO } });
    } catch (error) {
      setErro(getApiErrorMessage(error));
    }
  }

  return (
    <main className="min-h-screen bg-brand-50 px-4 py-8">
      <section className="mx-auto grid w-full max-w-4xl gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/" className="text-sm font-semibold text-brand-700">
              Delifit
            </Link>
            <h1 className="mt-3 text-2xl font-bold text-slate-950">
              Solicitar adesão
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Cadastre o usuário gestor, o endereço e os dados do restaurante
              para enviar sua solicitação.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-900 transition hover:bg-brand-50"
          >
            Voltar ao login
          </Link>
        </div>

        <div className="grid gap-3 rounded-lg border border-brand-100 bg-white p-4 shadow-soft sm:grid-cols-3">
          <EtapaCard numero={1} titulo="Usuário gestor" ativa={etapaAtual === 1} />
          <EtapaCard numero={2} titulo="Endereço" ativa={etapaAtual === 2} />
          <EtapaCard numero={3} titulo="Restaurante" ativa={etapaAtual === 3} />
        </div>

        {erro ? (
          <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        ) : null}

        {etapaAtual === 1 ? (
          <form
            className="grid gap-6 rounded-lg border border-brand-100 bg-white p-6 shadow-soft"
            onSubmit={gestorForm.handleSubmit((data) => avancarComDados(data, 2))}
          >
            <fieldset className="grid gap-4">
              <legend className="text-base font-bold text-slate-950">
                Dados do gestor
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="E-mail"
                  type="email"
                  error={gestorForm.formState.errors.email?.message}
                  {...gestorForm.register('email')}
                />
                <Input
                  label="Senha"
                  type="password"
                  error={gestorForm.formState.errors.senha?.message}
                  {...gestorForm.register('senha')}
                />
                <Input
                  label="Nome completo"
                  error={gestorForm.formState.errors.nome_completo?.message}
                  {...gestorForm.register('nome_completo')}
                />
                <Controller
                  control={gestorForm.control}
                  name="cpf"
                  render={({ field }) => (
                    <Input
                      label="CPF"
                      inputMode="numeric"
                      maxLength={14}
                      placeholder="000.000.000-00"
                      error={gestorForm.formState.errors.cpf?.message}
                      {...field}
                      value={formatarCpf(field.value ?? '')}
                      onChange={(event) =>
                        field.onChange(formatarCpf(event.target.value))
                      }
                    />
                  )}
                />
                <Controller
                  control={gestorForm.control}
                  name="telefone_gestor"
                  render={({ field }) => (
                    <Input
                      label="Telefone"
                      inputMode="tel"
                      maxLength={15}
                      placeholder="(00) 00000-0000"
                      error={gestorForm.formState.errors.telefone_gestor?.message}
                      {...field}
                      value={formatarTelefone(field.value ?? '')}
                      onChange={(event) =>
                        field.onChange(formatarTelefone(event.target.value))
                      }
                    />
                  )}
                />
              </div>
            </fieldset>

            <div className="flex justify-end">
              <Button type="submit" isLoading={gestorForm.formState.isSubmitting}>
                Próxima etapa
              </Button>
            </div>
          </form>
        ) : null}

        {etapaAtual === 2 ? (
          <form
            className="grid gap-6 rounded-lg border border-brand-100 bg-white p-6 shadow-soft"
            onSubmit={enderecoForm.handleSubmit((data) => avancarComDados(data, 3))}
          >
            <fieldset className="grid gap-4">
              <legend className="text-base font-bold text-slate-950">
                Endereço do restaurante
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  control={enderecoForm.control}
                  name="cep"
                  render={({ field }) => (
                    <Input
                      label="CEP"
                      inputMode="numeric"
                      maxLength={9}
                      placeholder="00000-000"
                      error={enderecoForm.formState.errors.cep?.message}
                      {...field}
                      value={formatarCep(field.value ?? '')}
                      onChange={(event) =>
                        field.onChange(formatarCep(event.target.value))
                      }
                    />
                  )}
                />
                <Input
                  label="Logradouro"
                  error={enderecoForm.formState.errors.logradouro?.message}
                  {...enderecoForm.register('logradouro')}
                />
                <Input
                  label="Número"
                  error={enderecoForm.formState.errors.numero?.message}
                  {...enderecoForm.register('numero')}
                />
                <Input
                  label="Bairro"
                  error={enderecoForm.formState.errors.bairro?.message}
                  {...enderecoForm.register('bairro')}
                />
                <Input
                  label="Cidade"
                  error={enderecoForm.formState.errors.cidade?.message}
                  {...enderecoForm.register('cidade')}
                />
                <Input
                  label="Estado"
                  maxLength={2}
                  placeholder="SE"
                  error={enderecoForm.formState.errors.estado?.message}
                  {...enderecoForm.register('estado')}
                />
                <Input
                  label="Complemento"
                  error={enderecoForm.formState.errors.complemento?.message}
                  {...enderecoForm.register('complemento')}
                />
                <Input
                  label="Referência"
                  error={enderecoForm.formState.errors.referencia?.message}
                  {...enderecoForm.register('referencia')}
                />
              </div>
            </fieldset>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setEtapaAtual(1)}>
                Voltar
              </Button>
              <Button type="submit" isLoading={enderecoForm.formState.isSubmitting}>
                Próxima etapa
              </Button>
            </div>
          </form>
        ) : null}

        {etapaAtual === 3 ? (
          <form
            className="grid gap-6 rounded-lg border border-brand-100 bg-white p-6 shadow-soft"
            onSubmit={restauranteForm.handleSubmit(finalizarCadastro)}
          >
            <fieldset className="grid gap-4">
              <legend className="text-base font-bold text-slate-950">
                Dados do restaurante
              </legend>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Nome fantasia"
                  error={restauranteForm.formState.errors.nome_fantasia?.message}
                  {...restauranteForm.register('nome_fantasia')}
                />
                <Input
                  label="Razão social"
                  error={restauranteForm.formState.errors.razao_social?.message}
                  {...restauranteForm.register('razao_social')}
                />
                <Controller
                  control={restauranteForm.control}
                  name="cnpj"
                  render={({ field }) => (
                    <Input
                      label="CNPJ"
                      inputMode="numeric"
                      maxLength={18}
                      placeholder="00.000.000/0000-00"
                      error={restauranteForm.formState.errors.cnpj?.message}
                      {...field}
                      value={formatarCnpj(field.value ?? '')}
                      onChange={(event) =>
                        field.onChange(formatarCnpj(event.target.value))
                      }
                    />
                  )}
                />
                <Controller
                  control={restauranteForm.control}
                  name="telefone_restaurante"
                  render={({ field }) => (
                    <Input
                      label="Telefone"
                      inputMode="tel"
                      maxLength={15}
                      placeholder="(00) 00000-0000"
                      error={restauranteForm.formState.errors.telefone_restaurante?.message}
                      {...field}
                      value={formatarTelefone(field.value ?? '')}
                      onChange={(event) =>
                        field.onChange(formatarTelefone(event.target.value))
                      }
                    />
                  )}
                />
              </div>
            </fieldset>

            <fieldset className="grid gap-4">
              <legend className="text-base font-bold text-slate-950">
                Informações adicionais
              </legend>
              <Textarea
                label="Descrição"
                error={restauranteForm.formState.errors.descricao?.message}
                {...restauranteForm.register('descricao')}
              />
              <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                A foto do restaurante será adicionada depois que um administrador aprovar a adesão,
                no campo de perfil do restaurante.
              </div>
            </fieldset>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={() => setEtapaAtual(2)}>
                Voltar
              </Button>
              <Button type="submit" isLoading={restauranteForm.formState.isSubmitting}>
                Enviar solicitação
              </Button>
            </div>
          </form>
        ) : null}
      </section>
    </main>
  );
}

type EtapaCardProps = {
  numero: number;
  titulo: string;
  ativa: boolean;
};

function EtapaCard({ numero, titulo, ativa }: EtapaCardProps) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 ${
        ativa
          ? 'border-brand-300 bg-brand-50 text-brand-900'
          : 'border-slate-200 bg-slate-50 text-slate-500'
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em]">
        Etapa {numero}
      </p>
      <p className="mt-2 text-sm font-bold">{titulo}</p>
    </div>
  );
}
