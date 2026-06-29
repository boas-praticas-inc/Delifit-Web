import { useEffect, useState } from 'react';

import { Alert } from '../../../components/common/Alert';
import { Loading } from '../../../components/common/Loading';
import type { Endereco } from '../../enderecos/types/enderecoTypes';
import { getApiErrorMessage } from '../../../lib/api';
import { restauranteService } from '../../restaurantes/services/restauranteService';
import type { Restaurante } from '../../restaurantes/types/restauranteTypes';
import { uploadService } from '../../uploads/services/uploadService';
import { PerfilRestauranteForm } from '../components/PerfilRestauranteForm';
import {
  mapearDadosRestaurante,
  type AtualizarPerfilRestauranteFormData,
} from '../schemas/perfilRestauranteSchemas';
import { gestorContextoService } from '../services/gestorContextoService';
import { gestorEnderecoRestauranteService } from '../services/gestorEnderecoRestauranteService';

export function GestorPerfilPage() {
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [endereco, setEndereco] = useState<Endereco | null>(null);
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

        if (!restauranteAtual) {
          setRestaurante(null);
          setEndereco(null);
          return;
        }

        const enderecoAtual =
          await gestorEnderecoRestauranteService.buscarEnderecoRestaurante();

        setRestaurante(restauranteAtual);
        setEndereco(enderecoAtual);
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
    data: AtualizarPerfilRestauranteFormData,
    fotoArquivo: File | null,
  ) {
    if (!restaurante || !endereco) {
      return;
    }

    setError(null);
    setFeedback(null);

    try {
      const dadosRestaurante = mapearDadosRestaurante(data);
      let fotoUrl = dadosRestaurante.foto_url ?? null;

      if (fotoArquivo) {
        const upload = await uploadService.enviarImagem(fotoArquivo, 'restaurantes');
        fotoUrl = upload.url;
      }

      const [enderecoAtualizado, restauranteAtualizado] = await Promise.all([
        gestorEnderecoRestauranteService.atualizarEnderecoRestaurante({
          cep: data.cep,
          logradouro: data.logradouro,
          numero: data.numero,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          complemento: data.complemento ?? null,
          referencia: data.referencia ?? null,
        }),
        restauranteService.atualizarRestaurante(restaurante.id, {
          gestor_id: restaurante.gestor_id,
          endereco_id: restaurante.endereco_id,
          solicitacao_adesao_id: restaurante.solicitacao_adesao_id,
          nome_fantasia: dadosRestaurante.nome_fantasia,
          razao_social: dadosRestaurante.razao_social,
          cnpj: dadosRestaurante.cnpj,
          telefone: dadosRestaurante.telefone,
          descricao: dadosRestaurante.descricao || null,
          foto_url: fotoUrl,
        }),
      ]);

      setEndereco(enderecoAtualizado);
      setRestaurante(restauranteAtualizado);
      setFeedback('Perfil do restaurante atualizado com sucesso.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  if (isLoading) {
    return <Loading label="Carregando perfil do restaurante" />;
  }

  if (error && (!restaurante || !endereco)) {
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

  if (!endereco) {
    return (
      <section className="grid gap-4">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-700">Perfil</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Perfil do restaurante
          </h1>
        </div>

        <Alert variant="error">
          Não foi possível carregar o endereço vinculado ao restaurante.
        </Alert>
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <PerfilRestauranteForm
        endereco={endereco}
        feedback={feedback}
        formError={error}
        gestorNome={gestorNome}
        onSubmit={handleSubmit}
        restaurante={restaurante}
      />
    </section>
  );
}
