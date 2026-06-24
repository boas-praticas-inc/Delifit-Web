import { useMemo, useState } from 'react';

type Column<T> = {
  id?: string;
  header: string;
  render: (item: T) => React.ReactNode;
  searchValue?: (item: T) => string;
  sortValue?: (item: T) => string | number;
  className?: string;
};

type FilterOption = {
  label: string;
  value: string;
};

type DataTableFilter<T> = {
  id: string;
  label: string;
  options: FilterOption[];
  predicate: (item: T, value: string) => boolean;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  emptyMessage: string;
  filters?: DataTableFilter<T>[];
  initialSortBy?: string;
  initialSortDirection?: 'asc' | 'desc';
  items: T[];
  searchPlaceholder?: string;
};

export function DataTable<T>({
  columns,
  emptyMessage,
  filters = [],
  initialSortBy = '',
  initialSortDirection = 'asc',
  items,
  searchPlaceholder = 'Buscar...',
}: DataTableProps<T>) {
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    initialSortDirection,
  );
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(
    () => Object.fromEntries(filters.map((filter) => [filter.id, ''])),
  );
  const itensPorPagina = 8;

  const sortableColumns = useMemo(
    () =>
      columns
        .filter((column) => column.sortValue)
        .map((column, index) => ({
          id: column.id ?? `column_${index}`,
          header: column.header,
          sortValue: column.sortValue!,
        })),
    [columns],
  );

  const itensFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return items.filter((item) => {
      const passouBusca =
        !termo ||
        columns.some((column) =>
          (column.searchValue?.(item) ?? '').toLowerCase().includes(termo),
        );

      if (!passouBusca) {
        return false;
      }

      return filters.every((filter) => {
        const valorSelecionado = selectedFilters[filter.id];

        if (!valorSelecionado) {
          return true;
        }

        return filter.predicate(item, valorSelecionado);
      });
    });
  }, [busca, columns, filters, items, selectedFilters]);

  const itensFiltradosOrdenados = useMemo(() => {
    if (!sortBy) {
      return itensFiltrados;
    }

    const sortConfig = sortableColumns.find((column) => column.id === sortBy);
    if (!sortConfig) {
      return itensFiltrados;
    }

    const resultado = [...itensFiltrados].sort((a, b) => {
      const valorA = sortConfig.sortValue(a);
      const valorB = sortConfig.sortValue(b);

      if (typeof valorA === 'number' && typeof valorB === 'number') {
        return valorA - valorB;
      }

      return String(valorA).localeCompare(String(valorB), 'pt-BR', {
        numeric: true,
        sensitivity: 'base',
      });
    });

    if (sortDirection === 'desc') {
      resultado.reverse();
    }

    return resultado;
  }, [itensFiltrados, sortBy, sortDirection, sortableColumns]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(itensFiltradosOrdenados.length / itensPorPagina),
  );
  const paginaSegurada = Math.min(paginaAtual, totalPaginas);
  const inicio = (paginaSegurada - 1) * itensPorPagina;
  const itensPagina = itensFiltradosOrdenados.slice(
    inicio,
    inicio + itensPorPagina,
  );

  function irParaPagina(pagina: number) {
    setPaginaAtual(Math.min(Math.max(1, pagina), totalPaginas));
  }

  function getColumnId(column: Column<T>, index: number) {
    return column.id ?? `column_${index}`;
  }

  function alternarOrdenacao(columnId: string, direction: 'asc' | 'desc') {
    if (sortBy === columnId && sortDirection === direction) {
      setSortBy('');
      setSortDirection(initialSortDirection);
      return;
    }

    setSortBy(columnId);
    setSortDirection(direction);
    setPaginaAtual(1);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <p className="text-sm font-medium text-slate-600">
            {itensFiltradosOrdenados.length} registro(s)
          </p>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-end xl:max-w-[760px]">
            {filters.length > 0 ? (
              <div className="order-2 flex flex-col gap-3 sm:order-2 sm:flex-row sm:flex-nowrap">
                {filters.map((filter) => (
                  <label key={filter.id} className="grid gap-1 text-sm text-slate-600">
                    <span>{filter.label}</span>
                    <select
                      value={selectedFilters[filter.id] ?? ''}
                      onChange={(event) => {
                        setSelectedFilters((current) => ({
                          ...current,
                          [filter.id]: event.target.value,
                        }));
                        setPaginaAtual(1);
                      }}
                      className="min-h-10 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    >
                      <option value="">Todos</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            ) : null}

            <div className="relative order-1 w-full sm:order-1 sm:max-w-md">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4"
                >
                  <path
                    d="M14.1667 14.1667L17.5 17.5M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                value={busca}
                onChange={(event) => {
                  setBusca(event.target.value);
                  setPaginaAtual(1);
                }}
                placeholder={searchPlaceholder}
                className="min-h-10 w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>
        </div>
      </div>

      {itensFiltradosOrdenados.length === 0 ? (
        <div className="p-6 text-sm text-slate-600">{emptyMessage}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-[0.1em] text-brand-700">
                <tr>
                  {columns.map((column, index) => {
                    const columnId = getColumnId(column, index);
                    const isSortable = Boolean(column.sortValue);
                    const isActive = sortBy === columnId;

                    return (
                      <th
                        key={column.header}
                        className={`px-4 py-3 ${column.className ?? ''}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>{column.header}</span>
                          {isSortable ? (
                            <div className="flex flex-col leading-none">
                              <button
                                type="button"
                                className={`h-3 text-[10px] transition ${
                                  isActive && sortDirection === 'asc'
                                    ? 'text-brand-700'
                                    : 'text-brand-200 opacity-35 hover:opacity-70'
                                }`}
                                onClick={() => alternarOrdenacao(columnId, 'asc')}
                                aria-label={`Ordenar ${column.header} de forma crescente`}
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                className={`h-3 text-[10px] transition ${
                                  isActive && sortDirection === 'desc'
                                    ? 'text-brand-700'
                                    : 'text-brand-200 opacity-35 hover:opacity-70'
                                }`}
                                onClick={() => alternarOrdenacao(columnId, 'desc')}
                                aria-label={`Ordenar ${column.header} de forma decrescente`}
                              >
                                ▼
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </th>
                    );
                  })}
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
              Mostrando {inicio + 1}-
              {Math.min(inicio + itensPorPagina, itensFiltradosOrdenados.length)} de{' '}
              {itensFiltradosOrdenados.length}
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

export type { Column as DataTableColumn, DataTableFilter };
