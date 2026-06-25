from app.application.dto.item_cardapio_dto import CriarItemCardapioDTO
from app.domain.entities.item_cardapio import ItemCardapio
from app.domain.entities.variacao_item_cardapio import VariacaoItemCardapio
from app.domain.repositories.item_cardapio_repository import ItemCardapioRepository


class CriarItemCardapioUseCase:
    def __init__(self, repository: ItemCardapioRepository) -> None:
        self.repository = repository

    def executar(self, dto: CriarItemCardapioDTO) -> ItemCardapio:
        item = ItemCardapio(
            id=None,
            restaurante_id=dto.restaurante_id,
            categoria_id=dto.categoria_id,
            nome=dto.nome,
            variacoes=[
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
            ],
            tags=dto.tags,
            descricao=dto.descricao,
            status_item=dto.status_item,
            foto_url=dto.foto_url,
        )
        return self.repository.criar(item)


def _montar_descricao_variacao(quantidade: object, unidade_medida: str | None) -> str:
    if quantidade is None or unidade_medida is None:
        return "Variacao"

    quantidade_formatada = format(quantidade, "f").rstrip("0").rstrip(".")
    return f"{quantidade_formatada}{unidade_medida.lower()}"
