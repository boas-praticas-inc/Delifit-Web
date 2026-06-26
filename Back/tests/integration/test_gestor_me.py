from collections.abc import Generator
from datetime import UTC, datetime

from fastapi.testclient import TestClient

from app.core.security import gerar_hash_senha
from app.domain.entities.gestor import Gestor
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import StatusUsuarioEnum, TipoUsuarioEnum
from app.main import app
from app.shared.dependencies import get_session


def override_session() -> Generator[object, None, None]:
    yield object()


def test_buscar_meu_perfil_gestor(monkeypatch) -> None:
    usuario = Usuario(
        id=20,
        email="gestor@delifit.com",
        telefone=None,
        senha_hash=gerar_hash_senha("senha-segura"),
        tipo_usuario=TipoUsuarioEnum.GESTOR,
        status=StatusUsuarioEnum.ATIVO,
        criado_em=datetime.now(UTC),
    )
    gestor = Gestor(
        id=5,
        usuario_id=usuario.id,
        nome_completo="Gestor Teste",
        cpf="12345678901",
        telefone="11999999999",
    )

    def buscar_usuario_por_email(_self, email: str) -> Usuario | None:
        return usuario if email == usuario.email else None

    def buscar_usuario_por_id(_self, usuario_id: int) -> Usuario | None:
        return usuario if usuario_id == usuario.id else None

    def buscar_gestor_por_usuario_id(_self, usuario_id: int) -> Gestor | None:
        return gestor if usuario_id == gestor.usuario_id else None

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_usuario_repository."
        "SQLAlchemyUsuarioRepository.buscar_por_email",
        buscar_usuario_por_email,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_usuario_repository."
        "SQLAlchemyUsuarioRepository.buscar_por_id",
        buscar_usuario_por_id,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_gestor_repository."
        "SQLAlchemyGestorRepository.buscar_por_usuario_id",
        buscar_gestor_por_usuario_id,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client:
        login_response = client.post(
            "/api/v1/auth/staff/login",
            json={"email": usuario.email, "senha": "senha-segura"},
        )
        token = login_response.json()["access_token"]
        response = client.get(
            "/api/v1/gestores/me",
            headers={"Authorization": f"Bearer {token}"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == gestor.id
    assert body["usuario_id"] == gestor.usuario_id
    assert body["nome_completo"] == gestor.nome_completo
