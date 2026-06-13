import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { ClienteForm } from '../components/ClienteForm';
import type { AtualizarClienteFormData } from '../schemas/clienteSchemas';
import { clienteService } from '../services/clienteService';
import type { Cliente } from '../types/clienteTypes';

export function EditarClientePage() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      }
    }

    void carregarCliente();
  }, [clienteId]);

  async function onSubmit(data: AtualizarClienteFormData) {
    if (!clienteId) {
      return;
    }

    setError(null);
    try {
      await clienteService.atualizarCliente(Number(clienteId), {
        usuario_id: data.usuario_id,
        nome_completo: data.nome_completo,
        cpf: data.cpf,
        telefone: data.telefone,
        data_nascimento: data.data_nascimento || null,
      });
      navigate(`/clientes/${clienteId}`);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  if (!cliente && !error) {
    return <Loading />;
  }

  if (!cliente) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <div>
        <Link to={`/clientes/${cliente.id}`} className="text-sm font-semibold text-brand-700">
          Voltar para Detalhes
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">Editar Cliente</h1>
      </div>

      <ClienteForm
        mode="edit"
        submitLabel="Salvar Alterações"
        defaultValues={{
          usuario_id: cliente.usuario_id,
          nome_completo: cliente.nome_completo,
          cpf: cliente.cpf,
          telefone: cliente.telefone,
          data_nascimento: cliente.data_nascimento ?? '',
        }}
        onSubmit={onSubmit}
      />

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
