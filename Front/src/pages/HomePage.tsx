import { Link } from 'react-router-dom';

const highlights = [
  'Entrega de comidas fitness',
  'Perfis de cliente, restaurante, entregador e administrador',
  'Frontend pronto para API REST versionada',
];

export function HomePage() {
  return (
    <main className="min-h-screen bg-brand-50">
      <section className="mx-auto grid min-h-screen max-w-6xl content-center gap-10 px-4 py-10 md:grid-cols-[1fr_0.85fr] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-700">
            Delifit web
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Sistema web para entrega de comidas fitness
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">
            Estrutura inicial em React preparada para crescer junto com o
            backend, mantendo rotas, services, validacoes e telas organizadas
            por funcionalidade.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              Abrir painel
            </Link>
            <Link
              to="/login"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-900 transition hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
            >
              Entrar
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-brand-100 bg-white p-6 shadow-soft">
          <ul className="grid gap-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="border-b border-slate-100 pb-3 text-sm font-medium text-slate-700 last:border-b-0 last:pb-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
