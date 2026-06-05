import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <section className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase text-brand-700">404</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Pagina nao encontrada
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          A rota acessada nao existe no frontend do Delifit.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
        >
          Voltar ao inicio
        </Link>
      </section>
    </main>
  );
}
