import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Alert } from '../../../components/common/Alert';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { ItemCardapioForm } from '../../cardapio/components/ItemCardapioForm';
import type { ItemCardapioFormData } from '../../cardapio/schemas/itemCardapioSchemas';
import { categoriaCardapioService } from '../../cardapio/services/categoriaCardapioService';
import { itemCardapioService } from '../../cardapio/services/itemCardapioService';
import type { CategoriaCardapio } from '../../cardapio/types/categoriaCardapioTypes';
import { gestorContextoService } from '../services/gestorContextoService';

export function GestorNovoItemCardapioPage() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState<CategoriaCardapio[]>([]);
  const [restauranteId, setRestauranteId] = useState<number | null>(null);
  const [restauranteNome, setRestauranteNome] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const [{ restaurante }, categoriasData] = await Promise.all([
          gestorContextoService.buscarContextoAtual(),
          categoriaCardapioService.listarCategorias(),
        ]);

        setCategorias(
          categoriasData.filter((categoria) => categoria.nome !== 'SEM_CATEGORIA'),
        );
        setRestauranteId(restaurante?.id ?? null);
        setRestauranteNome(restaurante?.nome_fantasia ?? '');
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

  async function handleSubmit(data: ItemCardapioFormData) {
    if (!restauranteId) {
      setError('Nenhum restaurante vinculado ao gestor foi encontrado.');
      return;
    }

    setError(null);

    try {
      await itemCardapioService.criarItem({
        restaurante_id: restauranteId,
        categoria_id: Number(data.categoria_id),
        nome: data.nome,
        descricao: data.descricao || null,
        preco: Number(data.preco),
        carboidratos: Number(data.carboidratos),
        gorduras: Number(data.gorduras),
        proteina: Number(data.proteina),
        caloria: Number(data.caloria),
        tamanho: data.tamanho,
        status_item: data.status_item,
        foto_url: data.foto_url || null,
      });

      navigate('/gestor/cardapio');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  if (isLoading) {
    return <Loading label="Carregando formulário do cardápio" />;
  }

  return (
    <section className="mx-auto grid max-w-3xl gap-6">
      <div>
        <Link to="/gestor/cardapio" className="text-sm font-semibold text-brand-700">
          Voltar para Cardápio
        </Link>
        <p className="mt-4 text-sm font-semibold uppercase text-brand-700">
          Cardápio
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">
          Adicionar novo item
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {restauranteNome
            ? `Restaurante: ${restauranteNome}`
            : 'Nenhum restaurante vinculado ao gestor.'}
        </p>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      {!restauranteId ? (
        <Alert>
          O gestor ainda não possui restaurante aprovado vinculado para montar o
          cardápio.
        </Alert>
      ) : categorias.length === 0 ? (
        <Alert>
          Nenhuma categoria disponível foi encontrada para cadastrar itens no
          cardápio.
        </Alert>
      ) : (
        <ItemCardapioForm
          categorias={categorias}
          defaultValues={{
            categoria_id: categorias[0]?.id,
            nome: '',
            descricao: '',
            preco: 0,
            carboidratos: 0,
            gorduras: 0,
            proteina: 0,
            caloria: 0,
            tamanho: 'MEDIO',
            status_item: 'ATIVO',
            foto_url: '',
          }}
          formError={error}
          submitLabel="Salvar item"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/gestor/cardapio')}
        />
      )}
    </section>
  );
}
