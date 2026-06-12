from abc import ABC, abstractmethod

from app.domain.entities.admin import Admin


class AdminRepository(ABC):
    @abstractmethod
    def criar(self, admin: Admin) -> Admin:
        raise NotImplementedError

    @abstractmethod
    def listar(self) -> list[Admin]:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id(self, admin_id: int) -> Admin | None:
        raise NotImplementedError

