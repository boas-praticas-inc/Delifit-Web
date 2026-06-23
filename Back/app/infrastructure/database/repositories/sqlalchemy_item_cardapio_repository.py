from datetime import datetime

from sqlalchemy.orm import Session

from app.domain.entities.item_cardapio import ItemCardapio
from app.domain.repositories.item_cardapio_repository import ItemCardapioRepository
from app.infrastructure.database.models.item_cardapio_model import ItemCardapioModel


class SQLAlchemyItemCardapioRepository(ItemCardapioRepository):
    def __init__(self, session: Session) -> None:
        self.session = session

    def criar(self, item: ItemCardapio) -> ItemCardapio:
        model = ItemCardapioModel(
            restaurante_id=item.restaurante_id,
            categoria_id=item.categoria_id,
            nome=item.nome,
            descricao=item.descricao,
            preco=item.preco,
            carboidratos=item.carboidratos,
            gorduras=item.gorduras,
            proteina=item.proteina,
            caloria=item.caloria,
            tamanho=item.tamanho,
            status_item=item.status_item,
            foto_url=item.foto_url,
        )
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)
        return self._to_entity(model)

    def listar(self, restaurante_id: int | None = None) -> list[ItemCardapio]:
        query = self.session.query(ItemCardapioModel)
        if restaurante_id is not None:
            query = query.filter(ItemCardapioModel.restaurante_id == restaurante_id)
        models = query.order_by(ItemCardapioModel.nome, ItemCardapioModel.id).all()
        return [self._to_entity(model) for model in models]

    def buscar_por_id(self, item_id: int) -> ItemCardapio | None:
        model = self.session.get(ItemCardapioModel, item_id)
        return self._to_entity(model) if model is not None else None

    def atualizar(self, item: ItemCardapio) -> ItemCardapio:
        model = self.session.get(ItemCardapioModel, item.id)
        if model is None:
            raise ValueError("Item do cardapio nao encontrado.")

        model.restaurante_id = item.restaurante_id
        model.categoria_id = item.categoria_id
        model.nome = item.nome
        model.descricao = item.descricao
        model.preco = item.preco
        model.carboidratos = item.carboidratos
        model.gorduras = item.gorduras
        model.proteina = item.proteina
        model.caloria = item.caloria
        model.tamanho = item.tamanho
        model.status_item = item.status_item
        model.foto_url = item.foto_url
        model.atualizado_em = datetime.utcnow()
        self.session.commit()
        self.session.refresh(model)
        return self._to_entity(model)

    def excluir(self, item_id: int) -> None:
        model = self.session.get(ItemCardapioModel, item_id)
        if model is None:
            return
        self.session.delete(model)
        self.session.commit()

    @staticmethod
    def _to_entity(model: ItemCardapioModel) -> ItemCardapio:
        return ItemCardapio(
            id=model.id,
            restaurante_id=model.restaurante_id,
            categoria_id=model.categoria_id,
            nome=model.nome,
            descricao=model.descricao,
            preco=model.preco,
            carboidratos=model.carboidratos,
            gorduras=model.gorduras,
            proteina=model.proteina,
            caloria=model.caloria,
            tamanho=model.tamanho,
            status_item=model.status_item,
            foto_url=model.foto_url,
            criado_em=model.criado_em,
            atualizado_em=model.atualizado_em,
        )
