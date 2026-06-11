from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.restaurante_exceptions import CnpjJaCadastradoError
from app.domain.entities.restaurante import Restaurante
from app.domain.repositories.restaurante_repository import RestauranteRepository
from app.infrastructure.database.models.restaurante_model import RestauranteModel


class SQLAlchemyRestauranteRepository(RestauranteRepository):
    def __init__(self, session: Session) -> None:
        self.session = session

    def criar(self, restaurante: Restaurante) -> Restaurante:
        model = RestauranteModel(
            usuario_dono_id=restaurante.usuario_dono_id,
            nome_fantasia=restaurante.nome_fantasia,
            razao_social=restaurante.razao_social,
            cnpj=restaurante.cnpj,
            telefone=restaurante.telefone,
            validado=restaurante.validado,
            logo_url=restaurante.logo_url,
        )
        self.session.add(model)
        try:
            self.session.commit()
        except IntegrityError as exc:
            self.session.rollback()
            raise CnpjJaCadastradoError() from exc
        self.session.refresh(model)
        return self._to_entity(model)

    def listar(self) -> list[Restaurante]:
        models = self.session.query(RestauranteModel).order_by(RestauranteModel.id).all()
        return [self._to_entity(model) for model in models]

    def buscar_por_id(self, restaurante_id: int) -> Restaurante | None:
        model = self.session.get(RestauranteModel, restaurante_id)
        return self._to_entity(model) if model is not None else None

    def atualizar(self, restaurante: Restaurante) -> Restaurante:
        model = self.session.get(RestauranteModel, restaurante.id)
        if model is None:
            raise ValueError("Restaurante nao encontrado.")

        model.usuario_dono_id = restaurante.usuario_dono_id
        model.nome_fantasia = restaurante.nome_fantasia
        model.razao_social = restaurante.razao_social
        model.cnpj = restaurante.cnpj
        model.telefone = restaurante.telefone
        model.validado = restaurante.validado
        model.logo_url = restaurante.logo_url
        try:
            self.session.commit()
        except IntegrityError as exc:
            self.session.rollback()
            raise CnpjJaCadastradoError() from exc
        self.session.refresh(model)
        return self._to_entity(model)

    def excluir(self, restaurante_id: int) -> None:
        model = self.session.get(RestauranteModel, restaurante_id)
        if model is None:
            return
        self.session.delete(model)
        self.session.commit()

    def buscar_por_cnpj(self, cnpj: str) -> Restaurante | None:
        model = self.session.query(RestauranteModel).filter(RestauranteModel.cnpj == cnpj).first()
        return self._to_entity(model) if model is not None else None

    @staticmethod
    def _to_entity(model: RestauranteModel) -> Restaurante:
        return Restaurante(
            id=model.id,
            usuario_dono_id=model.usuario_dono_id,
            nome_fantasia=model.nome_fantasia,
            razao_social=model.razao_social,
            cnpj=model.cnpj,
            telefone=model.telefone,
            validado=model.validado,
            logo_url=model.logo_url,
            criado_em=model.criado_em,
            atualizado_em=model.atualizado_em,
        )
