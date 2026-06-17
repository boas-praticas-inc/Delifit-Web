from datetime import datetime

from app.application.dto.solicitacao_adesao_restaurante_dto import (
    AnalisarSolicitacaoAdesaoRestauranteDTO,
)
from app.domain.entities.endereco import Endereco
from app.domain.entities.restaurante import Restaurante
from app.domain.repositories.endereco_repository import EnderecoRepository
from app.domain.repositories.restaurante_repository import RestauranteRepository
from app.domain.repositories.solicitacao_adesao_restaurante_repository import (
    SolicitacaoAdesaoRestauranteRepository,
)


class SolicitacaoAdesaoRestauranteNaoEncontradaError(Exception):
    pass


class AnalisarSolicitacaoAdesaoRestauranteUseCase:
    def __init__(
        self,
        repository: SolicitacaoAdesaoRestauranteRepository,
        endereco_repository: EnderecoRepository,
        restaurante_repository: RestauranteRepository,
    ) -> None:
        self.repository = repository
        self.endereco_repository = endereco_repository
        self.restaurante_repository = restaurante_repository

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

        if dto.status_solicitacao == "APROVADO":
            endereco = self.endereco_repository.criar(
                Endereco(
                    id=None,
                    cep=solicitacao.cep,
                    logradouro=solicitacao.logradouro,
                    numero=solicitacao.numero,
                    bairro=solicitacao.bairro,
                    cidade=solicitacao.cidade,
                    estado=solicitacao.estado,
                    complemento=solicitacao.complemento,
                    referencia=solicitacao.referencia,
                )
            )
            self.restaurante_repository.criar(
                Restaurante(
                    id=None,
                    gestor_id=solicitacao.gestor_id,
                    endereco_id=endereco.id,
                    solicitacao_adesao_id=solicitacao.id,
                    nome_fantasia=solicitacao.nome_fantasia,
                    razao_social=solicitacao.razao_social,
                    cnpj=solicitacao.cnpj,
                    telefone=solicitacao.telefone,
                    descricao=solicitacao.descricao,
                    foto_url=solicitacao.foto_url,
                )
            )

        solicitacao_atualizada = self.repository.atualizar(
            solicitacao_id,
            solicitacao,
        )
        if solicitacao_atualizada is None:
            raise SolicitacaoAdesaoRestauranteNaoEncontradaError
        return solicitacao_atualizada
