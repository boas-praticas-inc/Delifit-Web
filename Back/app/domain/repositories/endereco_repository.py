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
    def listar_por_cliente_id(self, cliente_id: int) -> list[Endereco]:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id(self, endereco_id: int) -> Endereco | None:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id_e_cliente_id(self, endereco_id: int, cliente_id: int) -> Endereco | None:
        raise NotImplementedError

    @abstractmethod
    def atualizar(self, endereco_id: int, endereco: Endereco) -> Endereco | None:
        raise NotImplementedError

    @abstractmethod
    def excluir(self, endereco_id: int) -> bool:
        raise NotImplementedError

