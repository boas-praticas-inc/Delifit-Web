from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import CpfJaCadastradoError
from app.domain.entities.cliente import Cliente
from app.domain.repositories.cliente_repository import ClienteRepository
from app.infrastructure.database.models.cliente_model import ClienteModel


class SQLAlchemyClienteRepository(ClienteRepository):
    def __init__(self, session: Session) -> None:
        self.session = session

    def criar(self, cliente: Cliente) -> Cliente:
        model = ClienteModel(
            usuario_id=cliente.usuario_id,
            nome_completo=cliente.nome_completo,
            cpf=cliente.cpf,
            data_nascimento=cliente.data_nascimento,
        )
        self.session.add(model)
        try:
            self.session.commit()
        except IntegrityError as exc:
            self.session.rollback()
            mensagem = str(exc.orig).lower() if exc.orig is not None else str(exc).lower()
            if "cpf" in mensagem:
                raise CpfJaCadastradoError() from exc
            raise
        self.session.refresh(model)
        return self._to_entity(model)

    def buscar_por_usuario_id(self, usuario_id: int) -> Cliente | None:
        model = (
            self.session.query(ClienteModel)
            .filter(ClienteModel.usuario_id == usuario_id)
            .first()
        )
        return self._to_entity(model) if model is not None else None

    def listar(self) -> list[Cliente]:
        models = self.session.query(ClienteModel).order_by(ClienteModel.id).all()
        return [self._to_entity(model) for model in models]

    def buscar_por_id(self, cliente_id: int) -> Cliente | None:
        model = self.session.get(ClienteModel, cliente_id)
        return self._to_entity(model) if model is not None else None

    def atualizar(self, cliente_id: int, cliente: Cliente) -> Cliente | None:
        model = self.session.get(ClienteModel, cliente_id)
        if model is None:
            return None

        model.usuario_id = cliente.usuario_id
        model.nome_completo = cliente.nome_completo
        model.cpf = cliente.cpf
        model.data_nascimento = cliente.data_nascimento
        try:
            self.session.commit()
        except IntegrityError as exc:
            self.session.rollback()
            mensagem = str(exc.orig).lower() if exc.orig is not None else str(exc).lower()
            if "cpf" in mensagem:
                raise CpfJaCadastradoError() from exc
            raise
        self.session.refresh(model)
        return self._to_entity(model)

    def excluir(self, cliente_id: int) -> bool:
        model = self.session.get(ClienteModel, cliente_id)
        if model is None:
            return False

        self.session.delete(model)
        self.session.commit()
        return True

    @staticmethod
    def _to_entity(model: ClienteModel) -> Cliente:
        return Cliente(
            id=model.id,
            usuario_id=model.usuario_id,
            nome_completo=model.nome_completo,
            cpf=model.cpf,
            data_nascimento=model.data_nascimento,
        )

