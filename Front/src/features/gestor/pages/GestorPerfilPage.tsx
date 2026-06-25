import { useEffect, useState } from 'react';

import { Alert } from '../../../components/common/Alert';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarCpf, formatarTelefone } from '../../../utils/masks';
import { gestorContextoService } from '../services/gestorContextoService';

type PerfilState = {
  nome: string;
  cpf: string;
  telefone: string;
  restaurante: string;
  cnpj: string;
};

export function GestorPerfilPage() {
  const [perfil, setPerfil] = useState<PerfilState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const { gestor, restaurante } =
          await gestorContextoService.buscarContextoAtual();
        setPerfil({
          nome: gestor?.nome_completo ?? 'Gestor não encontrado',
          cpf: gestor?.cpf ?? '',
          telefone: gestor?.telefone ?? '',
          restaurante: restaurante?.nome_fantasia ?? 'Nenhum restaurante vinculado',
          cnpj: restaurante?.cnpj ?? '',
        });
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : getApiErrorMessage(requestError),
        );
      } finally {
        setIsLoading(false);
      }
    }

    void carregar();
  }, []);

  if (isLoading) {
    return <Loading label="Carregando perfil" />;
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase text-brand-700">Perfil</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">
          Dados do gestor
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PerfilCard label="Nome completo" value={perfil?.nome ?? 'Não informado'} />
        <PerfilCard
          label="CPF"
          value={perfil?.cpf ? formatarCpf(perfil.cpf) : 'Não informado'}
        />
        <PerfilCard
          label="Telefone"
          value={
            perfil?.telefone ? formatarTelefone(perfil.telefone) : 'Não informado'
          }
        />
        <PerfilCard
          label="Restaurante"
          value={perfil?.restaurante ?? 'Não informado'}
        />
        <PerfilCard label="CNPJ" value={perfil?.cnpj ?? 'Não informado'} />
      </div>
    </section>
  );
}

function PerfilCard(props: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {props.label}
      </p>
      <p className="mt-3 text-base font-semibold text-slate-950">{props.value}</p>
    </article>
  );
}
