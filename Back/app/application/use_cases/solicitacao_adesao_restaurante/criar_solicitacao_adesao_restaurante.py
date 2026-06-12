from app.application.dto.solicitacao_adesao_restaurante_dto import CriarSolicitacaoAdesaoRestauranteDTO
from app.domain.entities.solicitacao_adesao_restaurante import SolicitacaoAdesaoRestaurante
from app.domain.repositories.solicitacao_adesao_restaurante_repository import (
    SolicitacaoAdesaoRestauranteRepository,
)


class CriarSolicitacaoAdesaoRestauranteUseCase:
    def __init__(self, repository: SolicitacaoAdesaoRestauranteRepository) -> None:
        self.repository = repository

    def executar(self, dto: CriarSolicitacaoAdesaoRestauranteDTO) -> SolicitacaoAdesaoRestaurante:
        solicitacao = SolicitacaoAdesaoRestaurante(
            id=None,
            gestor_id=dto.gestor_id,
            nome_fantasia=dto.nome_fantasia,
            razao_social=dto.razao_social,
            cnpj=dto.cnpj,
            telefone=dto.telefone,
            cep=dto.cep,
            logradouro=dto.logradouro,
            numero=dto.numero,
            bairro=dto.bairro,
            cidade=dto.cidade,
            estado=dto.estado,
            complemento=dto.complemento,
            referencia=dto.referencia,
            descricao=dto.descricao,
            foto_url=dto.foto_url,
        )
        return self.repository.criar(solicitacao)

