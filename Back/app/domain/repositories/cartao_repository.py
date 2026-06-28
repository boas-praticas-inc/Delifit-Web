from abc import ABC, abstractmethod

from app.domain.entities.cartao import Cartao


class CartaoRepository(ABC):
    @abstractmethod
    def criar(self, cartao: Cartao) -> Cartao:
        raise NotImplementedError

    @abstractmethod
    def listar_por_cliente_id(self, cliente_id: int) -> list[Cartao]:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id_e_cliente_id(self, cartao_id: int, cliente_id: int) -> Cartao | None:
        raise NotImplementedError

    @abstractmethod
    def atualizar(self, cartao_id: int, cartao: Cartao) -> Cartao | None:
        raise NotImplementedError

    @abstractmethod
    def excluir(self, cartao_id: int) -> bool:
        raise NotImplementedError

    @abstractmethod
    def desmarcar_padrao_por_cliente(self, cliente_id: int) -> None:
        raise NotImplementedError
