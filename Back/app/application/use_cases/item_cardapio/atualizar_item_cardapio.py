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
                tamanho=variacao.tamanho,
                preco=variacao.preco,
                carboidratos=variacao.carboidratos,
                gorduras=variacao.gorduras,
                proteina=variacao.proteina,
                caloria=variacao.caloria,
            )
            for variacao in dto.variacoes
        ]
        item.status_item = dto.status_item
        item.foto_url = dto.foto_url
        return self.repository.atualizar(item)
