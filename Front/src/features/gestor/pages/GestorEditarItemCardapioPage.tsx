import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Alert } from '../../../components/common/Alert';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { ItemCardapioForm } from '../../cardapio/components/ItemCardapioForm';
import type { ItemCardapioFormData } from '../../cardapio/schemas/itemCardapioSchemas';
import { categoriaCardapioService } from '../../cardapio/services/categoriaCardapioService';
import { itemCardapioService } from '../../cardapio/services/itemCardapioService';
import type { CategoriaCardapio } from '../../cardapio/types/categoriaCardapioTypes';
import type { ItemCardapio } from '../../cardapio/types/itemCardapioTypes';
import { gestorContextoService } from '../services/gestorContextoService';

export function GestorEditarItemCardapioPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemCardapio | null>(null);
  const [categorias, setCategorias] = useState<CategoriaCardapio[]>([]);
  const [restauranteId, setRestauranteId] = useState<number | null>(null);
  const [restauranteNome, setRestauranteNome] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      if (!itemId) {
        setError('Item do cardápio não informado.');
        setIsLoading(false);
        return;
      }

      try {
        const [{ restaurante }, categoriasData, itemData] = await Promise.all([
          gestorContextoService.buscarContextoAtual(),
          categoriaCardapioService.listarCategorias(),
          itemCardapioService.buscarItemPorId(Number(itemId)),
        ]);

        setCategorias(
          categoriasData.filter((categoria) => categoria.nome !== 'SEM_CATEGORIA'),
        );
        setRestauranteId(restaurante?.id ?? null);
        setRestauranteNome(restaurante?.nome_fantasia ?? '');
        setItem(itemData);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    void carregar();
  }, [itemId]);

  async function handleSubmit(data: ItemCardapioFormData) {
    if (!itemId || !item || !restauranteId) {
      setError('Não foi possível identificar o item e o restaurante para edição.');
      return;
    }

    setError(null);

    try {
      await itemCardapioService.atualizarItem(Number(itemId), {
        restaurante_id: restauranteId,
        categoria_id: Number(data.categoria_id),
        nome: data.nome,
        descricao: data.descricao || null,
        variacoes: data.variacoes.map((variacao) => ({
          quantidade: Number(variacao.quantidade),
          unidade_medida: variacao.unidade_medida,
          preco: Number(variacao.preco),
          carboidratos: Number(variacao.carboidratos),
          gorduras: Number(variacao.gorduras),
          proteina: Number(variacao.proteina),
          caloria: Number(variacao.caloria),
        })),
        tags: data.tags,
        status_item: data.status_item,
        foto_url: data.foto_url || null,
      });

      navigate('/gestor/cardapio');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  if (isLoading) {
    return <Loading label="Carregando item do cardápio" />;
  }

  if (!item) {
    return (
      <section className="grid gap-4">
        <Link to="/gestor/cardapio" className="text-sm font-semibold text-brand-700">
          Voltar para Cardápio
        </Link>
        {error ? <Alert variant="error">{error}</Alert> : null}
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-4xl gap-6">
      <div>
        <Link to="/gestor/cardapio" className="text-sm font-semibold text-brand-700">
          Voltar para Cardápio
        </Link>
        <p className="mt-4 text-sm font-semibold uppercase text-brand-700">
          Cardápio
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">Editar item</h1>
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
          Nenhuma categoria disponível foi encontrada para editar itens no
          cardápio.
        </Alert>
      ) : (
        <ItemCardapioForm
          categorias={categorias}
          defaultValues={{
            categoria_id: item.categoria_id,
            nome: item.nome,
            descricao: item.descricao ?? '',
            variacoes: item.variacoes.map((variacao) => ({
              quantidade: variacao.quantidade ?? 0,
              unidade_medida: variacao.unidade_medida ?? 'G',
              preco: variacao.preco,
              carboidratos: variacao.carboidratos,
              gorduras: variacao.gorduras,
              proteina: variacao.proteina,
              caloria: variacao.caloria,
            })),
            tags: item.tags,
            status_item: item.status_item,
            foto_url: item.foto_url ?? '',
          }}
          formError={error}
          submitLabel="Salvar alterações"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/gestor/cardapio')}
        />
      )}
    </section>
  );
}
