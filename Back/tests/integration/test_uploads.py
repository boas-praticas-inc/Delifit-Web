from collections.abc import Generator
from datetime import UTC, datetime

from fastapi.testclient import TestClient

from app.core.security import gerar_hash_senha
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import StatusUsuarioEnum, TipoUsuarioEnum
from app.main import app
from app.shared.dependencies import get_session


def override_session() -> Generator[object, None, None]:
    yield object()



def criar_usuario_cliente() -> Usuario:
    return Usuario(
        id=10,
        email=None,
        telefone="11999999999",
        senha_hash=gerar_hash_senha("senha-segura"),
        tipo_usuario=TipoUsuarioEnum.CLIENTE,
        status=StatusUsuarioEnum.ATIVO,
        criado_em=datetime.now(UTC),
    )



def autenticar_cliente(client: TestClient, usuario: Usuario) -> str:
    response = client.post(
        "/api/v1/auth/clientes/login",
        json={"telefone": usuario.telefone, "senha": "senha-segura"},
    )
    return response.json()["access_token"]



def test_fazer_upload_imagem(monkeypatch) -> None:
    usuario = criar_usuario_cliente()

    def buscar_usuario_por_telefone(_self, telefone: str) -> Usuario | None:
        return usuario if telefone == usuario.telefone else None

    def buscar_usuario_por_id(_self, usuario_id: int) -> Usuario | None:
        return usuario if usuario_id == usuario.id else None

    def salvar_arquivo(_self, *, chave: str, conteudo: bytes, content_type: str):
        return {
            "bucket": "delifit",
            "chave": chave,
            "url": f"http://localhost:9000/delifit/{chave}",
            "content_type": content_type,
        }

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
        "app.infrastructure.storage.minio_armazenamento_arquivo_repository."
        "MinioArmazenamentoArquivoRepository.salvar_arquivo",
        salvar_arquivo,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client_http:
        token = autenticar_cliente(client_http, usuario)
        response = client_http.post(
            "/api/v1/uploads/imagens",
            headers={"Authorization": f"Bearer {token}"},
            data={"pasta": "restaurantes"},
            files={"arquivo": ("foto.png", b"imagem-teste", "image/png")},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 201
    body = response.json()
    assert body["bucket"] == "delifit"
    assert body["content_type"] == "image/png"
    assert body["chave"].startswith("restaurantes/10/")
