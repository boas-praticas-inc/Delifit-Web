from collections.abc import Generator
from datetime import UTC, datetime

from fastapi.testclient import TestClient

from app.core.security import gerar_hash_senha
from app.domain.entities.cartao import Cartao
from app.domain.entities.cliente import Cliente
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


def test_criar_meu_cartao(monkeypatch) -> None:
    usuario, cliente = criar_usuario_cliente()

    configurar_autenticacao_cliente(monkeypatch, usuario, cliente)

    def desmarcar_padrao_por_cliente(_self, _cliente_id: int) -> None:
        return None

    def criar_cartao(_self, cartao: Cartao) -> Cartao:
        return Cartao(
            id=15,
            cliente_id=cartao.cliente_id,
            nome_titular=cartao.nome_titular,
            ultimos_quatro_digitos=cartao.ultimos_quatro_digitos,
            bandeira=cartao.bandeira,
            token_gateway=cartao.token_gateway,
            padrao=cartao.padrao,
            criado_em=datetime.now(UTC),
        )

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cartao_repository."
        "SQLAlchemyCartaoRepository.desmarcar_padrao_por_cliente",
        desmarcar_padrao_por_cliente,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cartao_repository."
        "SQLAlchemyCartaoRepository.criar",
        criar_cartao,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client_http:
        token = autenticar_cliente(client_http, usuario)
        response = client_http.post(
            "/api/v1/clientes/me/cartoes",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "nome_titular": "Maria Silva",
                "ultimos_quatro_digitos": "1234",
                "bandeira": "VISA",
                "token_gateway": "tok_123",
                "padrao": True,
            },
        )

    app.dependency_overrides.clear()
    assert response.status_code == 201
    body = response.json()
    assert body["id"] == 15
    assert body["cliente_id"] == cliente.id
    assert body["padrao"] is True


def test_listar_e_buscar_meus_cartoes(monkeypatch) -> None:
    usuario, cliente = criar_usuario_cliente()
    cartao = Cartao(
        id=21,
        cliente_id=cliente.id,
        nome_titular="Maria Silva",
        ultimos_quatro_digitos="4321",
        bandeira="MASTERCARD",
        token_gateway="tok_456",
        padrao=False,
        criado_em=datetime.now(UTC),
    )

    configurar_autenticacao_cliente(monkeypatch, usuario, cliente)

    def listar_por_cliente_id(_self, cliente_id: int) -> list[Cartao]:
        return [cartao] if cliente_id == cliente.id else []

    def buscar_por_id_e_cliente_id(_self, cartao_id: int, cliente_id: int) -> Cartao | None:
        if cartao_id == cartao.id and cliente_id == cliente.id:
            return cartao
        return None

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cartao_repository."
        "SQLAlchemyCartaoRepository.listar_por_cliente_id",
        listar_por_cliente_id,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cartao_repository."
        "SQLAlchemyCartaoRepository.buscar_por_id_e_cliente_id",
        buscar_por_id_e_cliente_id,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client_http:
        token = autenticar_cliente(client_http, usuario)
        list_response = client_http.get(
            "/api/v1/clientes/me/cartoes",
            headers={"Authorization": f"Bearer {token}"},
        )
        get_response = client_http.get(
            f"/api/v1/clientes/me/cartoes/{cartao.id}",
            headers={"Authorization": f"Bearer {token}"},
        )

    app.dependency_overrides.clear()
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1
    assert list_response.json()[0]["id"] == cartao.id
    assert get_response.status_code == 200
    assert get_response.json()["bandeira"] == "MASTERCARD"


def test_atualizar_meu_cartao(monkeypatch) -> None:
    usuario, cliente = criar_usuario_cliente()
    cartao_atual = Cartao(
        id=31,
        cliente_id=cliente.id,
        nome_titular="Maria Antiga",
        ultimos_quatro_digitos="1111",
        bandeira="VISA",
        token_gateway="tok_antigo",
        padrao=False,
        criado_em=datetime.now(UTC),
    )

    configurar_autenticacao_cliente(monkeypatch, usuario, cliente)

    def buscar_por_id_e_cliente_id(_self, cartao_id: int, cliente_id: int) -> Cartao | None:
        if cartao_id == cartao_atual.id and cliente_id == cliente.id:
            return cartao_atual
        return None

    def desmarcar_padrao_por_cliente(_self, _cliente_id: int) -> None:
        return None

    def atualizar_cartao(_self, cartao_id: int, cartao: Cartao) -> Cartao | None:
        if cartao_id != cartao_atual.id:
            return None
        return Cartao(
            id=cartao_id,
            cliente_id=cartao.cliente_id,
            nome_titular=cartao.nome_titular,
            ultimos_quatro_digitos=cartao.ultimos_quatro_digitos,
            bandeira=cartao.bandeira,
            token_gateway=cartao.token_gateway,
            padrao=cartao.padrao,
            criado_em=cartao_atual.criado_em,
        )

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cartao_repository."
        "SQLAlchemyCartaoRepository.buscar_por_id_e_cliente_id",
        buscar_por_id_e_cliente_id,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cartao_repository."
        "SQLAlchemyCartaoRepository.desmarcar_padrao_por_cliente",
        desmarcar_padrao_por_cliente,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cartao_repository."
        "SQLAlchemyCartaoRepository.atualizar",
        atualizar_cartao,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client_http:
        token = autenticar_cliente(client_http, usuario)
        response = client_http.put(
            f"/api/v1/clientes/me/cartoes/{cartao_atual.id}",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "nome_titular": "Maria Nova",
                "ultimos_quatro_digitos": "2222",
                "bandeira": "ELO",
                "token_gateway": "tok_novo",
                "padrao": True,
            },
        )

    app.dependency_overrides.clear()
    assert response.status_code == 200
    body = response.json()
    assert body["nome_titular"] == "Maria Nova"
    assert body["ultimos_quatro_digitos"] == "2222"
    assert body["padrao"] is True


def test_excluir_meu_cartao(monkeypatch) -> None:
    usuario, cliente = criar_usuario_cliente()
    cartao = Cartao(
        id=41,
        cliente_id=cliente.id,
        nome_titular="Maria Silva",
        ultimos_quatro_digitos="9999",
        bandeira="VISA",
        token_gateway="tok_delete",
        padrao=False,
        criado_em=datetime.now(UTC),
    )

    configurar_autenticacao_cliente(monkeypatch, usuario, cliente)

    def buscar_por_id_e_cliente_id(_self, cartao_id: int, cliente_id: int) -> Cartao | None:
        if cartao_id == cartao.id and cliente_id == cliente.id:
            return cartao
        return None

    def excluir_cartao(_self, cartao_id: int) -> bool:
        return cartao_id == cartao.id

    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cartao_repository."
        "SQLAlchemyCartaoRepository.buscar_por_id_e_cliente_id",
        buscar_por_id_e_cliente_id,
    )
    monkeypatch.setattr(
        "app.infrastructure.database.repositories.sqlalchemy_cartao_repository."
        "SQLAlchemyCartaoRepository.excluir",
        excluir_cartao,
    )
    app.dependency_overrides[get_session] = override_session

    with TestClient(app) as client_http:
        token = autenticar_cliente(client_http, usuario)
        response = client_http.delete(
            f"/api/v1/clientes/me/cartoes/{cartao.id}",
            headers={"Authorization": f"Bearer {token}"},
        )

    app.dependency_overrides.clear()
    assert response.status_code == 204
