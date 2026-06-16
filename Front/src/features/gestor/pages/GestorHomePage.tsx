import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Alert } from '../../../components/common/Alert';
import { Loading } from '../../../components/common/Loading';
import { gestorService } from '../../gestores/services/gestorService';
import type { Usuario } from '../../usuarios/types/usuarioTypes';
import { solicitacaoService } from '../../solicitacoes/services/solicitacaoService';
import type { Solicitacao } from '../../solicitacoes/types/solicitacaoTypes';

const statusLabels: Record<Solicitacao['status_solicitacao'], string> = {
  EM_ANALISE: 'Em analise',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
};

const statusClasses: Record<Solicitacao['status_solicitacao'], string> = {
  EM_ANALISE: 'bg-amber-50 text-amber-800 border-amber-200',
  APROVADO: 'bg-brand-50 text-brand-900 border-brand-200',
  REPROVADO: 'bg-red-50 text-red-700 border-red-200',
};

export function GestorHomePage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarSolicitacoes() {
      setIsLoading(true);
      setError(null);

      try {
        const usuario = getUsuarioLogado();

        if (!usuario) {
          setError('Faca login como gestor para visualizar suas solicitacoes.');
          return;
        }

        const [gestores, todasSolicitacoes] = await Promise.all([
          gestorService.listarGestores(),
          solicitacaoService.listarSolicitacoes(),
        ]);
        const gestor = gestores.find((item) => item.usuario_id === usuario.id);

        if (!gestor) {
          setSolicitacoes([]);
          return;
        }

        setSolicitacoes(
          todasSolicitacoes.filter((item) => item.gestor_id === gestor.id),
        );
      } catch {
        setError('Nao foi possivel carregar as solicitacoes.');
      } finally {
        setIsLoading(false);
      }
    }

    void carregarSolicitacoes();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/gestor" className="flex items-center gap-3 font-bold">
            <span className="grid size-10 place-items-center rounded-md bg-brand-600 text-white">
              D
            </span>
            <span className="text-lg text-brand-900">Delifit Gestor</span>
          </Link>
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Sair
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6">
        <div className="rounded-2xl bg-brand-900 px-6 py-8 text-white shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">
            Painel do gestor
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Solicitacoes</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-50">
                Acompanhe o status da sua solicitacao de adesao conforme
                registrado no banco.
              </p>
            </div>
            <Link
              to="/solicitar-adesao"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-brand-900 transition hover:bg-brand-50"
            >
              Solicitar adesao
            </Link>
          </div>
        </div>

        {isLoading ? <Loading label="Carregando solicitacoes" /> : null}

        {error ? <Alert variant="error">{error}</Alert> : null}

        {!isLoading && !error && solicitacoes.length === 0 ? (
          <Alert>Nenhuma solicitacao vinculada ao seu gestor foi encontrada.</Alert>
        ) : null}

        {!isLoading && solicitacoes.length > 0 ? (
          <div className="grid gap-4">
            {solicitacoes.map((solicitacao) => (
              <article
                key={solicitacao.id}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">
                      {solicitacao.nome_fantasia}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {solicitacao.razao_social} - CNPJ {solicitacao.cnpj}
                    </p>
                  </div>
                  <span
                    className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold ${statusClasses[solicitacao.status_solicitacao]}`}
                  >
                    {statusLabels[solicitacao.status_solicitacao]}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-slate-700">Endereco</dt>
                    <dd className="mt-1 text-slate-600">
                      {solicitacao.logradouro}, {solicitacao.numero} -{' '}
                      {solicitacao.bairro}, {solicitacao.cidade}/
                      {solicitacao.estado}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-700">Criada em</dt>
                    <dd className="mt-1 text-slate-600">
                      {new Date(solicitacao.criado_em).toLocaleString('pt-BR')}
                    </dd>
                  </div>
                  {solicitacao.motivo_reprovacao ? (
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-slate-700">
                        Motivo da recusa
                      </dt>
                      <dd className="mt-1 text-slate-600">
                        {solicitacao.motivo_reprovacao}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function getUsuarioLogado() {
  const rawUsuario = localStorage.getItem('delifit_usuario');

  if (!rawUsuario) {
    return null;
  }

  try {
    return JSON.parse(rawUsuario) as Usuario;
  } catch {
    return null;
  }
}
