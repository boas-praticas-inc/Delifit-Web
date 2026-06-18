from app.core.item_cardapio_exceptions import ItemCardapioNaoEncontradoError
from app.domain.entities.item_cardapio import ItemCardapio
from app.domain.repositories.item_cardapio_repository import ItemCardapioRepository


class BuscarItemCardapioPorIdUseCase:
    def __init__(self, repository: ItemCardapioRepository) -> None:
        self.repository = repository

    def executar(self, item_id: int) -> ItemCardapio:
        item = self.repository.buscar_por_id(item_id)
        if item is None:
            raise ItemCardapioNaoEncontradoError()
        return item
