from abc import ABC, abstractmethod

from app.domain.entities.solicitacao_adesao_restaurante import SolicitacaoAdesaoRestaurante


class SolicitacaoAdesaoRestauranteRepository(ABC):
    @abstractmethod
    def criar(self, solicitacao: SolicitacaoAdesaoRestaurante) -> SolicitacaoAdesaoRestaurante:
        raise NotImplementedError

    @abstractmethod
    def listar(self) -> list[SolicitacaoAdesaoRestaurante]:
        raise NotImplementedError

    @abstractmethod
    def buscar_por_id(self, solicitacao_id: int) -> SolicitacaoAdesaoRestaurante | None:
        raise NotImplementedError

    @abstractmethod
    def atualizar(
        self,
        solicitacao_id: int,
        solicitacao: SolicitacaoAdesaoRestaurante,
    ) -> SolicitacaoAdesaoRestaurante | None:
        raise NotImplementedError

