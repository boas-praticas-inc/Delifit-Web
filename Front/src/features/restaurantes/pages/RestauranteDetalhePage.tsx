import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { adminData } from '../../admin/adminData';

export function RestauranteDetalhePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const restauranteId = id ? Number(id) : NaN;
  const restaurante = Number.isNaN(restauranteId)
    ? null
    : adminData.buscarRestaurante(restauranteId);

  if (!restaurante) {
    return <Navigate to="/restaurantes" replace />;
  }

  function removerRestaurante() {
    const confirmou = window.confirm('Remover este restaurante?');

    if (confirmou) {
      adminData.removerRestaurante(restaurante.id);
      navigate('/restaurantes');
    }
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/restaurantes"
            className="text-sm font-semibold text-brand-700"
          >
            Voltar para restaurantes
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-slate-950">
            {restaurante.nomeFantasia}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Detalhes do restaurante
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/restaurantes/${restaurante.id}/editar`}
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Editar
          </Link>
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            onClick={removerRestaurante}
          >
            Remover
          </button>
        </div>
      </div>

      <dl className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <Detail label="ID" value={String(restaurante.id)} />
        <Detail label="Status" value={restaurante.status} />
        <Detail label="Razao social" value={restaurante.razaoSocial} />
        <Detail label="CNPJ" value={restaurante.cnpj} />
        <Detail label="Email" value={restaurante.email} />
        <Detail label="Telefone" value={restaurante.telefone} />
        <Detail
          label="Criado em"
          value={new Date(restaurante.criadoEm).toLocaleDateString('pt-BR')}
        />
      </dl>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}
