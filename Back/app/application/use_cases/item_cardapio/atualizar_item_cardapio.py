from app.application.dto.item_cardapio_dto import AtualizarItemCardapioDTO
from app.core.item_cardapio_exceptions import ItemCardapioNaoEncontradoError
from app.domain.entities.variacao_item_cardapio import VariacaoItemCardapio
from app.domain.repositories.item_cardapio_repository import ItemCardapioRepository


class AtualizarItemCardapioUseCase:
    def __init__(self, repository: ItemCardapioRepository) -> None:
        self.repository = repository

    def executar(self, item_id: int, dto: AtualizarItemCardapioDTO):
        item = self.repository.buscar_por_id(item_id)
        if item is None:
            raise ItemCardapioNaoEncontradoError()

        item.restaurante_id = dto.restaurante_id
        item.categoria_id = dto.categoria_id
        item.nome = dto.nome
        item.descricao = dto.descricao
        item.variacoes = [
            VariacaoItemCardapio(
                id=None,
                descricao_variacao=_montar_descricao_variacao(
                    variacao.quantidade,
                    variacao.unidade_medida,
                ),
                quantidade=variacao.quantidade,
                unidade_medida=variacao.unidade_medida,
                preco=variacao.preco,
                carboidratos=variacao.carboidratos,
                gorduras=variacao.gorduras,
                proteina=variacao.proteina,
                caloria=variacao.caloria,
            )
                for variacao in dto.variacoes
        ]
        item.tags = dto.tags
        item.status_item = dto.status_item
        item.foto_url = dto.foto_url
        return self.repository.atualizar(item)


def _montar_descricao_variacao(quantidade: object, unidade_medida: str | None) -> str:
    if quantidade is None or unidade_medida is None:
        return "Variacao"

    quantidade_formatada = format(quantidade, "f").rstrip("0").rstrip(".")
    return f"{quantidade_formatada}{unidade_medida.lower()}"
