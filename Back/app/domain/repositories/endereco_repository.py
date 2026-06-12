from abc import ABC, abstractmethod

from app.domain.entities.endereco import Endereco


class EnderecoRepository(ABC):
    @abstractmethod
    def criar(self, endereco: Endereco) -> Endereco:
        raise NotImplementedError

    @abstractmethod
    def listar(self) -> list[Endereco]:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id(self, endereco_id: int) -> Endereco | None:
        raise NotImplementedError

