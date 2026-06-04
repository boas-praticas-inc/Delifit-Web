from app.domain.entities.usuario import Usuario
from app.domain.repositories.usuario_repository import UsuarioRepository


class ListarUsuariosUseCase:
    def __init__(self, repository: UsuarioRepository) -> None:
        self.repository = repository

    def executar(self) -> list[Usuario]:
        return self.repository.listar()
