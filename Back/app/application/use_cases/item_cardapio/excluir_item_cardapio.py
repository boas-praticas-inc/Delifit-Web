from app.core.item_cardapio_exceptions import ItemCardapioNaoEncontradoError
from app.domain.repositories.item_cardapio_repository import ItemCardapioRepository


class ExcluirItemCardapioUseCase:
    def __init__(self, repository: ItemCardapioRepository) -> None:
        self.repository = repository

    def executar(self, item_id: int) -> None:
        item = self.repository.buscar_por_id(item_id)
        if item is None:
            raise ItemCardapioNaoEncontradoError()
        self.repository.excluir(item_id)
