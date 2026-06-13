from datetime import datetime

from app.application.dto.solicitacao_adesao_restaurante_dto import (
    AnalisarSolicitacaoAdesaoRestauranteDTO,
)
from app.domain.repositories.solicitacao_adesao_restaurante_repository import (
    SolicitacaoAdesaoRestauranteRepository,
)


class SolicitacaoAdesaoRestauranteNaoEncontradaError(Exception):
    pass


class AnalisarSolicitacaoAdesaoRestauranteUseCase:
    def __init__(self, repository: SolicitacaoAdesaoRestauranteRepository) -> None:
        self.repository = repository

    def executar(
        self,
        solicitacao_id: int,
        dto: AnalisarSolicitacaoAdesaoRestauranteDTO,
    ):
        solicitacao = self.repository.buscar_por_id(solicitacao_id)
        if solicitacao is None:
            raise SolicitacaoAdesaoRestauranteNaoEncontradaError

        solicitacao.status_solicitacao = dto.status_solicitacao
        solicitacao.analisado_por_admin_id = dto.analisado_por_admin_id
        solicitacao.motivo_reprovacao = dto.motivo_reprovacao
        solicitacao.analisado_em = dto.analisado_em or datetime.utcnow()

        solicitacao_atualizada = self.repository.atualizar(
            solicitacao_id,
            solicitacao,
        )
        if solicitacao_atualizada is None:
            raise SolicitacaoAdesaoRestauranteNaoEncontradaError
        return solicitacao_atualizada
