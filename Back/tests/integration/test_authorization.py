from datetime import UTC, datetime

from fastapi.testclient import TestClient

from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import StatusUsuarioEnum, TipoUsuarioEnum
from app.main import app
from app.shared.dependencies import get_current_user


def test_cliente_nao_acessa_rota_admin() -> None:
    usuario = Usuario(
        id=1,
        email=None,
        telefone="11999999999",
        senha_hash="hash",
        tipo_usuario=TipoUsuarioEnum.CLIENTE,
        status=StatusUsuarioEnum.ATIVO,
        criado_em=datetime.now(UTC),
    )
    app.dependency_overrides[get_current_user] = lambda: usuario

    with TestClient(app) as client:
        response = client.get("/api/v1/admins")

    app.dependency_overrides.clear()
    assert response.status_code == 403
    assert response.json() == {"detail": "Usuario sem permissao para acessar este recurso."}


def test_admin_nao_acessa_meu_perfil_cliente() -> None:
    usuario = Usuario(
        id=2,
        email="admin@delifit.com",
        telefone=None,
        senha_hash="hash",
        tipo_usuario=TipoUsuarioEnum.ADMIN,
        status=StatusUsuarioEnum.ATIVO,
        criado_em=datetime.now(UTC),
    )
    app.dependency_overrides[get_current_user] = lambda: usuario

    with TestClient(app) as client:
        response = client.get("/api/v1/clientes/me")

    app.dependency_overrides.clear()
    assert response.status_code == 403
    assert response.json() == {"detail": "Usuario sem permissao para acessar este recurso."}


def test_gestor_nao_acessa_usuarios_admin() -> None:
    usuario = Usuario(
        id=3,
        email="gestor@delifit.com",
        telefone=None,
        senha_hash="hash",
        tipo_usuario=TipoUsuarioEnum.GESTOR,
        status=StatusUsuarioEnum.ATIVO,
        criado_em=datetime.now(UTC),
    )
    app.dependency_overrides[get_current_user] = lambda: usuario

    with TestClient(app) as client:
        response = client.get("/api/v1/usuarios")

    app.dependency_overrides.clear()
    assert response.status_code == 403
    assert response.json() == {"detail": "Usuario sem permissao para acessar este recurso."}
