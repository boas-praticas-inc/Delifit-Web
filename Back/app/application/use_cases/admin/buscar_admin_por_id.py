from app.core.exceptions import AppError
from app.domain.entities.admin import Admin
from app.domain.repositories.admin_repository import AdminRepository


class AdminNaoEncontradoError(AppError):
    status_code = 404
    detail = "Admin nao encontrado."


class BuscarAdminPorIdUseCase:
    def __init__(self, repository: AdminRepository) -> None:
        self.repository = repository

    def executar(self, admin_id: int) -> Admin:
        admin = self.repository.buscar_por_id(admin_id)
        if admin is None:
            raise AdminNaoEncontradoError()
        return admin

