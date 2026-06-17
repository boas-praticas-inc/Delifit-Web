import { useEffect, useState } from 'react';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { DataTable } from '../../../components/common/DataTable';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarTelefone } from '../../../utils/masks';
import { adminService } from '../../admins/services/adminService';
import { getUsuarioLogado } from '../../auth/utils/session';
import { solicitacaoService } from '../services/solicitacaoService';
import type { Solicitacao } from '../types/solicitacaoTypes';

const statusMap: Record<Solicitacao['status_solicitacao'], { label: string; className: string }> = {
  EM_ANALISE: {
    label: 'Em análise',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  APROVADO: {
    label: 'Aprovado',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  REPROVADO: {
    label: 'Reprovado',
    className: 'border-red-200 bg-red-50 text-red-700',
  },
};

export function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function carregarSolicitacoes() {
    try {
      setError(null);

      const usuario = getUsuarioLogado();
      if (!usuario || usuario.tipo_usuario !== 'ADMIN') {
        setError('Faça login como administrador para analisar as solicitações.');
        return;
      }

      const [admins, data] = await Promise.all([
        adminService.listarAdmins(),
        solicitacaoService.listarSolicitacoes(),
      ]);

      let admin = admins.find((item) => item.usuario_id === usuario.id);

      if (!admin) {
        admin = await adminService.criarAdmin({
          usuario_id: usuario.id,
          nome_completo: usuario.email,
          cargo: null,
        });
      }

      setAdminId(admin.id);
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
    if (!adminId) {
      setError('Administrador logado não encontrado.');
      return;
    }

    try {
      await solicitacaoService.aprovarSolicitacao(solicitacaoId, adminId);
      await carregarSolicitacoes();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  async function handleRecusar(solicitacaoId: number) {
    if (!adminId) {
      setError('Administrador logado não encontrado.');
      return;
    }

    const motivo = window.prompt('Informe o motivo da recusa:');
    if (!motivo) {
      return;
    }

    try {
      await solicitacaoService.recusarSolicitacao(solicitacaoId, adminId, motivo);
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

      {isLoading ? <Loading /> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      {!isLoading && !error ? (
        <DataTable
          items={solicitacoes}
          emptyMessage="Nenhuma solicitação encontrada."
          searchPlaceholder="Buscar por restaurante, cidade ou status"
          columns={[
            {
              header: 'Restaurante',
              searchValue: (solicitacao) =>
                `${solicitacao.nome_fantasia} ${solicitacao.razao_social} ${solicitacao.cidade} ${solicitacao.status_solicitacao}`,
              render: (solicitacao) => (
                <div>
                  <div className="font-medium text-slate-950">
                    {solicitacao.nome_fantasia}
                  </div>
                  <div className="text-xs text-slate-500">
                    {solicitacao.razao_social}
                  </div>
                </div>
              ),
            },
            {
              header: 'Contato',
              searchValue: (solicitacao) => solicitacao.telefone,
              render: (solicitacao) => formatarTelefone(solicitacao.telefone),
            },
            {
              header: 'Local',
              searchValue: (solicitacao) =>
                `${solicitacao.cidade} ${solicitacao.estado}`,
              render: (solicitacao) =>
                `${solicitacao.cidade}/${solicitacao.estado}`,
            },
            {
              header: 'Status',
              searchValue: (solicitacao) => solicitacao.status_solicitacao,
              render: (solicitacao) => {
                const status = statusMap[solicitacao.status_solicitacao];

                return (
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                );
              },
            },
            {
              header: 'Ações',
              render: (solicitacao) => (
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
              ),
              className: 'w-52',
            },
          ]}
        />
      ) : null}
    </section>
  );
}
