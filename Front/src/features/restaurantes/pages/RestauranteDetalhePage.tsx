import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { LinkButton } from '../../../components/common/LinkButton';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { formatarCnpj, formatarTelefone } from '../../../utils/masks';
import { restauranteService } from '../services/restauranteService';
import type { Restaurante } from '../types/restauranteTypes';

export function RestauranteDetalhePage() {
  const { restauranteId } = useParams();
  const navigate = useNavigate();
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarRestaurante() {
      if (!restauranteId) {
        return;
      }

      try {
        const data = await restauranteService.buscarRestaurantePorId(
          Number(restauranteId),
        );
        setRestaurante(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      }
    }

    void carregarRestaurante();
  }, [restauranteId]);

  async function handleExcluir() {
    if (!restauranteId || !window.confirm('Deseja remover este restaurante?')) {
      return;
    }

    try {
      await restauranteService.excluirRestaurante(Number(restauranteId));
      navigate('/restaurantes');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  if (!restaurante && !error) {
    return <Loading />;
  }

  if (!restaurante) {
    return <Alert variant="error">{error ?? 'Restaurante não encontrado.'}</Alert>;
  }

  return (
    <section className="grid gap-6">
      <div>
        <Link to="/restaurantes" className="text-sm font-semibold text-brand-700">
          Voltar para restaurantes
        </Link>
        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">
            Perfil do restaurante
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            {restaurante.nome_fantasia}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {restaurante.razao_social}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard label="CNPJ" value={formatarCnpj(restaurante.cnpj)} />
        <InfoCard label="Telefone" value={formatarTelefone(restaurante.telefone)} />
        <InfoCard label="Status" value={restaurante.status} />
        <InfoCard label="Categoria" value="Restaurante parceiro" />
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Descrição
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          {restaurante.descricao ?? 'Não informada.'}
        </p>
      </article>

      <div className="flex flex-col gap-3 sm:flex-row">
        <LinkButton to={`/restaurantes/${restaurante.id}/editar`}>
          Editar
        </LinkButton>
        <Button variant="secondary" onClick={() => void handleExcluir()}>
          Remover
        </Button>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}
    </section>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-lg font-semibold text-slate-950">{value}</p>
    </article>
  );
}
