import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { restauranteService } from '../services/restauranteService';
import type { Restaurante } from '../types/restauranteTypes';

export function RestaurantesPage() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  async function carregarRestaurantes() {
    try {
      const data = await restauranteService.listarRestaurantes();
      setRestaurantes(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void carregarRestaurantes();
  }, []);

  const totalPaginas = Math.max(1, Math.ceil(restaurantes.length / itensPorPagina));
  const paginaSegurada = Math.min(paginaAtual, totalPaginas);
  const inicio = (paginaSegurada - 1) * itensPorPagina;
  const restaurantesPagina = restaurantes.slice(inicio, inicio + itensPorPagina);

  function irParaPagina(pagina: number) {
    setPaginaAtual(Math.min(Math.max(1, pagina), totalPaginas));
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-700">
            Restaurantes
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Listar Restaurantes
          </h1>
        </div>
        <Link
          to="/restaurantes/novo"
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 sm:w-auto"
        >
          Novo restaurante
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <div className="p-6">
            <Loading />
          </div>
        ) : null}

        {error ? <div className="p-6 text-sm text-red-700">{error}</div> : null}

        {!isLoading && !error && restaurantes.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            Nenhum restaurante encontrado.
          </div>
        ) : null}

        {!isLoading && !error && restaurantes.length > 0 ? (
          <div className="grid">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Gestor</th>
                    <th className="px-4 py-3">Nome fantasia</th>
                    <th className="px-4 py-3">Razão Social</th>
                    <th className="px-4 py-3">CNPJ</th>
                    <th className="px-4 py-3">Telefone</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {restaurantesPagina.map((restaurante) => (
                    <tr key={restaurante.id} className="text-slate-700">
                      <td className="px-4 py-3 font-medium text-slate-950">
                        {restaurante.id}
                      </td>
                      <td className="px-4 py-3">{restaurante.gestor_id}</td>
                      <td className="px-4 py-3">{restaurante.nome_fantasia}</td>
                      <td className="px-4 py-3">{restaurante.razao_social}</td>
                      <td className="px-4 py-3">{restaurante.cnpj}</td>
                      <td className="px-4 py-3">{restaurante.telefone}</td>
                      <td className="px-4 py-3">{restaurante.status}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/restaurantes/${restaurante.id}`}
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

            <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Mostrando {inicio + 1}-{Math.min(inicio + itensPorPagina, restaurantes.length)} de{' '}
                {restaurantes.length} restaurantes
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => irParaPagina(paginaSegurada - 1)}
                  disabled={paginaSegurada === 1}
                >
                  Anterior
                </button>
                <span className="text-sm text-slate-600">
                  Página {paginaSegurada} de {totalPaginas}
                </span>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => irParaPagina(paginaSegurada + 1)}
                  disabled={paginaSegurada === totalPaginas}
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
