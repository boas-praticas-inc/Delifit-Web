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
import {
  TAG_ITEM_CARDAPIO_OPTIONS,
  type ItemCardapio,
} from '../../cardapio/types/itemCardapioTypes';
import { gestorContextoService } from '../services/gestorContextoService';

const statusLabel: Record<string, string> = {
  ATIVO: 'Ativo',
  INDISPONIVEL: 'Indisponível',
  INATIVO: 'Inativo',
  ARQUIVADO: 'Arquivado',
};

const tagsLabel = Object.fromEntries(
  TAG_ITEM_CARDAPIO_OPTIONS.map((tag) => [tag.value, tag.label]),
) as Record<string, string>;

export function GestorCardapioPage() {
  const [restauranteId, setRestauranteId] = useState<number | null>(null);
  const [restauranteNome, setRestauranteNome] = useState<string>('');
  const [itens, setItens] = useState<ItemCardapio[]>([]);
  const [categorias, setCategorias] = useState<CategoriaCardapio[]>([]);
  const [variacaoSelecionadaPorItem, setVariacaoSelecionadaPorItem] = useState<
    Record<number, number>
  >({});
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

  function handleSelecionarVariacao(itemId: number, index: number) {
    setVariacaoSelecionadaPorItem((estadoAtual) => ({
      ...estadoAtual,
      [itemId]: index,
    }));
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
          searchPlaceholder="Buscar item por nome, categoria, descrição ou medida"
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
              className: 'min-w-[420px]',
              searchValue: (item) =>
                `${item.nome} ${item.descricao ?? ''} ${
                  categoriasPorId[item.categoria_id] ?? ''
                } ${item.variacoes.map((variacao) => variacao.descricao_variacao).join(' ')}`,
              sortValue: (item) => item.nome,
              render: (item) => {
                const variacaoSelecionada = getVariacaoSelecionada(
                  item,
                  variacaoSelecionadaPorItem,
                );

                return (
                  <div className="w-[360px] min-w-[360px]">
                    <div className="h-[240px] w-[360px] min-w-[360px] overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100 shadow-sm">
                      {item.foto_url ? (
                        <img
                          src={item.foto_url}
                          alt={item.nome}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#fff7ed_0%,#fde68a_45%,#fecdd3_100%)]">
                          <div className="absolute -right-10 -top-8 h-32 w-32 rounded-full bg-white/35 blur-2xl" />
                          <div className="absolute left-6 top-5 h-14 w-20 rounded-[18px] border border-white/40 bg-white/30 shadow-sm" />
                          <div className="absolute right-8 top-6 h-20 w-16 rounded-full bg-rose-300/40 blur-sm" />
                          <div className="absolute bottom-6 left-7 right-7 rounded-[24px] border border-white/60 bg-white/75 p-4 shadow-lg backdrop-blur-sm">
                            <div className="h-24 rounded-[16px] bg-[linear-gradient(145deg,#f8fafc_0%,#e2e8f0_100%)] p-3 shadow-inner">
                              <div className="grid h-full grid-cols-[1.1fr,0.9fr] gap-3">
                                <div className="rounded-[12px] bg-emerald-100/80" />
                                <div className="grid gap-2">
                                  <div className="rounded-[10px] bg-amber-100/80" />
                                  <div className="rounded-[10px] bg-orange-100/80" />
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                              Imagem padrão
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 grid w-[360px] grid-cols-4 gap-1.5">
                      <MacroResumo label="KCAL" value={variacaoSelecionada.caloria} />
                      <MacroResumo label="PROT." value={variacaoSelecionada.proteina} />
                      <MacroResumo label="GORD." value={variacaoSelecionada.gorduras} />
                      <MacroResumo
                        label="CARB."
                        value={variacaoSelecionada.carboidratos}
                      />
                    </div>

                    <div className="mt-3 w-[360px] text-center font-semibold text-slate-950">
                      {item.nome}
                    </div>
                  </div>
                );
              },
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
              className: 'min-w-[160px]',
              searchValue: (item) =>
                item.variacoes.map((variacao) => String(variacao.preco)).join(' '),
              sortValue: (item) =>
                Math.min(...item.variacoes.map((variacao) => variacao.preco)),
              render: (item) => {
                const variacaoSelecionada = getVariacaoSelecionada(
                  item,
                  variacaoSelecionadaPorItem,
                );

                return (
                  <div>
                    <div className="text-base font-semibold text-slate-950">
                      {formatarMoeda(variacaoSelecionada.preco)}
                    </div>
                  </div>
                );
              },
            },
            {
              id: 'variacoes',
              header: 'Variações',
              className: 'min-w-[220px]',
              searchValue: (item) =>
                item.variacoes
                  .map(
                    (variacao) =>
                      `${variacao.descricao_variacao} ${variacao.preco} ${variacao.caloria}`,
                  )
                  .join(' '),
              render: (item) => (
                <div className="flex flex-wrap gap-2">
                  {item.variacoes.map((variacao, index) => (
                    <button
                      key={`${item.id}-${variacao.descricao_variacao}`}
                      type="button"
                      onClick={() => handleSelecionarVariacao(item.id, index)}
                      className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                        (variacaoSelecionadaPorItem[item.id] ?? 0) === index
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50'
                      }`}
                    >
                      {variacao.descricao_variacao}
                    </button>
                  ))}
                </div>
              ),
            },
            {
              id: 'tags',
              header: 'Restrições',
              className: 'min-w-[180px]',
              searchValue: (item) => item.tags.join(' '),
              render: (item) =>
                item.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={`${item.id}-${tag}`}
                        className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800"
                      >
                        {tagsLabel[tag] ?? tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Sem restrições</span>
                ),
            },
            {
              id: 'status_item',
              header: 'Status',
              className: 'min-w-[120px]',
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
              className: 'min-w-[150px]',
              render: (item) => (
                <div className="flex flex-col gap-2">
                  <LinkButton
                    to={`/gestor/cardapio/${item.id}/editar`}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    Editar
                  </LinkButton>
                  <Button
                    variant="secondary"
                    className="w-full text-sm"
                    onClick={() => void handleExcluir(item)}
                  >
                    Remover
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}
    </section>
  );
}

function getVariacaoSelecionada(
  item: ItemCardapio,
  variacaoSelecionadaPorItem: Record<number, number>,
) {
  return item.variacoes[variacaoSelecionadaPorItem[item.id] ?? 0] ?? item.variacoes[0];
}

function MacroResumo({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-slate-100 px-1 py-1 text-center">
      <div className="text-[13px] font-bold leading-none text-slate-900">
        {formatarNumero(value)}
      </div>
      <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.04em] text-slate-500">
        {label}
      </div>
    </div>
  );
}

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

function formatarNumero(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(valor);
}
