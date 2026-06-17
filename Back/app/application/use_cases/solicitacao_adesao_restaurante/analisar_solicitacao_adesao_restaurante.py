from datetime import datetime

from app.application.dto.endereco_dto import CriarEnderecoDTO
from app.application.dto.solicitacao_adesao_restaurante_dto import (
    AnalisarSolicitacaoAdesaoRestauranteDTO,
)
from app.application.dto.restaurante_dto import CriarRestauranteDTO
from app.application.use_cases.endereco.criar_endereco import CriarEnderecoUseCase
from app.domain.entities.endereco import Endereco
from app.application.use_cases.restaurante.criar_restaurante import CriarRestauranteUseCase
from app.core.restaurante_exceptions import CnpjJaCadastradoError
from app.domain.entities.solicitacao_adesao_restaurante import SolicitacaoAdesaoRestaurante
from app.domain.repositories.endereco_repository import EnderecoRepository
from app.domain.repositories.solicitacao_adesao_restaurante_repository import (
    SolicitacaoAdesaoRestauranteRepository,
)
from app.domain.repositories.restaurante_repository import RestauranteRepository


class SolicitacaoAdesaoRestauranteNaoEncontradaError(Exception):
    pass


class AnalisarSolicitacaoAdesaoRestauranteUseCase:
    def __init__(
        self,
        repository: SolicitacaoAdesaoRestauranteRepository,
        restaurante_repository: RestauranteRepository,
        endereco_repository: EnderecoRepository,
    ) -> None:
        self.repository = repository
        self.restaurante_repository = restaurante_repository
        self.endereco_repository = endereco_repository

    def executar(
        self,
        solicitacao_id: int,
        dto: AnalisarSolicitacaoAdesaoRestauranteDTO,
    ):
        solicitacao = self.repository.buscar_por_id(solicitacao_id)
        if solicitacao is None:
            raise SolicitacaoAdesaoRestauranteNaoEncontradaError

        if dto.status_solicitacao == "APROVADO":
            self._criar_restaurante_da_solicitacao(solicitacao)

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

    def _criar_restaurante_da_solicitacao(
        self,
        solicitacao: SolicitacaoAdesaoRestaurante,
    ) -> None:
        endereco = Endereco(
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
        endereco_existente = self.endereco_repository.buscar_igual(endereco)
        if endereco_existente is not None:
            endereco = endereco_existente
        else:
            endereco = CriarEnderecoUseCase(self.endereco_repository).executar(
                CriarEnderecoDTO(
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
        if endereco.id is None:
            raise RuntimeError("Endereco criado sem identificador.")

        restaurante_existente = self.restaurante_repository.buscar_por_cnpj(solicitacao.cnpj)
        if restaurante_existente is not None:
            if restaurante_existente.solicitacao_adesao_id not in (None, solicitacao.id):
                raise CnpjJaCadastradoError()

            restaurante_existente.gestor_id = solicitacao.gestor_id
            restaurante_existente.endereco_id = endereco.id
            restaurante_existente.solicitacao_adesao_id = solicitacao.id
            restaurante_existente.nome_fantasia = solicitacao.nome_fantasia
            restaurante_existente.razao_social = solicitacao.razao_social
            restaurante_existente.telefone = solicitacao.telefone
            restaurante_existente.descricao = solicitacao.descricao
            restaurante_existente.foto_url = solicitacao.foto_url
            self.restaurante_repository.atualizar(restaurante_existente)
            return

        CriarRestauranteUseCase(self.restaurante_repository).executar(
            CriarRestauranteDTO(
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
