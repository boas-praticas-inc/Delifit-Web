const metrics = [
  { label: 'Usuarios', value: 'API' },
  { label: 'Restaurantes', value: 'Em preparo' },
  { label: 'Pedidos', value: 'Em preparo' },
];

export function DashboardPage() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase text-brand-700">
          Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">
          Visao geral do Delifit
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Area inicial para acompanhar a operacao web. Os indicadores podem ser
          conectados aos endpoints do backend conforme eles evoluirem.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-lg border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">
              {metric.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
