import { useEffect, useState } from 'react';

import { Button } from '../../../components/common/Button';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarTelefone } from '../../../utils/masks';
import { solicitacaoService } from '../services/solicitacaoService';
import type { Solicitacao } from '../types/solicitacaoTypes';

export function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function carregarSolicitacoes() {
    try {
      const data = await solicitacaoService.listarSolicitacoes();
      setSolicitacoes(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void carregarSolicitacoes();
  }, []);

  async function handleAprovar(solicitacaoId: number) {
    const adminId = window.prompt('Informe o ID do admin responsável pela aprovação:');
    if (!adminId) {
      return;
    }

    try {
      await solicitacaoService.aprovarSolicitacao(solicitacaoId, Number(adminId));
      await carregarSolicitacoes();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  async function handleRecusar(solicitacaoId: number) {
    const adminId = window.prompt('Informe o ID do admin responsável pela recusa:');
    if (!adminId) {
      return;
    }

    const motivo = window.prompt('Informe o motivo da recusa:');
    if (!motivo) {
      return;
    }

    try {
      await solicitacaoService.recusarSolicitacao(
        solicitacaoId,
        Number(adminId),
        motivo,
      );
      await carregarSolicitacoes();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase text-brand-700">
          Solicitações
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">
          Solicitações de adesão
        </h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <div className="p-6">
            <Loading />
          </div>
        ) : null}
        {error ? <div className="p-6 text-sm text-red-700">{error}</div> : null}
        {!isLoading && !error && solicitacoes.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            Nenhuma solicitação encontrada.
          </div>
        ) : null}
        {!isLoading && !error && solicitacoes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Restaurante</th>
                  <th className="px-4 py-3">Gestor</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">Cidade</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {solicitacoes.map((solicitacao) => (
                  <tr key={solicitacao.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-950">
                        {solicitacao.nome_fantasia}
                      </div>
                      <div className="text-xs text-slate-500">
                        {solicitacao.razao_social}
                      </div>
                    </td>
                    <td className="px-4 py-3">{solicitacao.gestor_id}</td>
                    <td className="px-4 py-3">
                      {formatarTelefone(solicitacao.telefone)}
                    </td>
                    <td className="px-4 py-3">
                      {solicitacao.cidade}/{solicitacao.estado}
                    </td>
                    <td className="px-4 py-3">{solicitacao.status_solicitacao}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          disabled={solicitacao.status_solicitacao !== 'EM_ANALISE'}
                          onClick={() => void handleAprovar(solicitacao.id)}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="ghost"
                          disabled={solicitacao.status_solicitacao !== 'EM_ANALISE'}
                          onClick={() => void handleRecusar(solicitacao.id)}
                        >
                          Recusar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
