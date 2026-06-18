from abc import ABC, abstractmethod

from app.domain.entities.item_cardapio import ItemCardapio


class ItemCardapioRepository(ABC):
    @abstractmethod
    def criar(self, item: ItemCardapio) -> ItemCardapio:
        raise NotImplementedError

    @abstractmethod
    def listar(self, restaurante_id: int | None = None) -> list[ItemCardapio]:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id(self, item_id: int) -> ItemCardapio | None:
        raise NotImplementedError

    @abstractmethod
    def atualizar(self, item: ItemCardapio) -> ItemCardapio:
        raise NotImplementedError

    @abstractmethod
    def excluir(self, item_id: int) -> None:
        raise NotImplementedError
