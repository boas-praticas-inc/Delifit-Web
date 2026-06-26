from collections.abc import Generator
from datetime import UTC, date, datetime

from fastapi.testclient import TestClient

from app.core.security import gerar_hash_senha
from app.domain.entities.cliente import Cliente
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import StatusUsuarioEnum, TipoUsuarioEnum
from app.main import app
from app.shared.dependencies import get_session


def override_session() -> Generator[object, None, None]:
    yield object()


def test_buscar_meu_perfil_cliente(monkeypatch) -> None:
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
        data_nascimento=date(1999, 1, 20),
    )

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
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client:
        login_response = client.post(
            "/api/v1/auth/clientes/login",
            json={"telefone": usuario.telefone, "senha": "senha-segura"},
        )
        token = login_response.json()["access_token"]
        response = client.get(
            "/api/v1/clientes/me",
            headers={"Authorization": f"Bearer {token}"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == cliente.id
    assert body["usuario_id"] == cliente.usuario_id
    assert body["nome_completo"] == cliente.nome_completo


def test_atualizar_meu_perfil_cliente(monkeypatch) -> None:
    usuario = Usuario(
        id=10,
        email=None,
        telefone="11999999999",
        senha_hash=gerar_hash_senha("senha-segura"),
        tipo_usuario=TipoUsuarioEnum.CLIENTE,
        status=StatusUsuarioEnum.ATIVO,
        criado_em=datetime.now(UTC),
    )
    cliente_atual = Cliente(
        id=3,
        usuario_id=usuario.id,
        nome_completo="Cliente Antigo",
        cpf="12345678901",
        data_nascimento=date(1999, 1, 20),
    )

    def buscar_usuario_por_telefone(_self, telefone: str) -> Usuario | None:
        return usuario if telefone == usuario.telefone else None

    def buscar_usuario_por_id(_self, usuario_id: int) -> Usuario | None:
        return usuario if usuario_id == usuario.id else None

    def buscar_cliente_por_usuario_id(_self, usuario_id: int) -> Cliente | None:
        return cliente_atual if usuario_id == cliente_atual.usuario_id else None

    def atualizar_cliente(_self, cliente_id: int, cliente: Cliente) -> Cliente | None:
        if cliente_id != cliente_atual.id:
            return None
        return cliente

    def atualizar_telefone(_self, usuario_id: int, telefone: str) -> Usuario | None:
        if usuario_id != usuario.id:
            return None
        usuario.telefone = telefone
        return usuario

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
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cliente_repository."
        "SQLAlchemyClienteRepository.atualizar",
        atualizar_cliente,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_usuario_repository."
        "SQLAlchemyUsuarioRepository.atualizar_telefone",
        atualizar_telefone,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client:
        login_response = client.post(
            "/api/v1/auth/clientes/login",
            json={"telefone": usuario.telefone, "senha": "senha-segura"},
        )
        token = login_response.json()["access_token"]
        response = client.put(
            "/api/v1/clientes/me",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "nome_completo": "Cliente Novo",
                "cpf": "12345678901",
                "telefone": "11888888888",
                "data_nascimento": "2000-02-01",
            },
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == cliente_atual.id
    assert body["usuario_id"] == cliente_atual.usuario_id
    assert body["nome_completo"] == "Cliente Novo"
    assert body["telefone"] == "11888888888"
