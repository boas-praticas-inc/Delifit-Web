import { Link } from 'react-router-dom';

import { adminData } from '../features/admin/adminData';

export function HomePage() {
  const clientes = adminData.listarClientes();
  const restaurantes = adminData.listarRestaurantes();
  const clientesAtivos = clientes.filter((cliente) => cliente.status === 'ATIVO');
  const restaurantesAtivos = restaurantes.filter(
    (restaurante) => restaurante.status === 'ATIVO',
  );

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase text-brand-700">
          Inicio
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">
          Home do ADM
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Gerencie clientes e restaurantes cadastrados no Delifit.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Clientes" value={clientes.length} />
        <Metric label="Clientes ativos" value={clientesAtivos.length} />
        <Metric label="Restaurantes" value={restaurantes.length} />
        <Metric label="Restaurantes ativos" value={restaurantesAtivos.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Clientes</h2>
              <p className="mt-1 text-sm text-slate-600">
                Liste, cadastre, edite e remova clientes.
              </p>
            </div>
            <Link
              to="/clientes/novo"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Adicionar
            </Link>
          </div>
          <Link
            to="/clientes"
            className="mt-4 inline-flex text-sm font-semibold text-brand-700"
          >
            Abrir lista de clientes
          </Link>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Restaurantes
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Liste, cadastre, edite e remova restaurantes.
              </p>
            </div>
            <Link
              to="/restaurantes/novo"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Adicionar
            </Link>
          </div>
          <Link
            to="/restaurantes"
            className="mt-4 inline-flex text-sm font-semibold text-brand-700"
          >
            Abrir lista de restaurantes
          </Link>
        </section>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
    </article>
  );
}
