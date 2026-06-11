import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { RestauranteForm } from '../components/RestauranteForm';
import { restauranteService } from '../services/restauranteService';
import type { AtualizarRestauranteFormData } from '../schemas/restauranteSchemas';
import type { Restaurante } from '../types/restauranteTypes';
import { usuarioService } from '../../usuarios/services/usuarioService';
import type { Usuario } from '../../usuarios/types/usuarioTypes';

export function EditarRestaurantePage() {
  const { restauranteId } = useParams();
  const navigate = useNavigate();
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [usuarioDono, setUsuarioDono] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      if (!restauranteId) return;
      try {
        const data = await restauranteService.buscarRestaurantePorId(Number(restauranteId));
        setRestaurante(data);
        try {
          const dono = await usuarioService.buscarUsuarioPorId(data.usuario_dono_id);
          setUsuarioDono(dono);
        } catch {
          setUsuarioDono(null);
        }
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
        logo_url: data.logo_url || null,
      });
      setFeedback('Restaurante atualizado com sucesso.');
      navigate('/restaurantes');
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
          Voltar para restaurantes
        </Link>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <div>
        <Link to="/restaurantes" className="text-sm font-semibold text-brand-700">
          Voltar para restaurantes
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Editar restaurante
        </h1>
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-5">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-700">
            Dono do restaurante
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-950">
            Informações do usuário associado
          </h2>
        </div>

        <div className="grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-semibold text-slate-900">ID:</span>{' '}
            {usuarioDono?.id ?? restaurante.usuario_dono_id}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Email:</span>{' '}
            {usuarioDono?.email ?? 'Não disponível no momento'}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Tipo:</span>{' '}
            {usuarioDono?.tipo_usuario ?? 'Não disponível'}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Status:</span>{' '}
            {usuarioDono?.status ?? 'Não disponível'}
          </p>
        </div>
        <p className="text-xs text-slate-500">
          O backend atual de usuários não expõe nome, CPF e telefone. Se quiser,
          a gente pode ampliar esse contrato depois.
        </p>
      </div>

      <RestauranteForm
        mode="edit"
        submitLabel="Salvar alteracoes"
        defaultValues={{
          nome_fantasia: restaurante.nome_fantasia,
          razao_social: restaurante.razao_social,
          cnpj: restaurante.cnpj,
          telefone: restaurante.telefone,
          validado: restaurante.validado,
          logo_url: restaurante.logo_url ?? '',
        }}
        onSubmit={onSubmit}
      />

      {feedback ? <p className="text-sm text-brand-800">{feedback}</p> : null}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </section>
  );
}
