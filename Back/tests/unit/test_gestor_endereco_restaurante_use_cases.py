from app.application.dto.endereco_dto import AtualizarEnderecoDTO
from app.application.use_cases.endereco.atualizar_endereco_restaurante_do_gestor import (
    AtualizarEnderecoRestauranteDoGestorUseCase,
)
from app.application.use_cases.endereco.buscar_endereco_restaurante_do_gestor import (
    BuscarEnderecoRestauranteDoGestorUseCase,
)
from app.domain.entities.endereco import Endereco
from app.domain.entities.gestor import Gestor
from app.domain.entities.restaurante import Restaurante
from app.domain.repositories.endereco_repository import EnderecoRepository
from app.domain.repositories.gestor_repository import GestorRepository
from app.domain.repositories.restaurante_repository import RestauranteRepository


class FakeEnderecoRepository(EnderecoRepository):
    def __init__(self, endereco: Endereco | None) -> None:
        self.endereco = endereco

    def criar(self, endereco: Endereco) -> Endereco:
        self.endereco = endereco
        return endereco

    def listar(self) -> list[Endereco]:
        return [self.endereco] if self.endereco is not None else []

    def listar_por_cliente_id(self, cliente_id: int) -> list[Endereco]:
        if self.endereco is not None and self.endereco.cliente_id == cliente_id:
            return [self.endereco]
        return []

    def buscar_por_id(self, endereco_id: int) -> Endereco | None:
        if self.endereco is not None and self.endereco.id == endereco_id:
            return self.endereco
        return None

    def buscar_por_id_e_cliente_id(self, endereco_id: int, cliente_id: int) -> Endereco | None:
        if (
            self.endereco is not None
            and self.endereco.id == endereco_id
            and self.endereco.cliente_id == cliente_id
        ):
            return self.endereco
        return None

    def atualizar(self, endereco_id: int, endereco: Endereco) -> Endereco | None:
        if self.endereco is None or self.endereco.id != endereco_id:
            return None
        self.endereco = endereco
        return endereco

    def excluir(self, endereco_id: int) -> bool:
        if self.endereco is not None and self.endereco.id == endereco_id:
            self.endereco = None
            return True
        return False


class FakeGestorRepository(GestorRepository):
    def __init__(self, gestor: Gestor | None) -> None:
        self.gestor = gestor

    def criar(self, gestor: Gestor) -> Gestor:
        self.gestor = gestor
        return gestor

    def listar(self) -> list[Gestor]:
        return [self.gestor] if self.gestor is not None else []

    def buscar_por_id(self, gestor_id: int) -> Gestor | None:
        if self.gestor is not None and self.gestor.id == gestor_id:
            return self.gestor
        return None

    def buscar_por_usuario_id(self, usuario_id: int) -> Gestor | None:
        if self.gestor is not None and self.gestor.usuario_id == usuario_id:
            return self.gestor
        return None


class FakeRestauranteRepository(RestauranteRepository):
    def __init__(self, restaurante: Restaurante | None) -> None:
        self.restaurante = restaurante

    def criar(self, restaurante: Restaurante) -> Restaurante:
        self.restaurante = restaurante
        return restaurante

    def listar(self) -> list[Restaurante]:
        return [self.restaurante] if self.restaurante is not None else []

    def buscar_por_id(self, restaurante_id: int) -> Restaurante | None:
        if self.restaurante is not None and self.restaurante.id == restaurante_id:
            return self.restaurante
        return None

    def buscar_por_gestor_id(self, gestor_id: int) -> Restaurante | None:
        if self.restaurante is not None and self.restaurante.gestor_id == gestor_id:
            return self.restaurante
        return None

    def atualizar(self, restaurante: Restaurante) -> Restaurante:
        self.restaurante = restaurante
        return restaurante

    def excluir(self, restaurante_id: int) -> None:
        if self.restaurante is not None and self.restaurante.id == restaurante_id:
            self.restaurante = None

    def buscar_por_cnpj(self, cnpj: str) -> Restaurante | None:
        if self.restaurante is not None and self.restaurante.cnpj == cnpj:
            return self.restaurante
        return None



def test_buscar_endereco_restaurante_do_gestor_retorna_endereco_vinculado() -> None:
    gestor = Gestor(id=3, usuario_id=15, nome_completo="Gestor", cpf="12345678901", telefone="11999999999")
    restaurante = Restaurante(
        id=8,
        gestor_id=gestor.id or 0,
        endereco_id=21,
        solicitacao_adesao_id=None,
        nome_fantasia="Delifit House",
        razao_social="Delifit House LTDA",
        cnpj="12345678000199",
        telefone="11999999999",
    )
    endereco = Endereco(
        id=21,
        cep="49000000",
        logradouro="Rua das Flores",
        numero="10",
        bairro="Centro",
        cidade="Aracaju",
        estado="SE",
        complemento="Sala 2",
        referencia="Ao lado da praça",
        label=None,
        cliente_id=None,
    )

    use_case = BuscarEnderecoRestauranteDoGestorUseCase(
        endereco_repository=FakeEnderecoRepository(endereco),
        gestor_repository=FakeGestorRepository(gestor),
        restaurante_repository=FakeRestauranteRepository(restaurante),
    )

    resultado = use_case.executar(gestor.usuario_id)

    assert resultado.id == endereco.id
    assert resultado.logradouro == "Rua das Flores"



def test_atualizar_endereco_restaurante_do_gestor_preserva_dados_internos() -> None:
    gestor = Gestor(id=5, usuario_id=18, nome_completo="Gestor", cpf="10987654321", telefone="11911111111")
    restaurante = Restaurante(
        id=12,
        gestor_id=gestor.id or 0,
        endereco_id=30,
        solicitacao_adesao_id=None,
        nome_fantasia="Sabores Fit",
        razao_social="Sabores Fit LTDA",
        cnpj="98765432000188",
        telefone="11911111111",
    )
    endereco = Endereco(
        id=30,
        cep="11111111",
        logradouro="Rua A",
        numero="50",
        bairro="Centro",
        cidade="Aracaju",
        estado="SE",
        complemento=None,
        referencia=None,
        label="Interno",
        cliente_id=None,
    )

    use_case = AtualizarEnderecoRestauranteDoGestorUseCase(
        endereco_repository=FakeEnderecoRepository(endereco),
        gestor_repository=FakeGestorRepository(gestor),
        restaurante_repository=FakeRestauranteRepository(restaurante),
    )

    atualizado = use_case.executar(
        gestor.usuario_id,
        AtualizarEnderecoDTO(
            cep="22222222",
            logradouro="Avenida Nova",
            numero="88",
            bairro="Jardins",
            cidade="Aracaju",
            estado="SE",
            complemento="Loja 4",
            referencia="Próximo ao shopping",
        ),
    )

    assert atualizado.cep == "22222222"
    assert atualizado.logradouro == "Avenida Nova"
    assert atualizado.label == "Interno"
    assert atualizado.cliente_id is None
