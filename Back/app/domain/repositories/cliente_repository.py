from abc import ABC, abstractmethod

from app.domain.entities.cliente import Cliente


class ClienteRepository(ABC):
    @abstractmethod
    def criar(self, cliente: Cliente) -> Cliente:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_usuario_id(self, usuario_id: int) -> Cliente | None:
        raise NotImplementedError

    @abstractmethod
    def listar(self) -> list[Cliente]:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id(self, cliente_id: int) -> Cliente | None:
        raise NotImplementedError

    @abstractmethod
    def atualizar(self, cliente_id: int, cliente: Cliente) -> Cliente | None:
        raise NotImplementedError

    @abstractmethod
    def excluir(self, cliente_id: int) -> bool:
        raise NotImplementedError

