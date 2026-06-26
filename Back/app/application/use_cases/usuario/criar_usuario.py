from collections.abc import Callable

from app.application.dto.usuario_dto import CriarUsuarioDTO
from app.core.exceptions import EmailJaCadastradoError, TelefoneJaCadastradoError
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import TipoUsuarioEnum
from app.domain.repositories.usuario_repository import UsuarioRepository


class CriarUsuarioUseCase:
    def __init__(self, repository: UsuarioRepository, gerar_hash: Callable[[str], str]) -> None:
        self.repository = repository
        self.gerar_hash = gerar_hash

    def executar(self, dto: CriarUsuarioDTO) -> Usuario:
        if dto.email is not None and self.repository.buscar_por_email(dto.email) is not None:
            raise EmailJaCadastradoError()
        if (
            dto.telefone is not None
            and self.repository.buscar_por_telefone(dto.telefone) is not None
        ):
            raise TelefoneJaCadastradoError()

        if dto.tipo_usuario == TipoUsuarioEnum.CLIENTE and dto.telefone is None:
            raise ValueError("Cliente deve informar telefone.")
        if (
            dto.tipo_usuario in (TipoUsuarioEnum.GESTOR, TipoUsuarioEnum.ADMIN)
            and dto.email is None
        ):
            raise ValueError("Gestor e admin devem informar email.")

        usuario = Usuario(
            id=None,
            email=dto.email,
            telefone=dto.telefone,
            senha_hash=self.gerar_hash(dto.senha),
            tipo_usuario=dto.tipo_usuario,
        )
        return self.repository.criar(usuario)
