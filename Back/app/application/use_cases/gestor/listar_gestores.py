from app.domain.entities.gestor import Gestor
from app.domain.repositories.gestor_repository import GestorRepository


class ListarGestoresUseCase:
    def __init__(self, repository: GestorRepository) -> None:
        self.repository = repository

    def executar(self) -> list[Gestor]:
        return self.repository.listar()

