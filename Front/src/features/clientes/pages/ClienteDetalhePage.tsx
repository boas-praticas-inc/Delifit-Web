import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { LinkButton } from '../../../components/common/LinkButton';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarCpf, formatarData, formatarTelefone } from '../../../utils/masks';
import { clienteService } from '../services/clienteService';
import type { Cliente } from '../types/clienteTypes';

export function ClienteDetalhePage() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function carregarCliente() {
      if (!clienteId) {
        return;
      }

      try {
        const data = await clienteService.buscarClientePorId(Number(clienteId));
        setCliente(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void carregarCliente();
  }, [clienteId]);

  async function handleExcluir() {
    if (!clienteId || !window.confirm('Deseja remover este cliente?')) {
      return;
    }

    try {
      await clienteService.excluirCliente(Number(clienteId));
      navigate('/clientes');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!cliente) {
    return <Alert variant="error">{error ?? 'Cliente não encontrado.'}</Alert>;
  }

  return (
    <section className="grid gap-6">
      <div>
        <Link to="/clientes" className="text-sm font-semibold text-brand-700">
          Voltar para clientes
        </Link>
        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Perfil do cliente
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            {cliente.nome_completo}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Dados pessoais e contato do cliente cadastrado no Delifit.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard label="CPF" value={formatarCpf(cliente.cpf)} />
        <InfoCard label="Telefone" value={formatarTelefone(cliente.telefone)} />
        <InfoCard label="Data de nascimento" value={formatarData(cliente.data_nascimento)} />
        <InfoCard label="Categoria" value="Cliente Delifit" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <LinkButton to={`/clientes/${cliente.id}/editar`}>Editar</LinkButton>
        <Button variant="secondary" onClick={() => void handleExcluir()}>
          Remover
        </Button>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}
    </section>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold text-slate-950">{value}</p>
    </article>
  );
}
