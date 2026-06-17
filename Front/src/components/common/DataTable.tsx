import { useMemo, useState } from 'react';

type Column<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
  searchValue?: (item: T) => string;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  emptyMessage: string;
  items: T[];
  searchPlaceholder?: string;
};

export function DataTable<T>({
  columns,
  emptyMessage,
  items,
  searchPlaceholder = 'Buscar...',
}: DataTableProps<T>) {
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  const itensFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return items;
    }

    return items.filter((item) =>
      columns.some((column) =>
        (column.searchValue?.(item) ?? '')
          .toLowerCase()
          .includes(termo),
      ),
    );
  }, [busca, columns, items]);

  const totalPaginas = Math.max(1, Math.ceil(itensFiltrados.length / itensPorPagina));
  const paginaSegurada = Math.min(paginaAtual, totalPaginas);
  const inicio = (paginaSegurada - 1) * itensPorPagina;
  const itensPagina = itensFiltrados.slice(inicio, inicio + itensPorPagina);

  function irParaPagina(pagina: number) {
    setPaginaAtual(Math.min(Math.max(1, pagina), totalPaginas));
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">
            {itensFiltrados.length} registro(s)
          </p>
        </div>
        <input
          value={busca}
          onChange={(event) => {
            setBusca(event.target.value);
            setPaginaAtual(1);
          }}
          placeholder={searchPlaceholder}
          className="min-h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:max-w-xs"
        />
      </div>

      {itensFiltrados.length === 0 ? (
        <div className="p-6 text-sm text-slate-600">{emptyMessage}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  {columns.map((column) => (
                    <th key={column.header} className={`px-4 py-3 ${column.className ?? ''}`}>
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {itensPagina.map((item, index) => (
                  <tr
                    key={index}
                    className="text-slate-700 transition hover:bg-slate-50"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.header}
                        className={`px-4 py-3 align-middle ${column.className ?? ''}`}
                      >
                        {column.render(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Mostrando {inicio + 1}-{Math.min(inicio + itensPorPagina, itensFiltrados.length)} de{' '}
              {itensFiltrados.length}
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
        </>
      )}
    </div>
  );
}
