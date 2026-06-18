export function GestorPagamentoPage() {
  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase text-brand-700">
          Pagamento
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">
          Configurações de pagamento
        </h1>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm leading-6 text-slate-600">
          A navegação já contempla a área de pagamento do gestor, preservando o
          layout existente para futuras integrações de mensalidade e recebimento.
        </p>
      </article>
    </section>
  );
}
