import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { adminData } from '../../admin/adminData';

export function ClienteDetalhePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const clienteId = id ? Number(id) : NaN;
  const cliente = Number.isNaN(clienteId)
    ? null
    : adminData.buscarCliente(clienteId);

  if (!cliente) {
    return <Navigate to="/clientes" replace />;
  }

  function removerCliente() {
    const confirmou = window.confirm('Remover este cliente?');

    if (confirmou) {
      adminData.removerCliente(cliente.id);
      navigate('/clientes');
    }
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/clientes" className="text-sm font-semibold text-brand-700">
            Voltar para clientes
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-slate-950">
            {cliente.nome}
          </h1>
          <p className="mt-1 text-sm text-slate-600">Detalhes do cliente</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/clientes/${cliente.id}/editar`}
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Editar
          </Link>
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            onClick={removerCliente}
          >
            Remover
          </button>
        </div>
      </div>

      <dl className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <Detail label="ID" value={String(cliente.id)} />
        <Detail label="Status" value={cliente.status} />
        <Detail label="Email" value={cliente.email} />
        <Detail label="Telefone" value={cliente.telefone} />
        <Detail label="CPF" value={cliente.cpf} />
        <Detail
          label="Criado em"
          value={new Date(cliente.criadoEm).toLocaleDateString('pt-BR')}
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
