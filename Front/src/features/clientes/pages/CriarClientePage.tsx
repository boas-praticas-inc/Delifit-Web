import { Link } from 'react-router-dom';

export function CriarClientePage() {
  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <div>
        <Link to="/dashboard" className="text-sm font-semibold text-brand-700">
          Voltar para o painel
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Criação de cliente desativada
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          O fluxo atual do sistema foi ajustado para cadastro apenas de gestor.
        </p>
      </div>
    </section>
  );
}
