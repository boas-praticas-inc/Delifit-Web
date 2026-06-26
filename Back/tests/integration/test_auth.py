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


def test_login_retorna_token(monkeypatch) -> None:
    usuario = Usuario(
        id=1,
        email=None,
        telefone="11999999999",
        senha_hash=gerar_hash_senha("senha-segura"),
        tipo_usuario=TipoUsuarioEnum.CLIENTE,
        status=StatusUsuarioEnum.ATIVO,
        criado_em=datetime.now(UTC),
    )

    def buscar_por_telefone(_self, telefone: str) -> Usuario | None:
        return usuario if telefone == usuario.telefone else None

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_usuario_repository."
        "SQLAlchemyUsuarioRepository.buscar_por_telefone",
        buscar_por_telefone,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/auth/clientes/login",
            json={"telefone": usuario.telefone, "senha": "senha-segura"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert isinstance(body["access_token"], str)
    assert body["usuario"]["id"] == usuario.id
    assert body["usuario"]["telefone"] == usuario.telefone


def test_registro_cliente_retorna_token_e_perfil(monkeypatch) -> None:
    usuario = Usuario(
        id=3,
        email=None,
        telefone="11999999999",
        senha_hash=gerar_hash_senha("senha-segura"),
        tipo_usuario=TipoUsuarioEnum.CLIENTE,
        status=StatusUsuarioEnum.ATIVO,
        criado_em=datetime.now(UTC),
    )
    cliente = Cliente(
        id=4,
        usuario_id=usuario.id,
        nome_completo="Cliente Novo",
        cpf="12345678901",
        data_nascimento=date(2000, 1, 1),
    )

    def criar_usuario(_self, usuario_arg: Usuario) -> Usuario:
        return Usuario(
            id=usuario.id,
            email=usuario_arg.email,
            telefone=usuario_arg.telefone,
            senha_hash=usuario_arg.senha_hash,
            tipo_usuario=usuario_arg.tipo_usuario,
            status=usuario.status,
            criado_em=usuario.criado_em,
            atualizado_em=None,
        )

    def criar_cliente(_self, cliente_arg: Cliente) -> Cliente:
        return Cliente(
            id=cliente.id,
            usuario_id=cliente_arg.usuario_id,
            nome_completo=cliente_arg.nome_completo,
            cpf=cliente_arg.cpf,
            data_nascimento=cliente_arg.data_nascimento,
        )

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_usuario_repository."
        "SQLAlchemyUsuarioRepository.criar",
        criar_usuario,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cliente_repository."
        "SQLAlchemyClienteRepository.criar",
        criar_cliente,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client_http:
        response = client_http.post(
            "/api/v1/auth/clientes/registro",
            json={
                "telefone": "11999999999",
                "senha": "senha-segura",
                "nome_completo": "Cliente Novo",
                "cpf": "12345678901",
                "data_nascimento": "2000-01-01",
            },
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["access_token"], str)
    assert body["usuario"]["telefone"] == "11999999999"
    assert body["cliente"]["nome_completo"] == "Cliente Novo"


def test_auth_me_retorna_usuario_autenticado(monkeypatch) -> None:
    usuario = Usuario(
        id=7,
        email=None,
        telefone="11999999999",
        senha_hash=gerar_hash_senha("senha-segura"),
        tipo_usuario=TipoUsuarioEnum.CLIENTE,
        status=StatusUsuarioEnum.ATIVO,
        criado_em=datetime.now(UTC),
    )

    def buscar_por_telefone(_self, telefone: str) -> Usuario | None:
        return usuario if telefone == usuario.telefone else None

    def buscar_por_id(_self, usuario_id: int) -> Usuario | None:
        return usuario if usuario_id == usuario.id else None

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_usuario_repository."
        "SQLAlchemyUsuarioRepository.buscar_por_telefone",
        buscar_por_telefone,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_usuario_repository."
        "SQLAlchemyUsuarioRepository.buscar_por_id",
        buscar_por_id,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client:
        login_response = client.post(
            "/api/v1/auth/clientes/login",
            json={"telefone": usuario.telefone, "senha": "senha-segura"},
        )
        token = login_response.json()["access_token"]
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    assert response.json()["id"] == usuario.id
    assert response.json()["telefone"] == usuario.telefone


def test_login_staff_retorna_token(monkeypatch) -> None:
    usuario = Usuario(
        id=2,
        email="admin@delifit.com",
        telefone=None,
        senha_hash=gerar_hash_senha("senha-segura"),
        tipo_usuario=TipoUsuarioEnum.ADMIN,
        status=StatusUsuarioEnum.ATIVO,
        criado_em=datetime.now(UTC),
    )

    def buscar_por_email(_self, email: str) -> Usuario | None:
        return usuario if email == usuario.email else None

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_usuario_repository."
        "SQLAlchemyUsuarioRepository.buscar_por_email",
        buscar_por_email,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client:
        response = client.post(
            "/api/v1/auth/staff/login",
            json={"email": usuario.email, "senha": "senha-segura"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    assert response.json()["usuario"]["email"] == usuario.email


def test_auth_me_sem_token_retorna_401() -> None:
    with TestClient(app) as client:
        response = client.get("/api/v1/auth/me")

    assert response.status_code == 401
    assert response.json() == {"detail": "Nao autenticado."}
