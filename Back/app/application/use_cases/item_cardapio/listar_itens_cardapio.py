from app.domain.entities.item_cardapio import ItemCardapio
from app.domain.repositories.item_cardapio_repository import ItemCardapioRepository


class ListarItensCardapioUseCase:
    def __init__(self, repository: ItemCardapioRepository) -> None:
        self.repository = repository

    def executar(self, restaurante_id: int | None = None) -> list[ItemCardapio]:
        return self.repository.listar(restaurante_id=restaurante_id)
