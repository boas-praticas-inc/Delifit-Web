import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { gestorService } from '../features/gestores/services/gestorService';
import { solicitacaoService } from '../features/solicitacoes/services/solicitacaoService';
import { getApiErrorMessage } from '../lib/api';

export function HomePage() {
  const [resumo, setResumo] = useState({
    solicitacoes: 0,
    pendentes: 0,
    gestores: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarResumo() {
      try {
        const [solicitacoes, gestores] = await Promise.all([
          solicitacaoService.listarSolicitacoes(),
          gestorService.listarGestores(),
        ]);

        setResumo({
          solicitacoes: solicitacoes.length,
          pendentes: solicitacoes.filter(
            (item) => item.status_solicitacao === 'EM_ANALISE',
          ).length,
          gestores: gestores.length,
        });
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      }
    }

    void carregarResumo();
  }, []);

  return (
    <section className="grid gap-6">
      <div className="rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-200">
          Painel principal
        </p>
        <h1 className="mt-3 text-3xl font-bold">Gestão Delifit</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
          Acompanhe solicitações de adesão e siga o fluxo de cadastro do gestor
          até o envio dos dados do restaurante.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/usuarios/novo" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Novo gestor</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {resumo.gestores}
          </p>
        </Link>
        <Link to="/solicitacoes" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Solicitações recebidas</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {resumo.solicitacoes}
          </p>
        </Link>
        <Link to="/solicitacoes" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Solicitações pendentes</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {resumo.pendentes}
          </p>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Link to="/usuarios/novo" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Cadastrar gestor</h2>
          <p className="mt-2 text-sm text-slate-600">
            Crie apenas o cadastro do gestor e siga para a solicitação de adesão.
          </p>
        </Link>
        <Link to="/solicitacoes" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Analisar solicitações</h2>
          <p className="mt-2 text-sm text-slate-600">
            Visualize as solicitações já enviadas e acompanhe o status.
          </p>
        </Link>
      </div>
    </section>
  );
}
