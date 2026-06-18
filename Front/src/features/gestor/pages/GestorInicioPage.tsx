import { useEffect, useState } from 'react';

import { Alert } from '../../../components/common/Alert';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarTelefone } from '../../../utils/masks';
import { gestorContextoService } from '../services/gestorContextoService';

export function GestorInicioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restauranteNome, setRestauranteNome] = useState<string | null>(null);
  const [restauranteTelefone, setRestauranteTelefone] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function carregar() {
      try {
        const { restaurante } = await gestorContextoService.buscarContextoAtual();
        setRestauranteNome(restaurante?.nome_fantasia ?? null);
        setRestauranteTelefone(restaurante?.telefone ?? null);
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
    return <Loading label="Carregando painel do gestor" />;
  }

  return (
    <section className="grid gap-6">
      <div className="rounded-3xl bg-brand-900 px-6 py-8 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">
          Início
        </p>
        <h1 className="mt-3 text-3xl font-bold">Gerenciar pedidos</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-50">
          A área inicial do gestor está pronta para centralizar os pedidos do
          restaurante, acompanhar o status operacional e acessar rapidamente o
          cardápio.
        </p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <ResumoCard
          titulo="Pedidos pendentes"
          valor="0"
          descricao="Aguardando integração com fluxo de pedidos."
        />
        <ResumoCard
          titulo="Em preparo"
          valor="0"
          descricao="Visão rápida para a cozinha."
        />
        <ResumoCard
          titulo="Entregues hoje"
          valor="0"
          descricao="Indicador diário do restaurante."
        />
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Operação do restaurante</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <InfoLinha
            label="Restaurante"
            value={restauranteNome ?? 'Nenhum restaurante vinculado'}
          />
          <InfoLinha
            label="Telefone"
            value={
              restauranteTelefone
                ? formatarTelefone(restauranteTelefone)
                : 'Não informado'
            }
          />
        </div>
      </article>

      <article className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <h2 className="text-lg font-bold text-slate-950">Fila de pedidos</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Esta tela foi estruturada como página inicial do gestor. Assim que o
          módulo de pedidos estiver conectado, os cards e a fila abaixo poderão
          consumir os mesmos padrões de layout já preparados aqui.
        </p>
      </article>
    </section>
  );
}

function ResumoCard(props: { titulo: string; valor: string; descricao: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {props.titulo}
      </p>
      <p className="mt-3 text-3xl font-bold text-slate-950">{props.valor}</p>
      <p className="mt-2 text-sm text-slate-600">{props.descricao}</p>
    </article>
  );
}

function InfoLinha(props: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {props.label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-900">{props.value}</p>
    </div>
  );
}
