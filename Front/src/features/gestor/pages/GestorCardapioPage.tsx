import { useEffect, useState } from 'react';

import { Alert } from '../../../components/common/Alert';
import { Button } from '../../../components/common/Button';
import { Loading } from '../../../components/common/Loading';
import { getApiErrorMessage } from '../../../lib/api';
import { ItemCardapioForm } from '../../cardapio/components/ItemCardapioForm';
import type { ItemCardapioFormData } from '../../cardapio/schemas/itemCardapioSchemas';
import { itemCardapioService } from '../../cardapio/services/itemCardapioService';
import type { ItemCardapio } from '../../cardapio/types/itemCardapioTypes';
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
  const [itemEmEdicao, setItemEmEdicao] = useState<ItemCardapio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function carregarPagina() {
    setIsLoading(true);
    setError(null);

    try {
      const { restaurante } = await gestorContextoService.buscarContextoAtual();

      if (!restaurante) {
        setRestauranteId(null);
        setRestauranteNome('');
        setItens([]);
        return;
      }

      setRestauranteId(restaurante.id);
      setRestauranteNome(restaurante.nome_fantasia);
      const data = await itemCardapioService.listarItens(restaurante.id);
      setItens(data);
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

  useEffect(() => {
    void carregarPagina();
  }, []);

  async function handleSubmit(data: ItemCardapioFormData) {
    if (!restauranteId) {
      setError('Nenhum restaurante vinculado ao gestor foi encontrado.');
      return;
    }

    setError(null);
    setFeedback(null);

    try {
      const payload = {
        restaurante_id: restauranteId,
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
      };

      if (itemEmEdicao) {
        await itemCardapioService.atualizarItem(itemEmEdicao.id, payload);
        setFeedback('Item atualizado com sucesso.');
      } else {
        await itemCardapioService.criarItem(payload);
        setFeedback('Item criado com sucesso.');
      }

      setItemEmEdicao(null);
      await carregarPagina();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  async function handleExcluir(item: ItemCardapio) {
    if (!window.confirm(`Deseja remover o item "${item.nome}"?`)) {
      return;
    }

    try {
      setError(null);
      setFeedback(null);
      await itemCardapioService.excluirItem(item.id);
      setFeedback('Item removido com sucesso.');
      if (itemEmEdicao?.id === item.id) {
        setItemEmEdicao(null);
      }
      await carregarPagina();
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
            Gerenciar itens do cardápio
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {restauranteNome
              ? `Restaurante: ${restauranteNome}`
              : 'Nenhum restaurante vinculado ao gestor.'}
          </p>
        </div>
        {itemEmEdicao ? (
          <Button variant="secondary" onClick={() => setItemEmEdicao(null)}>
            Novo item
          </Button>
        ) : null}
      </div>

      {feedback ? <Alert variant="success">{feedback}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      {!restauranteId ? (
        <Alert>
          O gestor ainda não possui restaurante aprovado vinculado para montar o
          cardápio.
        </Alert>
      ) : (
        <>
          <ItemCardapioForm
            defaultValues={
              itemEmEdicao
                ? {
                    nome: itemEmEdicao.nome,
                    descricao: itemEmEdicao.descricao ?? '',
                    preco: itemEmEdicao.preco,
                    carboidratos: itemEmEdicao.carboidratos,
                    gorduras: itemEmEdicao.gorduras,
                    proteina: itemEmEdicao.proteina,
                    caloria: itemEmEdicao.caloria,
                    tamanho: itemEmEdicao.tamanho,
                    status_item: itemEmEdicao.status_item,
                    foto_url: itemEmEdicao.foto_url ?? '',
                  }
                : {
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
                  }
            }
            formError={error}
            submitLabel={itemEmEdicao ? 'Salvar alterações' : 'Adicionar item'}
            onSubmit={handleSubmit}
            onCancel={() => {
              if (itemEmEdicao) {
                setItemEmEdicao(null);
              }
            }}
          />

          <div className="grid gap-4">
            {itens.length === 0 ? (
              <article className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                Nenhum item cadastrado no cardápio.
              </article>
            ) : (
              itens.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-950">
                          {item.nome}
                        </h2>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {statusLabel[item.status_item] ?? item.status_item}
                        </span>
                        {item.tamanho ? (
                          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
                            {tamanhoLabel[item.tamanho] ?? item.tamanho}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-xl font-semibold text-slate-950">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(item.preco)}
                      </p>
                      <p className="mt-3 text-sm text-slate-600">
                        {`${item.caloria} cal • ${item.carboidratos}g carb • ${item.gorduras}g gord • ${item.proteina}g prot`}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {item.descricao ?? 'Sem descrição informada.'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        variant="secondary"
                        onClick={() => setItemEmEdicao(item)}
                      >
                        Editar
                      </Button>
                      <Button onClick={() => void handleExcluir(item)}>
                        Remover
                      </Button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}
