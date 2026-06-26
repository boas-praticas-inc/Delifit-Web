from abc import ABC, abstractmethod

from app.domain.entities.gestor import Gestor


class GestorRepository(ABC):
    @abstractmethod
    def criar(self, gestor: Gestor) -> Gestor:
        raise NotImplementedError

    @abstractmethod
    def listar(self) -> list[Gestor]:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id(self, gestor_id: int) -> Gestor | None:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_usuario_id(self, usuario_id: int) -> Gestor | None:
        raise NotImplementedError

