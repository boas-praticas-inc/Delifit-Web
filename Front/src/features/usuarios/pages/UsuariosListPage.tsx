import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { usuarioService } from '../services/usuarioService';
import type { Usuario } from '../types/usuarioTypes';

export function UsuariosListPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const data = await usuarioService.listarUsuarios();
        setUsuarios(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void carregarUsuarios();
  }, []);

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-700">
            Usuarios
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Usuarios cadastrados
          </h1>
        </div>
        <Link
          to="/usuarios/novo"
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 sm:w-auto"
        >
          Novo usuario
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <div className="p-6">
            <Loading />
          </div>
        ) : null}

        {error ? <div className="p-6 text-sm text-red-700">{error}</div> : null}

        {!isLoading && !error && usuarios.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            Nenhum usuario encontrado.
          </div>
        ) : null}

        {!isLoading && !error && usuarios.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Criado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="text-slate-700">
                    <td className="px-4 py-3 font-medium text-slate-950">
                      {usuario.id}
                    </td>
                    <td className="px-4 py-3">{usuario.email}</td>
                    <td className="px-4 py-3">{usuario.tipo_usuario}</td>
                    <td className="px-4 py-3">{usuario.status}</td>
                    <td className="px-4 py-3">
                      {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}
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
