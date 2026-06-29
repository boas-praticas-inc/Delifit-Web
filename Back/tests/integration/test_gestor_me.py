from collections.abc import Generator
from datetime import UTC, datetime

from fastapi.testclient import TestClient

from app.core.security import gerar_hash_senha
from app.domain.entities.endereco import Endereco
from app.domain.entities.gestor import Gestor
from app.domain.entities.restaurante import Restaurante
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import StatusUsuarioEnum, TipoUsuarioEnum
from app.main import app
from app.shared.dependencies import get_session


def override_session() -> Generator[object, None, None]:
    yield object()



def autenticar_gestor(client: TestClient, usuario: Usuario) -> str:
    login_response = client.post(
        "/api/v1/auth/staff/login",
        json={"email": usuario.email, "senha": "senha-segura"},
    )
    return login_response.json()["access_token"]



def configurar_autenticacao_gestor(monkeypatch, usuario: Usuario, gestor: Gestor) -> None:
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



def criar_usuario_gestor() -> tuple[Usuario, Gestor]:
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
    return usuario, gestor



def test_buscar_meu_perfil_gestor(monkeypatch) -> None:
    usuario, gestor = criar_usuario_gestor()

    configurar_autenticacao_gestor(monkeypatch, usuario, gestor)
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client:
        token = autenticar_gestor(client, usuario)
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



def test_buscar_endereco_do_restaurante_do_gestor(monkeypatch) -> None:
    usuario, gestor = criar_usuario_gestor()
    restaurante = Restaurante(
        id=7,
        gestor_id=gestor.id or 0,
        endereco_id=11,
        solicitacao_adesao_id=None,
        nome_fantasia="Fit Pizza",
        razao_social="Fit Pizza LTDA",
        cnpj="12345678000199",
        telefone="11999999999",
    )
    endereco = Endereco(
        id=11,
        cep="49000000",
        logradouro="Rua das Acacias",
        numero="100",
        bairro="Centro",
        cidade="Aracaju",
        estado="SE",
        complemento=None,
        referencia="Perto da praça",
        label=None,
        cliente_id=None,
    )

    configurar_autenticacao_gestor(monkeypatch, usuario, gestor)

    def buscar_restaurante_por_gestor_id(_self, gestor_id: int) -> Restaurante | None:
        return restaurante if gestor_id == restaurante.gestor_id else None

    def buscar_endereco_por_id(_self, endereco_id: int) -> Endereco | None:
        return endereco if endereco_id == endereco.id else None

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_restaurante_repository."
        "SQLAlchemyRestauranteRepository.buscar_por_gestor_id",
        buscar_restaurante_por_gestor_id,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_endereco_repository."
        "SQLAlchemyEnderecoRepository.buscar_por_id",
        buscar_endereco_por_id,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client:
        token = autenticar_gestor(client, usuario)
        response = client.get(
            "/api/v1/gestores/me/restaurante/endereco",
            headers={"Authorization": f"Bearer {token}"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == endereco.id
    assert body["logradouro"] == "Rua das Acacias"



def test_atualizar_endereco_do_restaurante_do_gestor(monkeypatch) -> None:
    usuario, gestor = criar_usuario_gestor()
    restaurante = Restaurante(
        id=9,
        gestor_id=gestor.id or 0,
        endereco_id=13,
        solicitacao_adesao_id=None,
        nome_fantasia="Fit Burger",
        razao_social="Fit Burger LTDA",
        cnpj="22345678000199",
        telefone="11988887777",
    )
    endereco = Endereco(
        id=13,
        cep="11111111",
        logradouro="Rua A",
        numero="10",
        bairro="Centro",
        cidade="Aracaju",
        estado="SE",
        complemento=None,
        referencia=None,
        label=None,
        cliente_id=None,
    )

    configurar_autenticacao_gestor(monkeypatch, usuario, gestor)

    def buscar_restaurante_por_gestor_id(_self, gestor_id: int) -> Restaurante | None:
        return restaurante if gestor_id == restaurante.gestor_id else None

    def buscar_endereco_por_id(_self, endereco_id: int) -> Endereco | None:
        return endereco if endereco_id == endereco.id else None

    def atualizar_endereco(_self, endereco_id: int, endereco_atualizado: Endereco) -> Endereco | None:
        if endereco_id != endereco.id:
            return None
        return Endereco(
            id=endereco_id,
            cep=endereco_atualizado.cep,
            logradouro=endereco_atualizado.logradouro,
            numero=endereco_atualizado.numero,
            bairro=endereco_atualizado.bairro,
            cidade=endereco_atualizado.cidade,
            estado=endereco_atualizado.estado,
            complemento=endereco_atualizado.complemento,
            referencia=endereco_atualizado.referencia,
            label=endereco_atualizado.label,
            cliente_id=endereco_atualizado.cliente_id,
        )

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_restaurante_repository."
        "SQLAlchemyRestauranteRepository.buscar_por_gestor_id",
        buscar_restaurante_por_gestor_id,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_endereco_repository."
        "SQLAlchemyEnderecoRepository.buscar_por_id",
        buscar_endereco_por_id,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_endereco_repository."
        "SQLAlchemyEnderecoRepository.atualizar",
        atualizar_endereco,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client:
        token = autenticar_gestor(client, usuario)
        response = client.put(
            "/api/v1/gestores/me/restaurante/endereco",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "cep": "22222222",
                "logradouro": "Avenida Nova",
                "numero": "88",
                "bairro": "Jardins",
                "cidade": "Aracaju",
                "estado": "SE",
                "complemento": "Loja 4",
                "referencia": "Próximo ao shopping",
            },
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    body = response.json()
    assert body["cep"] == "22222222"
    assert body["logradouro"] == "Avenida Nova"
    assert body["referencia"] == "Próximo ao shopping"
