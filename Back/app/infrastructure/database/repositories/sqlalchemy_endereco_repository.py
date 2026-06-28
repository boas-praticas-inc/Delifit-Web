from sqlalchemy.orm import Session

from app.domain.entities.endereco import Endereco
from app.domain.repositories.endereco_repository import EnderecoRepository
from app.infrastructure.database.models.endereco_model import EnderecoModel


class SQLAlchemyEnderecoRepository(EnderecoRepository):
    def __init__(self, session: Session) -> None:
        self.session = session

    def criar(self, endereco: Endereco) -> Endereco:
        model = EnderecoModel(
            cep=endereco.cep,
            logradouro=endereco.logradouro,
            numero=endereco.numero,
            bairro=endereco.bairro,
            cidade=endereco.cidade,
            estado=endereco.estado,
            complemento=endereco.complemento,
            referencia=endereco.referencia,
            label=endereco.label,
            cliente_id=endereco.cliente_id,
        )
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)
        return self._to_entity(model)

    def listar(self) -> list[Endereco]:
        models = self.session.query(EnderecoModel).order_by(EnderecoModel.id).all()
        return [self._to_entity(model) for model in models]

    def listar_por_cliente_id(self, cliente_id: int) -> list[Endereco]:
        models = (
            self.session.query(EnderecoModel)
            .filter(EnderecoModel.cliente_id == cliente_id)
            .order_by(EnderecoModel.id)
            .all()
        )
        return [self._to_entity(model) for model in models]

    def buscar_por_id(self, endereco_id: int) -> Endereco | None:
        model = self.session.get(EnderecoModel, endereco_id)
        return self._to_entity(model) if model is not None else None

    def buscar_por_id_e_cliente_id(self, endereco_id: int, cliente_id: int) -> Endereco | None:
        model = (
            self.session.query(EnderecoModel)
            .filter(
                EnderecoModel.id == endereco_id,
                EnderecoModel.cliente_id == cliente_id,
            )
            .first()
        )
        return self._to_entity(model) if model is not None else None

    def atualizar(self, endereco_id: int, endereco: Endereco) -> Endereco | None:
        model = self.session.get(EnderecoModel, endereco_id)
        if model is None:
            return None

        model.cep = endereco.cep
        model.logradouro = endereco.logradouro
        model.numero = endereco.numero
        model.bairro = endereco.bairro
        model.cidade = endereco.cidade
        model.estado = endereco.estado
        model.complemento = endereco.complemento
        model.referencia = endereco.referencia
        model.label = endereco.label
        model.cliente_id = endereco.cliente_id
        self.session.commit()
        self.session.refresh(model)
        return self._to_entity(model)

    def excluir(self, endereco_id: int) -> bool:
        model = self.session.get(EnderecoModel, endereco_id)
        if model is None:
            return False

        self.session.delete(model)
        self.session.commit()
        return True

    @staticmethod
    def _to_entity(model: EnderecoModel) -> Endereco:
        return Endereco(
            id=model.id,
            cep=model.cep,
            logradouro=model.logradouro,
            numero=model.numero,
            bairro=model.bairro,
            cidade=model.cidade,
            estado=model.estado,
            complemento=model.complemento,
            referencia=model.referencia,
            label=model.label,
            cliente_id=model.cliente_id,
        )

