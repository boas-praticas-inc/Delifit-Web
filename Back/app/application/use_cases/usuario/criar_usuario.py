from collections.abc import Callable

from app.application.dto.usuario_dto import CriarUsuarioDTO
from app.core.exceptions import EmailJaCadastradoError
from app.domain.entities.usuario import Usuario
from app.domain.repositories.usuario_repository import UsuarioRepository


class CriarUsuarioUseCase:
    def __init__(self, repository: UsuarioRepository, gerar_hash: Callable[[str], str]) -> None:
        self.repository = repository
        self.gerar_hash = gerar_hash

    def executar(self, dto: CriarUsuarioDTO) -> Usuario:
        if self.repository.buscar_por_email(dto.email) is not None:
            raise EmailJaCadastradoError()

        usuario = Usuario(
            id=None,
            email=dto.email,
            senha_hash=self.gerar_hash(dto.senha),
            tipo_usuario=dto.tipo_usuario,
        )
        return self.repository.criar(usuario)
