import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Alert } from '../../../components/common/Alert';
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
    if (!clienteId || !cliente) {
      return;
    }

    setError(null);
    try {
      await clienteService.atualizarCliente(Number(clienteId), {
        usuario_id: cliente.usuario_id,
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
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <div>
        <Link
          to={`/clientes/${cliente.id}`}
          className="text-sm font-semibold text-brand-700"
        >
          Voltar para detalhes
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Editar cliente
        </h1>
      </div>

      <ClienteForm
        mode="edit"
        submitLabel="Salvar alterações"
        formError={error}
        defaultValues={{
          nome_completo: cliente.nome_completo,
          cpf: cliente.cpf,
          telefone: cliente.telefone,
          data_nascimento: cliente.data_nascimento ?? '',
        }}
        onSubmit={onSubmit}
      />
    </section>
  );
}
