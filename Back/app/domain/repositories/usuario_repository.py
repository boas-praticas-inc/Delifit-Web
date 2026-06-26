from abc import ABC, abstractmethod

from app.domain.entities.usuario import Usuario


class UsuarioRepository(ABC):
    @abstractmethod
    def criar(self, usuario: Usuario) -> Usuario:
        raise NotImplementedError

    @abstractmethod
    def listar(self) -> list[Usuario]:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id(self, usuario_id: int) -> Usuario | None:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_email(self, email: str) -> Usuario | None:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_telefone(self, telefone: str) -> Usuario | None:
        raise NotImplementedError

    @abstractmethod
    def excluir(self, usuario_id: int) -> bool:
        raise NotImplementedError

    @abstractmethod
    def atualizar_telefone(self, usuario_id: int, telefone: str) -> Usuario | None:
        raise NotImplementedError
