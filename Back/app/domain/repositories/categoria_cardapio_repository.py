from abc import ABC, abstractmethod

from app.domain.entities.categoria_cardapio import CategoriaCardapio


class CategoriaCardapioRepository(ABC):
    @abstractmethod
    def criar(self, categoria: CategoriaCardapio) -> CategoriaCardapio:
        raise NotImplementedError

    @abstractmethod
    def listar(self) -> list[CategoriaCardapio]:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id(self, categoria_id: int) -> CategoriaCardapio | None:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_nome(self, nome: str) -> CategoriaCardapio | None:
        raise NotImplementedError

    @abstractmethod
    def excluir(self, categoria_id: int) -> None:
        raise NotImplementedError

    @abstractmethod
    def possui_itens_vinculados(self, categoria_id: int) -> bool:
        raise NotImplementedError
