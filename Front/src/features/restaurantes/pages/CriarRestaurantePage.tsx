import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api';
import { RestauranteForm } from '../components/RestauranteForm';
import type { CriarRestauranteFormData } from '../schemas/restauranteSchemas';
import { restauranteService } from '../services/restauranteService';

export function CriarRestaurantePage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: CriarRestauranteFormData) {
    setFeedback(null);
    setError(null);

    try {
      await restauranteService.criarRestaurante({
        ...data,
        descricao: data.descricao || null,
        foto_url: data.foto_url || null,
      });
      setFeedback('Restaurante criado com sucesso.');
      navigate('/restaurantes');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <div>
        <Link to="/restaurantes" className="text-sm font-semibold text-brand-700">
          Voltar para Restaurantes
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Adicionar Restaurante
        </h1>
      </div>

      <RestauranteForm
        mode="create"
        submitLabel="Salvar restaurante"
        onSubmit={onSubmit}
      />

      {feedback ? <p className="text-sm text-brand-800">{feedback}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
