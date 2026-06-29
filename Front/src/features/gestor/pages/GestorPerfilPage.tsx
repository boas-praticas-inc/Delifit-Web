import { useEffect, useState } from 'react';

import { Alert } from '../../../components/common/Alert';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { restauranteService } from '../../restaurantes/services/restauranteService';
import type { AtualizarRestauranteFormData } from '../../restaurantes/schemas/restauranteSchemas';
import type { Restaurante } from '../../restaurantes/types/restauranteTypes';
import { uploadService } from '../../uploads/services/uploadService';
import { PerfilRestauranteForm } from '../components/PerfilRestauranteForm';
import { gestorContextoService } from '../services/gestorContextoService';

const ENDERECO_INDISPONIVEL =
  'Endereço vinculado disponível no cadastro interno.';

export function GestorPerfilPage() {
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [gestorNome, setGestorNome] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setIsLoading(true);
      setError(null);

      try {
        const { gestor, restaurante: restauranteAtual } =
          await gestorContextoService.buscarContextoAtual();

        setGestorNome(gestor?.nome_completo ?? 'Gestor não encontrado');
        setRestaurante(restauranteAtual ?? null);
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

  async function handleSubmit(
    data: AtualizarRestauranteFormData,
    fotoArquivo: File | null,
  ) {
    if (!restaurante) {
      return;
    }

    setError(null);
    setFeedback(null);

    try {
      let fotoUrl = data.foto_url ?? null;

      if (fotoArquivo) {
        const upload = await uploadService.enviarImagem(fotoArquivo, 'restaurantes');
        fotoUrl = upload.url;
      }

      const restauranteAtualizado = await restauranteService.atualizarRestaurante(
        restaurante.id,
        {
          gestor_id: restaurante.gestor_id,
          endereco_id: restaurante.endereco_id,
          solicitacao_adesao_id: restaurante.solicitacao_adesao_id,
          nome_fantasia: data.nome_fantasia,
          razao_social: data.razao_social,
          cnpj: data.cnpj,
          telefone: data.telefone,
          descricao: data.descricao || null,
          foto_url: fotoUrl,
        },
      );

      setRestaurante(restauranteAtualizado);
      setFeedback('Perfil do restaurante atualizado com sucesso.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  if (isLoading) {
    return <Loading label="Carregando perfil do restaurante" />;
  }

  if (error && !restaurante) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (!restaurante) {
    return (
      <section className="grid gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-700">Perfil</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Perfil do restaurante
          </h1>
        </div>

        <Alert>
          O gestor ainda não possui restaurante aprovado vinculado para gerenciar o
          perfil.
        </Alert>
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <PerfilRestauranteForm
        enderecoFormatado={ENDERECO_INDISPONIVEL}
        feedback={feedback}
        formError={error}
        gestorNome={gestorNome}
        onSubmit={handleSubmit}
        restaurante={restaurante}
      />
    </section>
  );
}
