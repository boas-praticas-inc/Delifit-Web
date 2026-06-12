from app.domain.entities.solicitacao_adesao_restaurante import SolicitacaoAdesaoRestaurante
from app.domain.repositories.solicitacao_adesao_restaurante_repository import (
    SolicitacaoAdesaoRestauranteRepository,
)


class ListarSolicitacoesAdesaoRestauranteUseCase:
    def __init__(self, repository: SolicitacaoAdesaoRestauranteRepository) -> None:
        self.repository = repository

    def executar(self) -> list[SolicitacaoAdesaoRestaurante]:
        return self.repository.listar()

