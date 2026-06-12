from sqlalchemy.orm import Session

from app.domain.entities.gestor import Gestor
from app.domain.repositories.gestor_repository import GestorRepository
from app.infrastructure.database.models.gestor_model import GestorModel


class SQLAlchemyGestorRepository(GestorRepository):
    def __init__(self, session: Session) -> None:
        self.session = session

    def criar(self, gestor: Gestor) -> Gestor:
        model = GestorModel(
            usuario_id=gestor.usuario_id,
            nome_completo=gestor.nome_completo,
            cpf=gestor.cpf,
            telefone=gestor.telefone,
        )
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)
        return self._to_entity(model)

    def listar(self) -> list[Gestor]:
        models = self.session.query(GestorModel).order_by(GestorModel.id).all()
        return [self._to_entity(model) for model in models]

    def buscar_por_id(self, gestor_id: int) -> Gestor | None:
        model = self.session.get(GestorModel, gestor_id)
        return self._to_entity(model) if model is not None else None

    @staticmethod
    def _to_entity(model: GestorModel) -> Gestor:
        return Gestor(
            id=model.id,
            usuario_id=model.usuario_id,
            nome_completo=model.nome_completo,
            cpf=model.cpf,
            telefone=model.telefone,
        )

