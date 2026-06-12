from app.application.dto.admin_dto import CriarAdminDTO
from app.domain.entities.admin import Admin
from app.domain.repositories.admin_repository import AdminRepository


class CriarAdminUseCase:
    def __init__(self, repository: AdminRepository) -> None:
        self.repository = repository

    def executar(self, dto: CriarAdminDTO) -> Admin:
        admin = Admin(
            id=None,
            usuario_id=dto.usuario_id,
            nome_completo=dto.nome_completo,
            cargo=dto.cargo,
        )
        return self.repository.criar(admin)

