from datetime import datetime

import pytest

from app.application.dto.solicitacao_adesao_restaurante_dto import (
    AnalisarSolicitacaoAdesaoRestauranteDTO,
)
from app.application.use_cases.solicitacao_adesao_restaurante.analisar_solicitacao_adesao_restaurante import (
    AnalisarSolicitacaoAdesaoRestauranteUseCase,
    SolicitacaoAdesaoRestauranteNaoEncontradaError,
)
from app.domain.entities.endereco import Endereco
from app.domain.entities.restaurante import Restaurante
from app.domain.entities.solicitacao_adesao_restaurante import SolicitacaoAdesaoRestaurante
from app.domain.repositories.endereco_repository import EnderecoRepository
from app.domain.repositories.restaurante_repository import RestauranteRepository
from app.domain.repositories.solicitacao_adesao_restaurante_repository import (
    SolicitacaoAdesaoRestauranteRepository,
)


class FakeSolicitacaoRepository(SolicitacaoAdesaoRestauranteRepository):
    def __init__(self) -> None:
        self.solicitacoes: list[SolicitacaoAdesaoRestaurante] = []

    def criar(self, solicitacao: SolicitacaoAdesaoRestaurante) -> SolicitacaoAdesaoRestaurante:
        solicitacao_criada = SolicitacaoAdesaoRestaurante(
            id=len(self.solicitacoes) + 1,
            gestor_id=solicitacao.gestor_id,
            nome_fantasia=solicitacao.nome_fantasia,
            razao_social=solicitacao.razao_social,
            cnpj=solicitacao.cnpj,
            telefone=solicitacao.telefone,
            cep=solicitacao.cep,
            logradouro=solicitacao.logradouro,
            numero=solicitacao.numero,
            bairro=solicitacao.bairro,
            cidade=solicitacao.cidade,
            estado=solicitacao.estado,
            complemento=solicitacao.complemento,
            referencia=solicitacao.referencia,
            descricao=solicitacao.descricao,
            foto_url=solicitacao.foto_url,
            status_solicitacao=solicitacao.status_solicitacao,
            motivo_reprovacao=solicitacao.motivo_reprovacao,
            criado_em=datetime(2026, 6, 17, 12, 0, 0),
            analisado_em=solicitacao.analisado_em,
            analisado_por_admin_id=solicitacao.analisado_por_admin_id,
        )
        self.solicitacoes.append(solicitacao_criada)
        return solicitacao_criada

    def listar(self) -> list[SolicitacaoAdesaoRestaurante]:
        return self.solicitacoes

    def buscar_por_id(self, solicitacao_id: int) -> SolicitacaoAdesaoRestaurante | None:
        return next((item for item in self.solicitacoes if item.id == solicitacao_id), None)

    def atualizar(
        self,
        solicitacao_id: int,
        solicitacao: SolicitacaoAdesaoRestaurante,
    ) -> SolicitacaoAdesaoRestaurante | None:
        for indice, item in enumerate(self.solicitacoes):
            if item.id == solicitacao_id:
                self.solicitacoes[indice] = solicitacao
                return solicitacao
        return None


class FakeEnderecoRepository(EnderecoRepository):
    def __init__(self) -> None:
        self.enderecos: list[Endereco] = []

    def criar(self, endereco: Endereco) -> Endereco:
        endereco_criado = Endereco(
            id=len(self.enderecos) + 1,
            cep=endereco.cep,
            logradouro=endereco.logradouro,
            numero=endereco.numero,
            bairro=endereco.bairro,
            cidade=endereco.cidade,
            estado=endereco.estado,
            complemento=endereco.complemento,
            referencia=endereco.referencia,
            label=endereco.label,
            cliente_id=endereco.cliente_id,
        )
        self.enderecos.append(endereco_criado)
        return endereco_criado

    def listar(self) -> list[Endereco]:
        return self.enderecos

    def buscar_por_id(self, endereco_id: int) -> Endereco | None:
        return next((item for item in self.enderecos if item.id == endereco_id), None)

    def buscar_igual(self, endereco: Endereco) -> Endereco | None:
        return next(
            (
                item
                for item in self.enderecos
                if item.cep == endereco.cep
                and item.logradouro == endereco.logradouro
                and item.numero == endereco.numero
                and item.bairro == endereco.bairro
                and item.cidade == endereco.cidade
                and item.estado == endereco.estado
                and item.complemento == endereco.complemento
                and item.referencia == endereco.referencia
                and item.label == endereco.label
                and item.cliente_id == endereco.cliente_id
            ),
            None,
        )


class FakeRestauranteRepository(RestauranteRepository):
    def __init__(self) -> None:
        self.restaurantes: list[Restaurante] = []

    def criar(self, restaurante: Restaurante) -> Restaurante:
        restaurante_criado = Restaurante(
            id=len(self.restaurantes) + 1,
            gestor_id=restaurante.gestor_id,
            endereco_id=restaurante.endereco_id,
            solicitacao_adesao_id=restaurante.solicitacao_adesao_id,
            nome_fantasia=restaurante.nome_fantasia,
            razao_social=restaurante.razao_social,
            cnpj=restaurante.cnpj,
            telefone=restaurante.telefone,
            descricao=restaurante.descricao,
            foto_url=restaurante.foto_url,
            status=restaurante.status,
            criado_em=datetime(2026, 6, 17, 12, 0, 0),
        )
        self.restaurantes.append(restaurante_criado)
        return restaurante_criado

    def listar(self) -> list[Restaurante]:
        return self.restaurantes

    def buscar_por_id(self, restaurante_id: int) -> Restaurante | None:
        return next((item for item in self.restaurantes if item.id == restaurante_id), None)

    def atualizar(self, restaurante: Restaurante) -> Restaurante:
        raise NotImplementedError

    def excluir(self, restaurante_id: int) -> None:
        raise NotImplementedError

    def buscar_por_cnpj(self, cnpj: str) -> Restaurante | None:
        return next((item for item in self.restaurantes if item.cnpj == cnpj), None)


def test_aprovar_solicitacao_cria_restaurante_e_endereco() -> None:
    solicitacao_repository = FakeSolicitacaoRepository()
    endereco_repository = FakeEnderecoRepository()
    restaurante_repository = FakeRestauranteRepository()
    use_case = AnalisarSolicitacaoAdesaoRestauranteUseCase(
        repository=solicitacao_repository,
        restaurante_repository=restaurante_repository,
        endereco_repository=endereco_repository,
    )

    solicitacao_repository.criar(
        SolicitacaoAdesaoRestaurante(
            id=None,
            gestor_id=7,
            nome_fantasia="Delifit Centro",
            razao_social="Delifit Centro LTDA",
            cnpj="12345678000199",
            telefone="85999990000",
            cep="60000000",
            logradouro="Rua das Flores",
            numero="123",
            bairro="Centro",
            cidade="Fortaleza",
            estado="CE",
            complemento="Sala 1",
            referencia="Perto da praça",
            descricao="Restaurante fitness",
            foto_url=None,
        )
    )

    solicitacao = use_case.executar(
        1,
        AnalisarSolicitacaoAdesaoRestauranteDTO(
            status_solicitacao="APROVADO",
            analisado_por_admin_id=3,
        ),
    )

    assert solicitacao.status_solicitacao == "APROVADO"
    assert solicitacao.analisado_por_admin_id == 3
    assert len(endereco_repository.enderecos) == 1
    assert len(restaurante_repository.restaurantes) == 1
    assert restaurante_repository.restaurantes[0].solicitacao_adesao_id == 1
    assert restaurante_repository.restaurantes[0].endereco_id == 1


def test_recusar_solicitacao_nao_cria_restaurante() -> None:
    solicitacao_repository = FakeSolicitacaoRepository()
    endereco_repository = FakeEnderecoRepository()
    restaurante_repository = FakeRestauranteRepository()
    use_case = AnalisarSolicitacaoAdesaoRestauranteUseCase(
        repository=solicitacao_repository,
        restaurante_repository=restaurante_repository,
        endereco_repository=endereco_repository,
    )

    solicitacao_repository.criar(
        SolicitacaoAdesaoRestaurante(
            id=None,
            gestor_id=7,
            nome_fantasia="Delifit Centro",
            razao_social="Delifit Centro LTDA",
            cnpj="12345678000199",
            telefone="85999990000",
            cep="60000000",
            logradouro="Rua das Flores",
            numero="123",
            bairro="Centro",
            cidade="Fortaleza",
            estado="CE",
        )
    )

    solicitacao = use_case.executar(
        1,
        AnalisarSolicitacaoAdesaoRestauranteDTO(
            status_solicitacao="REPROVADO",
            analisado_por_admin_id=3,
            motivo_reprovacao="Documentacao incompleta",
        ),
    )

    assert solicitacao.status_solicitacao == "REPROVADO"
    assert solicitacao.motivo_reprovacao == "Documentacao incompleta"
    assert endereco_repository.enderecos == []
    assert restaurante_repository.restaurantes == []


def test_aprovar_solicitacao_reaproveita_restaurante_existente() -> None:
    solicitacao_repository = FakeSolicitacaoRepository()
    endereco_repository = FakeEnderecoRepository()
    restaurante_repository = FakeRestauranteRepository()
    use_case = AnalisarSolicitacaoAdesaoRestauranteUseCase(
        repository=solicitacao_repository,
        restaurante_repository=restaurante_repository,
        endereco_repository=endereco_repository,
    )

    solicitacao = solicitacao_repository.criar(
        SolicitacaoAdesaoRestaurante(
            id=None,
            gestor_id=7,
            nome_fantasia="Delifit Centro",
            razao_social="Delifit Centro LTDA",
            cnpj="12345678000199",
            telefone="85999990000",
            cep="60000000",
            logradouro="Rua das Flores",
            numero="123",
            bairro="Centro",
            cidade="Fortaleza",
            estado="CE",
        )
    )

    restaurante_repository.criar(
        Restaurante(
            id=None,
            gestor_id=7,
            endereco_id=1,
            solicitacao_adesao_id=None,
            nome_fantasia="Delifit Centro",
            razao_social="Delifit Centro LTDA",
            cnpj="12345678000199",
            telefone="85999990000",
            descricao=None,
            foto_url=None,
        )
    )

    resultado = use_case.executar(
        solicitacao.id or 1,
        AnalisarSolicitacaoAdesaoRestauranteDTO(
            status_solicitacao="APROVADO",
            analisado_por_admin_id=3,
        ),
    )

    assert resultado.status_solicitacao == "APROVADO"
    assert len(restaurante_repository.restaurantes) == 1
    assert restaurante_repository.restaurantes[0].solicitacao_adesao_id == solicitacao.id
    assert len(endereco_repository.enderecos) == 0


def test_aprovar_solicitacao_reaproveita_endereco_existente() -> None:
    solicitacao_repository = FakeSolicitacaoRepository()
    endereco_repository = FakeEnderecoRepository()
    restaurante_repository = FakeRestauranteRepository()
    use_case = AnalisarSolicitacaoAdesaoRestauranteUseCase(
        repository=solicitacao_repository,
        restaurante_repository=restaurante_repository,
        endereco_repository=endereco_repository,
    )

    solicitacao = solicitacao_repository.criar(
        SolicitacaoAdesaoRestaurante(
            id=None,
            gestor_id=7,
            nome_fantasia="Delifit Centro",
            razao_social="Delifit Centro LTDA",
            cnpj="12345678000199",
            telefone="85999990000",
            cep="60000000",
            logradouro="Rua das Flores",
            numero="123",
            bairro="Centro",
            cidade="Fortaleza",
            estado="CE",
            complemento="Sala 1",
            referencia="Perto da praça",
            descricao="Restaurante fitness",
            foto_url=None,
        )
    )

    endereco_repository.criar(
        Endereco(
            id=None,
            cep="60000000",
            logradouro="Rua das Flores",
            numero="123",
            bairro="Centro",
            cidade="Fortaleza",
            estado="CE",
            complemento="Sala 1",
            referencia="Perto da praça",
            label=None,
            cliente_id=None,
        )
    )

    use_case.executar(
        solicitacao.id or 1,
        AnalisarSolicitacaoAdesaoRestauranteDTO(
            status_solicitacao="APROVADO",
            analisado_por_admin_id=3,
        ),
    )

    assert len(endereco_repository.enderecos) == 1
    assert len(restaurante_repository.restaurantes) == 1
    assert restaurante_repository.restaurantes[0].endereco_id == 1


def test_analisar_solicitacao_inexistente() -> None:
    use_case = AnalisarSolicitacaoAdesaoRestauranteUseCase(
        repository=FakeSolicitacaoRepository(),
        restaurante_repository=FakeRestauranteRepository(),
        endereco_repository=FakeEnderecoRepository(),
    )

    with pytest.raises(SolicitacaoAdesaoRestauranteNaoEncontradaError):
        use_case.executar(
            99,
            AnalisarSolicitacaoAdesaoRestauranteDTO(
                status_solicitacao="APROVADO",
                analisado_por_admin_id=3,
            ),
        )
