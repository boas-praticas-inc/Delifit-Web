import { useEffect, useMemo, useState } from 'react';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { DataTable } from '../../../components/common/DataTable';
import { LinkButton } from '../../../components/common/LinkButton';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { categoriaCardapioService } from '../../cardapio/services/categoriaCardapioService';
import { itemCardapioService } from '../../cardapio/services/itemCardapioService';
import type { CategoriaCardapio } from '../../cardapio/types/categoriaCardapioTypes';
import type { ItemCardapio, VariacaoItemCardapio } from '../../cardapio/types/itemCardapioTypes';
import { gestorContextoService } from '../services/gestorContextoService';

const statusLabel: Record<string, string> = {
  ATIVO: 'Ativo',
  INDISPONIVEL: 'Indisponível',
  INATIVO: 'Inativo',
  ARQUIVADO: 'Arquivado',
};

const tamanhoLabel: Record<string, string> = {
  PEQUENO: 'Pequeno',
  MEDIO: 'Médio',
  GRANDE: 'Grande',
};

export function GestorCardapioPage() {
  const [restauranteId, setRestauranteId] = useState<number | null>(null);
  const [restauranteNome, setRestauranteNome] = useState<string>('');
  const [itens, setItens] = useState<ItemCardapio[]>([]);
  const [categorias, setCategorias] = useState<CategoriaCardapio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const categoriasPorId = useMemo(
    () =>
      Object.fromEntries(
        categorias.map((categoria) => [categoria.id, categoria.nome]),
      ),
    [categorias],
  );

  useEffect(() => {
    async function carregarPagina() {
      setIsLoading(true);
      setError(null);

      try {
        const [{ restaurante }, categoriasData] = await Promise.all([
          gestorContextoService.buscarContextoAtual(),
          categoriaCardapioService.listarCategorias(),
        ]);

        setCategorias(categoriasData);

        if (!restaurante) {
          setRestauranteId(null);
          setRestauranteNome('');
          setItens([]);
          return;
        }

        setRestauranteId(restaurante.id);
        setRestauranteNome(restaurante.nome_fantasia);

        const itensData = await itemCardapioService.listarItens(restaurante.id);
        setItens(itensData);
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

    void carregarPagina();
  }, []);

  async function handleExcluir(item: ItemCardapio) {
    if (!window.confirm(`Deseja remover o item "${item.nome}"?`)) {
      return;
    }

    try {
      setError(null);
      setFeedback(null);
      await itemCardapioService.excluirItem(item.id);
      setItens((estadoAtual) =>
        estadoAtual.filter((itemAtual) => itemAtual.id !== item.id),
      );
      setFeedback('Item removido com sucesso.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  if (isLoading) {
    return <Loading label="Carregando cardápio" />;
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-brand-700">
            Cardápio
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950">
            Itens do cardápio
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {restauranteNome
              ? `Restaurante: ${restauranteNome}`
              : 'Nenhum restaurante vinculado ao gestor.'}
          </p>
        </div>
        <LinkButton to="/gestor/cardapio/novo">Adicionar item</LinkButton>
      </div>

      {feedback ? <Alert variant="success">{feedback}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      {!restauranteId ? (
        <Alert>
          O gestor ainda não possui restaurante aprovado vinculado para montar o
          cardápio.
        </Alert>
      ) : (
        <DataTable
          items={itens}
          emptyMessage="Nenhum item cadastrado no cardápio."
          searchPlaceholder="Buscar item por nome, categoria, descrição ou tamanho"
          filters={[
            {
              id: 'categoria',
              label: 'Categoria',
              options: categorias
                .filter((categoria) => categoria.nome !== 'SEM_CATEGORIA')
                .map((categoria) => ({
                  label: categoria.nome,
                  value: String(categoria.id),
                })),
              predicate: (item, value) => String(item.categoria_id) === value,
            },
            {
              id: 'status',
              label: 'Status',
              options: Object.entries(statusLabel).map(([value, label]) => ({
                label,
                value,
              })),
              predicate: (item, value) => item.status_item === value,
            },
          ]}
          columns={[
            {
              id: 'item',
              header: 'Item',
              searchValue: (item) =>
                `${item.nome} ${item.descricao ?? ''} ${
                  categoriasPorId[item.categoria_id] ?? ''
                } ${item.variacoes.map((variacao) => variacao.tamanho).join(' ')}`,
              sortValue: (item) => item.nome,
              render: (item) => (
                <div>
                  <div className="font-semibold text-slate-950">{item.nome}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {item.descricao ?? 'Sem descrição informada.'}
                  </div>
                </div>
              ),
            },
            {
              id: 'categoria',
              header: 'Categoria',
              searchValue: (item) => categoriasPorId[item.categoria_id] ?? '',
              sortValue: (item) => categoriasPorId[item.categoria_id] ?? '',
              render: (item) => (
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
                  {categoriasPorId[item.categoria_id] ?? 'Sem categoria'}
                </span>
              ),
            },
            {
              id: 'faixa_preco',
              header: 'Faixa de preço',
              searchValue: (item) =>
                item.variacoes.map((variacao) => String(variacao.preco)).join(' '),
              sortValue: (item) =>
                Math.min(...item.variacoes.map((variacao) => variacao.preco)),
              render: (item) => formatarFaixaPreco(item.variacoes),
            },
            {
              id: 'variacoes',
              header: 'Variações',
              searchValue: (item) =>
                item.variacoes
                  .map(
                    (variacao) =>
                      `${variacao.tamanho} ${variacao.preco} ${variacao.caloria}`,
                  )
                  .join(' '),
              render: (item) => (
                <div className="grid gap-2">
                  {item.variacoes.map((variacao) => (
                    <div
                      key={`${item.id}-${variacao.tamanho}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
                    >
                      <div className="font-semibold text-slate-900">
                        {tamanhoLabel[variacao.tamanho] ?? variacao.tamanho}
                      </div>
                      <div className="mt-1">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(variacao.preco)}
                      </div>
                      <div className="mt-1">
                        {`${variacao.caloria} cal • ${variacao.carboidratos}g carb • ${variacao.gorduras}g gord • ${variacao.proteina}g prot`}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              id: 'status_item',
              header: 'Status',
              searchValue: (item) => item.status_item,
              sortValue: (item) => item.status_item,
              render: (item) => (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {statusLabel[item.status_item] ?? item.status_item}
                </span>
              ),
            },
            {
              header: 'Ações',
              className: 'w-32',
              render: (item) => (
                <Button
                  variant="secondary"
                  onClick={() => void handleExcluir(item)}
                >
                  Remover
                </Button>
              ),
            },
          ]}
        />
      )}
    </section>
  );
}

function formatarFaixaPreco(variacoes: VariacaoItemCardapio[]) {
  const precos = variacoes.map((variacao) => variacao.preco);
  const menorPreco = Math.min(...precos);
  const maiorPreco = Math.max(...precos);

  if (menorPreco === maiorPreco) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(menorPreco);
  }

  return `${new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(menorPreco)} - ${new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(maiorPreco)}`;
}
