import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
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
        <Link
          to="/clientes/novo"
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Adicionar Cliente
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <div className="p-6">
            <Loading />
          </div>
        ) : null}
        {error ? <div className="p-6 text-sm text-red-700">{error}</div> : null}
        {!isLoading && !error && clientes.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            Nenhum cliente encontrado.
          </div>
        ) : null}
        {!isLoading && !error && clientes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Usuário</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">CPF</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="px-4 py-3 font-medium text-slate-950">
                      {cliente.id}
                    </td>
                    <td className="px-4 py-3">{cliente.usuario_id}</td>
                    <td className="px-4 py-3">{cliente.nome_completo}</td>
                    <td className="px-4 py-3">{cliente.cpf}</td>
                    <td className="px-4 py-3">{cliente.telefone}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/clientes/${cliente.id}`}
                        className="font-semibold text-brand-700 hover:text-brand-900"
                      >
                        Ver Detalhes
                      </Link>
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
