import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { clienteService } from '../features/clientes/services/clienteService';
import { restauranteService } from '../features/restaurantes/services/restauranteService';
import { solicitacaoService } from '../features/solicitacoes/services/solicitacaoService';
import { getApiErrorMessage } from '../lib/api';

export function HomePage() {
  const [resumo, setResumo] = useState({
    clientes: 0,
    restaurantes: 0,
    solicitacoes: 0,
    pendentes: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarResumo() {
      try {
        const [clientes, restaurantes, solicitacoes] = await Promise.all([
          clienteService.listarClientes(),
          restauranteService.listarRestaurantes(),
          solicitacaoService.listarSolicitacoes(),
        ]);

        setResumo({
          clientes: clientes.length,
          restaurantes: restaurantes.length,
          solicitacoes: solicitacoes.length,
          pendentes: solicitacoes.filter(
            (item) => item.status_solicitacao === 'EM_ANALISE',
          ).length,
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
          Painel administrativo
        </p>
        <h1 className="mt-3 text-3xl font-bold">Home do administrador</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
          Gerencie clientes, restaurantes e solicitações de adesão a partir da
          tela principal do sistema.
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link to="/clientes" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Clientes cadastrados</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{resumo.clientes}</p>
        </Link>
        <Link to="/restaurantes" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Restaurantes cadastrados</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{resumo.restaurantes}</p>
        </Link>
        <Link to="/solicitacoes" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Solicitações Recebidas</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{resumo.solicitacoes}</p>
        </Link>
        <Link to="/solicitacoes" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Solicitações Pendentes</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{resumo.pendentes}</p>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Link to="/solicitacoes" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Analisar Solicitações</h2>
          <p className="mt-2 text-sm text-slate-600">
            Aprove ou recuse pedidos de adesão de novos restaurantes.
          </p>
        </Link>
        <Link to="/clientes/novo" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Adicionar Cliente</h2>
          <p className="mt-2 text-sm text-slate-600">
            Cadastre novos clientes com usuário e dados pessoais.
          </p>
        </Link>
        <Link to="/restaurantes/novo" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Adicionar Restaurante</h2>
          <p className="mt-2 text-sm text-slate-600">
            Crie restaurantes vinculando gestor, endereço e solicitação.
          </p>
        </Link>
      </div>
    </section>
  );
}
