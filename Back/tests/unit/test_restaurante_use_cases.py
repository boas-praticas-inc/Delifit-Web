from datetime import datetime

from app.application.dto.restaurante_dto import AtualizarRestauranteDTO, CriarRestauranteDTO
from app.application.use_cases.restaurante.atualizar_restaurante import AtualizarRestauranteUseCase
from app.application.use_cases.restaurante.criar_restaurante import CriarRestauranteUseCase
from app.domain.entities.restaurante import Restaurante
from app.domain.repositories.restaurante_repository import RestauranteRepository


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
            criado_em=datetime(2026, 6, 28, 12, 0, 0),
        )
        self.restaurantes.append(restaurante_criado)
        return restaurante_criado

    def listar(self) -> list[Restaurante]:
        return self.restaurantes

    def buscar_por_id(self, restaurante_id: int) -> Restaurante | None:
        return next((item for item in self.restaurantes if item.id == restaurante_id), None)

    def buscar_por_gestor_id(self, gestor_id: int) -> Restaurante | None:
        return next((item for item in self.restaurantes if item.gestor_id == gestor_id), None)

    def atualizar(self, restaurante: Restaurante) -> Restaurante:
        for index, atual in enumerate(self.restaurantes):
            if atual.id == restaurante.id:
                self.restaurantes[index] = restaurante
                return restaurante
        raise ValueError("Restaurante nao encontrado.")

    def excluir(self, restaurante_id: int) -> None:
        self.restaurantes = [item for item in self.restaurantes if item.id != restaurante_id]

    def buscar_por_cnpj(self, cnpj: str) -> Restaurante | None:
        return next((item for item in self.restaurantes if item.cnpj == cnpj), None)



def test_criar_restaurante_preserva_foto_url() -> None:
    repository = FakeRestauranteRepository()
    use_case = CriarRestauranteUseCase(repository=repository)

    restaurante = use_case.executar(
        CriarRestauranteDTO(
            gestor_id=2,
            endereco_id=5,
            solicitacao_adesao_id=1,
            nome_fantasia="Fit House",
            razao_social="Fit House LTDA",
            cnpj="12345678000199",
            telefone="11988887777",
            descricao="Marmitas fitness",
            foto_url="http://localhost:9000/delifit/restaurantes/2/foto.png",
        )
    )

    assert restaurante.id == 1
    assert restaurante.foto_url == "http://localhost:9000/delifit/restaurantes/2/foto.png"



def test_atualizar_restaurante_altera_foto_url() -> None:
    repository = FakeRestauranteRepository()
    restaurante = repository.criar(
        Restaurante(
            id=None,
            gestor_id=2,
            endereco_id=5,
            solicitacao_adesao_id=1,
            nome_fantasia="Fit House",
            razao_social="Fit House LTDA",
            cnpj="12345678000199",
            telefone="11988887777",
            descricao="Marmitas fitness",
            foto_url="http://localhost:9000/delifit/restaurantes/2/antiga.png",
        )
    )
    use_case = AtualizarRestauranteUseCase(repository=repository)

    atualizado = use_case.executar(
        restaurante.id or 0,
        AtualizarRestauranteDTO(
            gestor_id=2,
            endereco_id=5,
            solicitacao_adesao_id=1,
            nome_fantasia="Fit House Premium",
            razao_social="Fit House LTDA",
            cnpj="12345678000199",
            telefone="11988887777",
            descricao="Marmitas fitness premium",
            foto_url="http://localhost:9000/delifit/restaurantes/2/nova.png",
        ),
    )

    assert atualizado.foto_url == "http://localhost:9000/delifit/restaurantes/2/nova.png"
    assert atualizado.nome_fantasia == "Fit House Premium"
