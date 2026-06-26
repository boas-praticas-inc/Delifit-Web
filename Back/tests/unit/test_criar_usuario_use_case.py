from datetime import datetime

import pytest

from app.application.dto.usuario_dto import CriarUsuarioDTO
from app.application.use_cases.usuario.criar_usuario import CriarUsuarioUseCase
from app.core.exceptions import EmailJaCadastradoError, TelefoneJaCadastradoError
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import StatusUsuarioEnum, TipoUsuarioEnum
from app.domain.repositories.usuario_repository import UsuarioRepository


class FakeUsuarioRepository(UsuarioRepository):
    def __init__(self) -> None:
        self.usuarios: list[Usuario] = []

    def criar(self, usuario: Usuario) -> Usuario:
        usuario_criado = Usuario(
            id=len(self.usuarios) + 1,
            email=usuario.email,
            telefone=usuario.telefone,
            senha_hash=usuario.senha_hash,
            tipo_usuario=usuario.tipo_usuario,
            status=StatusUsuarioEnum.ATIVO,
            criado_em=datetime(2026, 6, 4, 12, 0, 0),
            atualizado_em=None,
        )
        self.usuarios.append(usuario_criado)
        return usuario_criado

    def listar(self) -> list[Usuario]:
        return self.usuarios

    def buscar_por_id(self, usuario_id: int) -> Usuario | None:
        return next((usuario for usuario in self.usuarios if usuario.id == usuario_id), None)

    def buscar_por_email(self, email: str) -> Usuario | None:
        return next((usuario for usuario in self.usuarios if usuario.email == email), None)

    def buscar_por_telefone(self, telefone: str) -> Usuario | None:
        return next((usuario for usuario in self.usuarios if usuario.telefone == telefone), None)


def test_criar_usuario_gera_hash_e_persiste_usuario() -> None:
    repository = FakeUsuarioRepository()
    use_case = CriarUsuarioUseCase(repository=repository, gerar_hash=lambda senha: f"hash:{senha}")

    usuario = use_case.executar(
        CriarUsuarioDTO(
            email=None,
            telefone="11999999999",
            senha="senha-segura",
            tipo_usuario=TipoUsuarioEnum.CLIENTE,
        )
    )

    assert usuario.id == 1
    assert usuario.telefone == "11999999999"
    assert usuario.senha_hash == "hash:senha-segura"
    assert usuario.tipo_usuario == TipoUsuarioEnum.CLIENTE


def test_criar_usuario_rejeita_telefone_duplicado_para_cliente() -> None:
    repository = FakeUsuarioRepository()
    use_case = CriarUsuarioUseCase(repository=repository, gerar_hash=lambda senha: f"hash:{senha}")
    dto = CriarUsuarioDTO(
        email=None,
        telefone="11999999999",
        senha="senha-segura",
        tipo_usuario=TipoUsuarioEnum.CLIENTE,
    )

    use_case.executar(dto)

    with pytest.raises(TelefoneJaCadastradoError):
        use_case.executar(dto)


def test_criar_usuario_rejeita_email_duplicado_para_admin() -> None:
    repository = FakeUsuarioRepository()
    use_case = CriarUsuarioUseCase(repository=repository, gerar_hash=lambda senha: f"hash:{senha}")
    dto = CriarUsuarioDTO(
        email="admin@delifit.com",
        telefone=None,
        senha="senha-segura",
        tipo_usuario=TipoUsuarioEnum.ADMIN,
    )

    use_case.executar(dto)

    with pytest.raises(EmailJaCadastradoError):
        use_case.executar(dto)
