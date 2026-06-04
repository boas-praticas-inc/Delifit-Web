from app.core.exceptions import UsuarioNaoEncontradoError
from app.domain.entities.usuario import Usuario
from app.domain.repositories.usuario_repository import UsuarioRepository


class BuscarUsuarioPorIdUseCase:
    def __init__(self, repository: UsuarioRepository) -> None:
        self.repository = repository

    def executar(self, usuario_id: int) -> Usuario:
        usuario = self.repository.buscar_por_id(usuario_id)
        if usuario is None:
            raise UsuarioNaoEncontradoError()
        return usuario
