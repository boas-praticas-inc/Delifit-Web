from app.core.exceptions import AppError
from app.domain.entities.solicitacao_adesao_restaurante import SolicitacaoAdesaoRestaurante
from app.domain.repositories.solicitacao_adesao_restaurante_repository import (
    SolicitacaoAdesaoRestauranteRepository,
)


class SolicitacaoAdesaoRestauranteNaoEncontradaError(AppError):
    status_code = 404
    detail = "Solicitacao de adesao nao encontrada."


class BuscarSolicitacaoAdesaoRestaurantePorIdUseCase:
    def __init__(self, repository: SolicitacaoAdesaoRestauranteRepository) -> None:
        self.repository = repository

    def executar(self, solicitacao_id: int) -> SolicitacaoAdesaoRestaurante:
        solicitacao = self.repository.buscar_por_id(solicitacao_id)
        if solicitacao is None:
            raise SolicitacaoAdesaoRestauranteNaoEncontradaError()
        return solicitacao

