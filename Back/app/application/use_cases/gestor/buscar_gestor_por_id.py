from app.core.exceptions import AppError
from app.domain.entities.gestor import Gestor
from app.domain.repositories.gestor_repository import GestorRepository


class GestorNaoEncontradoError(AppError):
    status_code = 404
    detail = "Gestor nao encontrado."


class BuscarGestorPorIdUseCase:
    def __init__(self, repository: GestorRepository) -> None:
        self.repository = repository

    def executar(self, gestor_id: int) -> Gestor:
        gestor = self.repository.buscar_por_id(gestor_id)
        if gestor is None:
            raise GestorNaoEncontradoError()
        return gestor

