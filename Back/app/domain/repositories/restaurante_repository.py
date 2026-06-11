from abc import ABC, abstractmethod

from app.domain.entities.restaurante import Restaurante


class RestauranteRepository(ABC):
    @abstractmethod
    def criar(self, restaurante: Restaurante) -> Restaurante:
        raise NotImplementedError

    @abstractmethod
    def listar(self) -> list[Restaurante]:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id(self, restaurante_id: int) -> Restaurante | None:
        raise NotImplementedError

    @abstractmethod
    def atualizar(self, restaurante: Restaurante) -> Restaurante:
        raise NotImplementedError

    @abstractmethod
    def excluir(self, restaurante_id: int) -> None:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_cnpj(self, cnpj: str) -> Restaurante | None:
        raise NotImplementedError
