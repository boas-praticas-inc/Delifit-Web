import { useEffect, useState } from 'react';

import { Alert } from '../../../components/common/Alert';
import { CrudActions } from '../../../components/common/CrudActions';
import { LinkButton } from '../../../components/common/LinkButton';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarCpf, formatarData, formatarTelefone } from '../../../utils/masks';
import { clienteService } from '../services/clienteService';
import type { Cliente } from '../types/clienteTypes';

export function ClientesListPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarClientes() {
      try {
        const data = await clienteService.listarClientes();
        setClientes(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void carregarClientes();
  }, []);

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-700">
            Clientes
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Listar Clientes
          </h1>
        </div>
        <LinkButton to="/clientes/novo">Adicionar Cliente</LinkButton>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <div className="p-6">
            <Loading />
          </div>
        ) : null}
        {error ? (
          <div className="p-6">
            <Alert variant="error">{error}</Alert>
          </div>
        ) : null}
        {!isLoading && !error && clientes.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            Nenhum cliente encontrado.
          </div>
        ) : null}
        {!isLoading && !error && clientes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Usuário</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">CPF</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">Nascimento</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="px-4 py-3">{cliente.usuario_id}</td>
                    <td className="px-4 py-3 font-medium text-slate-950">
                      {cliente.nome_completo}
                    </td>
                    <td className="px-4 py-3">{formatarCpf(cliente.cpf)}</td>
                    <td className="px-4 py-3">
                      {formatarTelefone(cliente.telefone)}
                    </td>
                    <td className="px-4 py-3">
                      {formatarData(cliente.data_nascimento)}
                    </td>
                    <td className="px-4 py-3">
                      <CrudActions viewTo={`/clientes/${cliente.id}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
