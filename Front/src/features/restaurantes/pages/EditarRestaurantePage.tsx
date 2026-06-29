import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Alert } from '../../../components/common/Alert';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { enderecoService } from '../../enderecos/services/enderecoService';
import type { Endereco } from '../../enderecos/types/enderecoTypes';
import { gestorService } from '../../gestores/services/gestorService';
import type { Gestor } from '../../gestores/types/gestorTypes';
import { solicitacaoService } from '../../solicitacoes/services/solicitacaoService';
import type { Solicitacao } from '../../solicitacoes/types/solicitacaoTypes';
import { uploadService } from '../../uploads/services/uploadService';
import { RestauranteForm } from '../components/RestauranteForm';
import type { AtualizarRestauranteFormData } from '../schemas/restauranteSchemas';
import { restauranteService } from '../services/restauranteService';
import type { Restaurante } from '../types/restauranteTypes';

export function EditarRestaurantePage() {
  const { restauranteId } = useParams();
  const navigate = useNavigate();
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [gestor, setGestor] = useState<Gestor | null>(null);
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      if (!restauranteId) {
        return;
      }

      try {
        const data = await restauranteService.buscarRestaurantePorId(
          Number(restauranteId),
        );
        setRestaurante(data);

        const [gestores, enderecos, solicitacoes] = await Promise.all([
          gestorService.listarGestores(),
          enderecoService.listarEnderecos(),
          solicitacaoService.listarSolicitacoes(),
        ]);

        setGestor(gestores.find((item) => item.id === data.gestor_id) ?? null);
        setEndereco(
          enderecos.find((item) => item.id === data.endereco_id) ?? null,
        );
        setSolicitacao(
          solicitacoes.find((item) => item.id === data.solicitacao_adesao_id) ??
            null,
        );
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void carregar();
  }, [restauranteId]);

  async function onSubmit(
    data: AtualizarRestauranteFormData,
    fotoArquivo: File | null,
  ) {
    if (!restauranteId || !restaurante) {
      return;
    }

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

      await restauranteService.atualizarRestaurante(Number(restauranteId), {
        gestor_id: restaurante.gestor_id,
        endereco_id: restaurante.endereco_id,
        solicitacao_adesao_id: restaurante.solicitacao_adesao_id,
        nome_fantasia: data.nome_fantasia,
        razao_social: data.razao_social,
        cnpj: data.cnpj,
        telefone: data.telefone,
        descricao: data.descricao || null,
        foto_url: fotoUrl,
      });
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
        <Link
          to="/restaurantes"
          className="text-sm font-semibold text-brand-700"
        >
          Voltar para restaurantes
        </Link>
        {error ? <Alert variant="error">{error}</Alert> : null}
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <div>
        <Link
          to={`/restaurantes/${restaurante.id}`}
          className="text-sm font-semibold text-brand-700"
        >
          Voltar para detalhes
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-950">
          Editar restaurante
        </h1>
      </div>

      <RestauranteForm
        mode="edit"
        submitLabel="Salvar alterações"
        formError={error}
        defaultValues={{
          nome_fantasia: restaurante.nome_fantasia,
          razao_social: restaurante.razao_social,
          cnpj: restaurante.cnpj,
          telefone: restaurante.telefone,
          descricao: restaurante.descricao ?? '',
          foto_url: restaurante.foto_url ?? '',
        }}
        relationLabels={{
          gestor: gestor?.nome_completo ?? 'Gestor não encontrado',
          endereco: endereco
            ? `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}/${endereco.estado}`
            : 'Endereço não encontrado',
          solicitacao: solicitacao
            ? `${solicitacao.nome_fantasia} - ${solicitacao.status_solicitacao}`
            : 'Sem vinculação',
        }}
        onSubmit={onSubmit}
      />
    </section>
  );
}
