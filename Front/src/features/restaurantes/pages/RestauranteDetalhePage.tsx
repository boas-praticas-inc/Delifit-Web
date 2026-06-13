import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button } from '../../../components/common/Button';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
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
    return <p className="text-sm text-red-700">{error}</p>;
  }

  return (
    <section className="grid gap-6">
      <div>
        <Link to="/restaurantes" className="text-sm font-semibold text-brand-700">
          Voltar para Restaurantes
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Detalhes do Restaurante
        </h1>
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <p><span className="font-semibold text-slate-950">ID:</span> {restaurante.id}</p>
        <p><span className="font-semibold text-slate-950">Gestor ID:</span> {restaurante.gestor_id}</p>
        <p><span className="font-semibold text-slate-950">Endereço ID:</span> {restaurante.endereco_id}</p>
        <p><span className="font-semibold text-slate-950">Solicitação ID:</span> {restaurante.solicitacao_adesao_id ?? 'Não vinculada'}</p>
        <p><span className="font-semibold text-slate-950">Nome fantasia:</span> {restaurante.nome_fantasia}</p>
        <p><span className="font-semibold text-slate-950">Razão social:</span> {restaurante.razao_social}</p>
        <p><span className="font-semibold text-slate-950">CNPJ:</span> {restaurante.cnpj}</p>
        <p><span className="font-semibold text-slate-950">Telefone:</span> {restaurante.telefone}</p>
        <p><span className="font-semibold text-slate-950">Status:</span> {restaurante.status}</p>
        <p><span className="font-semibold text-slate-950">Descrição:</span> {restaurante.descricao ?? 'Não informada'}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to={`/restaurantes/${restaurante.id}/editar`}
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Editar
        </Link>
        <Button variant="secondary" onClick={() => void handleExcluir()}>
          Remover
        </Button>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
