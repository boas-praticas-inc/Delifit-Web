from app.domain.entities.admin import Admin
from app.domain.repositories.admin_repository import AdminRepository


class ListarAdminsUseCase:
    def __init__(self, repository: AdminRepository) -> None:
        self.repository = repository

    def executar(self) -> list[Admin]:
        return self.repository.listar()

