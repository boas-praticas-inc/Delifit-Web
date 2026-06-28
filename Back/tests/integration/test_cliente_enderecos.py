from collections.abc import Generator
from datetime import UTC, datetime

from fastapi.testclient import TestClient

from app.core.security import gerar_hash_senha
from app.domain.entities.cliente import Cliente
from app.domain.entities.endereco import Endereco
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import StatusUsuarioEnum, TipoUsuarioEnum
from app.main import app
from app.shared.dependencies import get_session


def override_session() -> Generator[object, None, None]:
    yield object()


def autenticar_cliente(client: TestClient, usuario: Usuario) -> str:
    login_response = client.post(
        "/api/v1/auth/clientes/login",
        json={"telefone": usuario.telefone, "senha": "senha-segura"},
    )
    return login_response.json()["access_token"]


def configurar_autenticacao_cliente(monkeypatch, usuario: Usuario, cliente: Cliente) -> None:
    def buscar_usuario_por_telefone(_self, telefone: str) -> Usuario | None:
        return usuario if telefone == usuario.telefone else None

    def buscar_usuario_por_id(_self, usuario_id: int) -> Usuario | None:
        return usuario if usuario_id == usuario.id else None

    def buscar_cliente_por_usuario_id(_self, usuario_id: int) -> Cliente | None:
        return cliente if usuario_id == cliente.usuario_id else None

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_usuario_repository."
        "SQLAlchemyUsuarioRepository.buscar_por_telefone",
        buscar_usuario_por_telefone,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_usuario_repository."
        "SQLAlchemyUsuarioRepository.buscar_por_id",
        buscar_usuario_por_id,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cliente_repository."
        "SQLAlchemyClienteRepository.buscar_por_usuario_id",
        buscar_cliente_por_usuario_id,
    )


def criar_usuario_cliente() -> tuple[Usuario, Cliente]:
    usuario = Usuario(
        id=10,
        email=None,
        telefone="11999999999",
        senha_hash=gerar_hash_senha("senha-segura"),
        tipo_usuario=TipoUsuarioEnum.CLIENTE,
        status=StatusUsuarioEnum.ATIVO,
        criado_em=datetime.now(UTC),
    )
    cliente = Cliente(
        id=3,
        usuario_id=usuario.id,
        nome_completo="Cliente Teste",
        cpf="12345678901",
        data_nascimento=None,
    )
    return usuario, cliente


def test_criar_meu_endereco(monkeypatch) -> None:
    usuario, cliente = criar_usuario_cliente()
    endereco_criado = Endereco(
        id=15,
        cep="12345678",
        logradouro="Rua das Flores",
        numero="100",
        bairro="Centro",
        cidade="Sao Paulo",
        estado="SP",
        complemento="Apto 12",
        referencia="Portao azul",
        label="Casa",
        cliente_id=cliente.id,
    )

    configurar_autenticacao_cliente(monkeypatch, usuario, cliente)

    def criar_endereco(_self, endereco: Endereco) -> Endereco:
        return Endereco(
            id=endereco_criado.id,
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

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_endereco_repository."
        "SQLAlchemyEnderecoRepository.criar",
        criar_endereco,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client_http:
        token = autenticar_cliente(client_http, usuario)
        response = client_http.post(
            "/api/v1/clientes/me/enderecos",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "cep": "12345678",
                "logradouro": "Rua das Flores",
                "numero": "100",
                "bairro": "Centro",
                "cidade": "Sao Paulo",
                "estado": "SP",
                "complemento": "Apto 12",
                "referencia": "Portao azul",
                "label": "Casa",
            },
        )

    app.dependency_overrides.clear()
    assert response.status_code == 201
    body = response.json()
    assert body["id"] == endereco_criado.id
    assert body["cliente_id"] == cliente.id
    assert body["label"] == "Casa"


def test_listar_e_buscar_meus_enderecos(monkeypatch) -> None:
    usuario, cliente = criar_usuario_cliente()
    endereco = Endereco(
        id=21,
        cep="87654321",
        logradouro="Av Brasil",
        numero="200",
        bairro="Jardins",
        cidade="Campinas",
        estado="SP",
        complemento=None,
        referencia=None,
        label="Trabalho",
        cliente_id=cliente.id,
    )

    configurar_autenticacao_cliente(monkeypatch, usuario, cliente)

    def listar_por_cliente_id(_self, cliente_id: int) -> list[Endereco]:
        return [endereco] if cliente_id == cliente.id else []

    def buscar_por_id_e_cliente_id(_self, endereco_id: int, cliente_id: int) -> Endereco | None:
        if endereco_id == endereco.id and cliente_id == cliente.id:
            return endereco
        return None

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_endereco_repository."
        "SQLAlchemyEnderecoRepository.listar_por_cliente_id",
        listar_por_cliente_id,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_endereco_repository."
        "SQLAlchemyEnderecoRepository.buscar_por_id_e_cliente_id",
        buscar_por_id_e_cliente_id,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client_http:
        token = autenticar_cliente(client_http, usuario)
        list_response = client_http.get(
            "/api/v1/clientes/me/enderecos",
            headers={"Authorization": f"Bearer {token}"},
        )
        get_response = client_http.get(
            f"/api/v1/clientes/me/enderecos/{endereco.id}",
            headers={"Authorization": f"Bearer {token}"},
        )

    app.dependency_overrides.clear()
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1
    assert list_response.json()[0]["id"] == endereco.id
    assert get_response.status_code == 200
    assert get_response.json()["label"] == "Trabalho"


def test_atualizar_meu_endereco(monkeypatch) -> None:
    usuario, cliente = criar_usuario_cliente()
    endereco_atual = Endereco(
        id=31,
        cep="11111111",
        logradouro="Rua A",
        numero="10",
        bairro="Centro",
        cidade="Santos",
        estado="SP",
        complemento=None,
        referencia=None,
        label="Antigo",
        cliente_id=cliente.id,
    )

    configurar_autenticacao_cliente(monkeypatch, usuario, cliente)

    def buscar_por_id_e_cliente_id(_self, endereco_id: int, cliente_id: int) -> Endereco | None:
        if endereco_id == endereco_atual.id and cliente_id == cliente.id:
            return endereco_atual
        return None

    def atualizar_endereco(_self, endereco_id: int, endereco: Endereco) -> Endereco | None:
        if endereco_id != endereco_atual.id:
            return None
        return Endereco(
            id=endereco_id,
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

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_endereco_repository."
        "SQLAlchemyEnderecoRepository.buscar_por_id_e_cliente_id",
        buscar_por_id_e_cliente_id,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_endereco_repository."
        "SQLAlchemyEnderecoRepository.atualizar",
        atualizar_endereco,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client_http:
        token = autenticar_cliente(client_http, usuario)
        response = client_http.put(
            f"/api/v1/clientes/me/enderecos/{endereco_atual.id}",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "cep": "22222222",
                "logradouro": "Rua B",
                "numero": "20",
                "bairro": "Vila Nova",
                "cidade": "Santos",
                "estado": "SP",
                "complemento": "Casa 2",
                "referencia": "Esquina",
                "label": "Novo",
            },
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    body = response.json()
    assert body["cep"] == "22222222"
    assert body["label"] == "Novo"
    assert body["cliente_id"] == cliente.id


def test_excluir_meu_endereco(monkeypatch) -> None:
    usuario, cliente = criar_usuario_cliente()
    endereco = Endereco(
        id=41,
        cep="33333333",
        logradouro="Rua C",
        numero="30",
        bairro="Centro",
        cidade="Sao Paulo",
        estado="SP",
        complemento=None,
        referencia=None,
        label="Excluir",
        cliente_id=cliente.id,
    )

    configurar_autenticacao_cliente(monkeypatch, usuario, cliente)

    def buscar_por_id_e_cliente_id(_self, endereco_id: int, cliente_id: int) -> Endereco | None:
        if endereco_id == endereco.id and cliente_id == cliente.id:
            return endereco
        return None

    def excluir_endereco(_self, endereco_id: int) -> bool:
        return endereco_id == endereco.id

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_endereco_repository."
        "SQLAlchemyEnderecoRepository.buscar_por_id_e_cliente_id",
        buscar_por_id_e_cliente_id,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_endereco_repository."
        "SQLAlchemyEnderecoRepository.excluir",
        excluir_endereco,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client_http:
        token = autenticar_cliente(client_http, usuario)
        response = client_http.delete(
            f"/api/v1/clientes/me/enderecos/{endereco.id}",
            headers={"Authorization": f"Bearer {token}"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 204
