from app.core.exceptions import AppError
from app.domain.entities.solicitacao_adesao_restaurante import SolicitacaoAdesaoRestaurante
from app.domain.repositories.solicitacao_adesao_restaurante_repository import (
    SolicitacaoAdesaoRestauranteRepository,
)


class SolicitacaoAdesaoRestauranteNaoEncontradaError(AppError):
    status_code = 404
    detail = "Solicitação de adesão não encontrada."


class SolicitacaoAdesaoRestauranteNaoPodeSerReenviadaError(AppError):
    status_code = 400
    detail = "Apenas solicitações reprovadas podem solicitar nova análise."


class SolicitarNovaAnaliseSolicitacaoAdesaoRestauranteUseCase:
    def __init__(self, repository: SolicitacaoAdesaoRestauranteRepository) -> None:
        self.repository = repository

    def executar(self, solicitacao_id: int) -> SolicitacaoAdesaoRestaurante:
        solicitacao = self.repository.buscar_por_id(solicitacao_id)
        if solicitacao is None:
            raise SolicitacaoAdesaoRestauranteNaoEncontradaError()

        if solicitacao.status_solicitacao != "REPROVADO":
            raise SolicitacaoAdesaoRestauranteNaoPodeSerReenviadaError()

        solicitacao.status_solicitacao = "EM_ANALISE"
        solicitacao.motivo_reprovacao = None
        solicitacao.analisado_em = None
        solicitacao.analisado_por_admin_id = None

        solicitacao_atualizada = self.repository.atualizar(solicitacao_id, solicitacao)
        if solicitacao_atualizada is None:
            raise SolicitacaoAdesaoRestauranteNaoEncontradaError()

        return solicitacao_atualizada
