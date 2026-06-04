from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import EmailJaCadastradoError
from app.domain.entities.usuario import Usuario
from app.domain.repositories.usuario_repository import UsuarioRepository
from app.infrastructure.database.models.usuario_model import UsuarioModel


class SQLAlchemyUsuarioRepository(UsuarioRepository):
    def __init__(self, session: Session) -> None:
        self.session = session

    def criar(self, usuario: Usuario) -> Usuario:
        model = UsuarioModel(
            email=usuario.email,
            senha_hash=usuario.senha_hash,
            tipo_usuario=usuario.tipo_usuario,
            status=usuario.status,
        )
        self.session.add(model)
        try:
            self.session.commit()
        except IntegrityError as exc:
            self.session.rollback()
            raise EmailJaCadastradoError() from exc

        self.session.refresh(model)
        return self._to_entity(model)

    def listar(self) -> list[Usuario]:
        models = self.session.query(UsuarioModel).order_by(UsuarioModel.id).all()
        return [self._to_entity(model) for model in models]

    def buscar_por_id(self, usuario_id: int) -> Usuario | None:
        model = self.session.get(UsuarioModel, usuario_id)
        return self._to_entity(model) if model is not None else None

    def buscar_por_email(self, email: str) -> Usuario | None:
        model = self.session.query(UsuarioModel).filter(UsuarioModel.email == email).first()
        return self._to_entity(model) if model is not None else None

    @staticmethod
    def _to_entity(model: UsuarioModel) -> Usuario:
        return Usuario(
            id=model.id,
            email=model.email,
            senha_hash=model.senha_hash,
            tipo_usuario=model.tipo_usuario,
            status=model.status,
            criado_em=model.criado_em,
            atualizado_em=model.atualizado_em,
        )
