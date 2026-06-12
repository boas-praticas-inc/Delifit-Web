from sqlalchemy.orm import Session

from app.domain.entities.admin import Admin
from app.domain.repositories.admin_repository import AdminRepository
from app.infrastructure.database.models.admin_model import AdminModel


class SQLAlchemyAdminRepository(AdminRepository):
    def __init__(self, session: Session) -> None:
        self.session = session

    def criar(self, admin: Admin) -> Admin:
        model = AdminModel(
            usuario_id=admin.usuario_id,
            nome_completo=admin.nome_completo,
            cargo=admin.cargo,
        )
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)
        return self._to_entity(model)

    def listar(self) -> list[Admin]:
        models = self.session.query(AdminModel).order_by(AdminModel.id).all()
        return [self._to_entity(model) for model in models]

    def buscar_por_id(self, admin_id: int) -> Admin | None:
        model = self.session.get(AdminModel, admin_id)
        return self._to_entity(model) if model is not None else None

    @staticmethod
    def _to_entity(model: AdminModel) -> Admin:
        return Admin(
            id=model.id,
            usuario_id=model.usuario_id,
            nome_completo=model.nome_completo,
            cargo=model.cargo,
        )

