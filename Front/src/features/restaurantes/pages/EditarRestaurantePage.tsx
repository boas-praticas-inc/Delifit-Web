import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { RestauranteForm } from '../components/RestauranteForm';
import type { AtualizarRestauranteFormData } from '../schemas/restauranteSchemas';
import { restauranteService } from '../services/restauranteService';
import type { Restaurante } from '../types/restauranteTypes';

export function EditarRestaurantePage() {
  const { restauranteId } = useParams();
  const navigate = useNavigate();
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      if (!restauranteId) return;

      try {
        const data = await restauranteService.buscarRestaurantePorId(Number(restauranteId));
        setRestaurante(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void carregar();
  }, [restauranteId]);

  async function onSubmit(data: AtualizarRestauranteFormData) {
    if (!restauranteId) return;

    setError(null);
    setFeedback(null);

    try {
      await restauranteService.atualizarRestaurante(Number(restauranteId), {
        ...data,
        descricao: data.descricao || null,
        foto_url: data.foto_url || null,
      });
      setFeedback('Restaurante atualizado com sucesso.');
      navigate(`/restaurantes/${restauranteId}`);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  if (!restaurante) {
    return (
      <section className="grid gap-4">
        <Link to="/restaurantes" className="text-sm font-semibold text-brand-700">
          Voltar para Restaurantes
        </Link>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <div>
        <Link to={`/restaurantes/${restaurante.id}`} className="text-sm font-semibold text-brand-700">
          Voltar para Detalhes
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Editar Restaurante
        </h1>
      </div>

      <RestauranteForm
        mode="edit"
        submitLabel="Salvar Alterações"
        defaultValues={{
          gestor_id: restaurante.gestor_id,
          endereco_id: restaurante.endereco_id,
          solicitacao_adesao_id: restaurante.solicitacao_adesao_id ?? null,
          nome_fantasia: restaurante.nome_fantasia,
          razao_social: restaurante.razao_social,
          cnpj: restaurante.cnpj,
          telefone: restaurante.telefone,
          descricao: restaurante.descricao ?? '',
          foto_url: restaurante.foto_url ?? '',
        }}
        onSubmit={onSubmit}
      />

      {feedback ? <p className="text-sm text-brand-800">{feedback}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
