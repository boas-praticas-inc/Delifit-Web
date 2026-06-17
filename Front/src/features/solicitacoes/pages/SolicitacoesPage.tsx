import { useEffect, useMemo, useState } from 'react';

import { Button } from '../../../components/common/Button';
import { Alert } from '../../../components/common/Alert';
import { Input } from '../../../components/common/Input';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarTelefone } from '../../../utils/masks';
import { solicitacaoService } from '../services/solicitacaoService';
import type { Solicitacao } from '../types/solicitacaoTypes';

export function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [adminId, setAdminId] = useState('');
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null);

  const adminIdNumero = useMemo(() => {
    const parsed = Number(adminId);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [adminId]);

  async function carregarSolicitacoes() {
    try {
      setSuccessMessage(null);
      setError(null);
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
    if (!adminIdNumero) {
      setError('Informe o ID do admin para aprovar a solicitação.');
      return;
    }

    try {
      await solicitacaoService.aprovarSolicitacao(solicitacaoId, adminIdNumero);
      await carregarSolicitacoes();
      setSuccessMessage('Solicitacao aprovada. O restaurante foi criado automaticamente.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  async function handleRecusar(solicitacaoId: number) {
    if (!adminIdNumero) {
      setError('Informe o ID do admin para recusar a solicitação.');
      return;
    }

    const motivo = window.prompt('Informe o motivo da recusa:');
    if (!motivo) {
      return;
    }

    try {
      await solicitacaoService.recusarSolicitacao(
        solicitacaoId,
        adminIdNumero,
        motivo,
      );
      await carregarSolicitacoes();
      setSuccessMessage(
        'Solicitacao recusada. O gestor foi notificado pelo status da solicitacao.',
      );
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  function abrirDetalhes(solicitacao: Solicitacao) {
    setSelectedSolicitacao(solicitacao);
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

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <Input
          id="admin-id"
          label="ID do admin"
          type="number"
          min={1}
          value={adminId}
          onChange={(event) => setAdminId(event.target.value)}
        />
        <p className="mt-2 text-xs text-slate-500">
          Informe o identificador do admin antes de aprovar ou recusar.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <div className="p-6">
            <Loading />
          </div>
        ) : null}
        {error ? <div className="p-6 text-sm text-red-700">{error}</div> : null}
        {successMessage ? (
          <div className="p-6">
            <Alert variant="success">{successMessage}</Alert>
          </div>
        ) : null}
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
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => abrirDetalhes(solicitacao)}
                        >
                          Ver detalhes
                        </Button>
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

      {selectedSolicitacao ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-5">
              <div>
                <p className="text-xs font-semibold uppercase text-brand-700">
                  Detalhes da solicitação
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  {selectedSolicitacao.nome_fantasia}
                </h2>
              </div>
              <Button variant="ghost" onClick={() => setSelectedSolicitacao(null)}>
                Fechar
              </Button>
            </div>

            <div className="grid gap-6 overflow-y-auto p-5">
              <section className="grid gap-3 md:grid-cols-2">
                <InfoItem label="Razão social" value={selectedSolicitacao.razao_social} />
                <InfoItem label="CNPJ" value={selectedSolicitacao.cnpj} />
                <InfoItem label="Telefone" value={formatarTelefone(selectedSolicitacao.telefone)} />
                <InfoItem label="Status" value={selectedSolicitacao.status_solicitacao} />
                <InfoItem label="Gestor ID" value={String(selectedSolicitacao.gestor_id)} />
                <InfoItem
                  label="Criado em"
                  value={new Date(selectedSolicitacao.criado_em).toLocaleString('pt-BR')}
                />
              </section>

              <section>
                <h3 className="text-sm font-semibold uppercase text-slate-500">
                  Endereço
                </h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <InfoItem label="CEP" value={selectedSolicitacao.cep} />
                  <InfoItem label="Rua" value={selectedSolicitacao.logradouro} />
                  <InfoItem label="Número" value={selectedSolicitacao.numero} />
                  <InfoItem label="Bairro" value={selectedSolicitacao.bairro} />
                  <InfoItem label="Cidade" value={selectedSolicitacao.cidade} />
                  <InfoItem label="Estado" value={selectedSolicitacao.estado} />
                  <InfoItem
                    label="Complemento"
                    value={selectedSolicitacao.complemento ?? '-'}
                  />
                  <InfoItem
                    label="Referência"
                    value={selectedSolicitacao.referencia ?? '-'}
                  />
                </div>
              </section>

              <section className="grid gap-3 md:grid-cols-2">
                <InfoItem
                  label="Descrição"
                  value={selectedSolicitacao.descricao ?? '-'}
                />
                <InfoItem label="Foto URL" value={selectedSolicitacao.foto_url ?? '-'} />
              </section>

              {selectedSolicitacao.motivo_reprovacao ? (
                <Alert variant="error">
                  Motivo da recusa: {selectedSolicitacao.motivo_reprovacao}
                </Alert>
              ) : null}

              <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-4">
                <Button
                  variant="secondary"
                  disabled={selectedSolicitacao.status_solicitacao !== 'EM_ANALISE'}
                  onClick={() => {
                    void handleAprovar(selectedSolicitacao.id);
                    setSelectedSolicitacao(null);
                  }}
                >
                  Aprovar
                </Button>
                <Button
                  variant="ghost"
                  disabled={selectedSolicitacao.status_solicitacao !== 'EM_ANALISE'}
                  onClick={() => {
                    void handleRecusar(selectedSolicitacao.id);
                    setSelectedSolicitacao(null);
                  }}
                >
                  Recusar
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm text-slate-900">{value}</p>
    </div>
  );
}
