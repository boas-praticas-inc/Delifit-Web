import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../../components/common/Button';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
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
    return <p className="text-sm text-red-700">{error ?? 'Cliente nao encontrado.'}</p>;
  }

  return (
    <section className="grid gap-6">
      <div>
        <Link to="/clientes" className="text-sm font-semibold text-brand-700">
          Voltar para Clientes
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Detalhes do Cliente
        </h1>
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <p><span className="font-semibold text-slate-950">ID:</span> {cliente.id}</p>
        <p><span className="font-semibold text-slate-950">Usuário ID:</span> {cliente.usuario_id}</p>
        <p><span className="font-semibold text-slate-950">Nome:</span> {cliente.nome_completo}</p>
        <p><span className="font-semibold text-slate-950">CPF:</span> {cliente.cpf}</p>
        <p><span className="font-semibold text-slate-950">Telefone:</span> {cliente.telefone}</p>
        <p><span className="font-semibold text-slate-950">Nascimento:</span> {cliente.data_nascimento ?? 'Não informado'}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to={`/clientes/${cliente.id}/editar`}
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Editar
        </Link>
        <Button variant="secondary" onClick={() => void handleExcluir()}>
          Remover
        </Button>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
