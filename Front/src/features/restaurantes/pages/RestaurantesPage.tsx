import { useEffect, useState } from 'react';

import { Alert } from '../../../components/common/Alert';
import { CrudActions } from '../../../components/common/CrudActions';
import { DataTable } from '../../../components/common/DataTable';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarCnpj, formatarTelefone } from '../../../utils/masks';
import { restauranteService } from '../services/restauranteService';
import type { Restaurante } from '../types/restauranteTypes';

const statusMap: Record<string, { label: string; className: string }> = {
  ATIVO: {
    label: 'Ativo',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  INATIVO: {
    label: 'Inativo',
    className: 'border-slate-200 bg-slate-100 text-slate-700',
  },
  BLOQUEADO: {
    label: 'Bloqueado',
    className: 'border-red-200 bg-red-50 text-red-700',
  },
};

export function RestaurantesPage() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <section className="grid gap-6">
      <div>
        <div>
          <p className="text-sm font-semibold uppercase text-brand-700">
            Restaurantes
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Listagem de restaurantes
          </h1>
        </div>
      </div>

      {isLoading ? <Loading /> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      {!isLoading && !error ? (
        <DataTable
          items={restaurantes}
          emptyMessage="Nenhum restaurante encontrado."
          searchPlaceholder="Buscar restaurante por nome, CNPJ ou status"
          columns={[
            {
              id: 'restaurante',
              header: 'Restaurante',
              searchValue: (restaurante) =>
                `${restaurante.nome_fantasia} ${restaurante.razao_social} ${restaurante.cnpj}`,
              sortValue: (restaurante) => restaurante.nome_fantasia,
              render: (restaurante) => (
                <div>
                  <div className="font-medium text-slate-950">
                    {restaurante.nome_fantasia}
                  </div>
                  <div className="text-xs text-slate-500">
                    {restaurante.razao_social}
                  </div>
                </div>
              ),
            },
            {
              id: 'cnpj',
              header: 'CNPJ',
              searchValue: (restaurante) => restaurante.cnpj,
              sortValue: (restaurante) => restaurante.cnpj,
              render: (restaurante) => formatarCnpj(restaurante.cnpj),
            },
            {
              id: 'telefone',
              header: 'Telefone',
              searchValue: (restaurante) => restaurante.telefone,
              sortValue: (restaurante) => restaurante.telefone,
              render: (restaurante) => formatarTelefone(restaurante.telefone),
            },
            {
              id: 'status',
              header: 'Status',
              searchValue: (restaurante) => restaurante.status,
              sortValue: (restaurante) =>
                statusMap[restaurante.status]?.label ?? restaurante.status,
              render: (restaurante) => {
                const status = statusMap[restaurante.status] ?? {
                  label: restaurante.status,
                  className: 'border-slate-200 bg-slate-100 text-slate-700',
                };

                return (
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                );
              },
            },
            {
              header: 'Ações',
              render: (restaurante) => (
                <CrudActions viewTo={`/restaurantes/${restaurante.id}`} />
              ),
              className: 'w-28',
            },
          ]}
        />
      ) : null}
    </section>
  );
}
