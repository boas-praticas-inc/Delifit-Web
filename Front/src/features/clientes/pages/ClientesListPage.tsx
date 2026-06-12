import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { adminData } from '../../admin/adminData';

export function ClientesListPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const clientes = useMemo(() => adminData.listarClientes(), [refreshKey]);

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-700">
            Clientes
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Lista de clientes
          </h1>
        </div>
        <Link
          to="/clientes/novo"
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Adicionar cliente
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {clientes.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            Nenhum cliente encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Acao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="text-slate-700">
                    <td className="px-4 py-3 font-medium text-slate-950">
                      {cliente.id}
                    </td>
                    <td className="px-4 py-3">{cliente.nome}</td>
                    <td className="px-4 py-3">{cliente.email}</td>
                    <td className="px-4 py-3">{cliente.telefone}</td>
                    <td className="px-4 py-3">{cliente.status}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/clientes/${cliente.id}`}
                        className="font-semibold text-brand-700 hover:text-brand-900"
                        onClick={() => setRefreshKey((key) => key + 1)}
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
