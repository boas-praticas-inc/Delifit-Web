from sqlalchemy import update
from sqlalchemy.orm import Session

from app.domain.entities.cartao import Cartao
from app.domain.repositories.cartao_repository import CartaoRepository
from app.infrastructure.database.models.cartao_model import CartaoModel


class SQLAlchemyCartaoRepository(CartaoRepository):
    def __init__(self, session: Session) -> None:
        self.session = session

    def criar(self, cartao: Cartao) -> Cartao:
        model = CartaoModel(
            cliente_id=cartao.cliente_id,
            nome_titular=cartao.nome_titular,
            ultimos_quatro_digitos=cartao.ultimos_quatro_digitos,
            bandeira=cartao.bandeira,
            token_gateway=cartao.token_gateway,
            padrao=cartao.padrao,
        )
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)
        return self._to_entity(model)

    def listar_por_cliente_id(self, cliente_id: int) -> list[Cartao]:
        models = (
            self.session.query(CartaoModel)
            .filter(CartaoModel.cliente_id == cliente_id)
            .order_by(CartaoModel.id)
            .all()
        )
        return [self._to_entity(model) for model in models]

    def buscar_por_id_e_cliente_id(self, cartao_id: int, cliente_id: int) -> Cartao | None:
        model = (
            self.session.query(CartaoModel)
            .filter(CartaoModel.id == cartao_id, CartaoModel.cliente_id == cliente_id)
            .first()
        )
        return self._to_entity(model) if model is not None else None

    def atualizar(self, cartao_id: int, cartao: Cartao) -> Cartao | None:
        model = self.session.get(CartaoModel, cartao_id)
        if model is None:
            return None

        model.cliente_id = cartao.cliente_id
        model.nome_titular = cartao.nome_titular
        model.ultimos_quatro_digitos = cartao.ultimos_quatro_digitos
        model.bandeira = cartao.bandeira
        model.token_gateway = cartao.token_gateway
        model.padrao = cartao.padrao
        self.session.commit()
        self.session.refresh(model)
        return self._to_entity(model)

    def excluir(self, cartao_id: int) -> bool:
        model = self.session.get(CartaoModel, cartao_id)
        if model is None:
            return False

        self.session.delete(model)
        self.session.commit()
        return True

    def desmarcar_padrao_por_cliente(self, cliente_id: int) -> None:
        self.session.execute(
            update(CartaoModel)
            .where(CartaoModel.cliente_id == cliente_id)
            .values(padrao=False)
        )
        self.session.commit()

    @staticmethod
    def _to_entity(model: CartaoModel) -> Cartao:
        return Cartao(
            id=model.id,
            cliente_id=model.cliente_id,
            nome_titular=model.nome_titular,
            ultimos_quatro_digitos=model.ultimos_quatro_digitos,
            bandeira=model.bandeira,
            token_gateway=model.token_gateway,
            padrao=model.padrao,
            criado_em=model.criado_em,
        )
