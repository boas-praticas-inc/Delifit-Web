import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../../../lib/api';
import { uploadService } from '../../uploads/services/uploadService';
import { RestauranteForm } from '../components/RestauranteForm';
import type { CriarRestauranteFormData } from '../schemas/restauranteSchemas';
import { restauranteService } from '../services/restauranteService';

export function CriarRestaurantePage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(
    data: CriarRestauranteFormData,
    fotoArquivo: File | null,
  ) {
    setError(null);

    try {
      let fotoUrl = data.foto_url || null;

      if (fotoArquivo) {
        const upload = await uploadService.enviarImagem(
          fotoArquivo,
          'restaurantes',
        );
        fotoUrl = upload.url;
      }

      await restauranteService.criarRestaurante({
        ...data,
        descricao: data.descricao || null,
        foto_url: fotoUrl,
      });
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
          Adicionar restaurante
        </h1>
      </div>

      <RestauranteForm
        mode="create"
        formError={error}
        submitLabel="Salvar restaurante"
        onSubmit={onSubmit}
      />
    </section>
  );
}
