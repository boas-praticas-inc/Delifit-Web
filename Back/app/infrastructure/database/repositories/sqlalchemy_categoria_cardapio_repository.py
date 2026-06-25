from sqlalchemy import exists, select
from sqlalchemy.orm import Session

from app.domain.entities.categoria_cardapio import CategoriaCardapio
from app.domain.repositories.categoria_cardapio_repository import CategoriaCardapioRepository
from app.infrastructure.database.models.categoria_cardapio_model import CategoriaCardapioModel
from app.infrastructure.database.models.item_cardapio_model import ItemCardapioModel


class SQLAlchemyCategoriaCardapioRepository(CategoriaCardapioRepository):
    def __init__(self, session: Session) -> None:
        self.session = session

    def criar(self, categoria: CategoriaCardapio) -> CategoriaCardapio:
        model = CategoriaCardapioModel(nome=categoria.nome)
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)
        return self._to_entity(model)

    def listar(self) -> list[CategoriaCardapio]:
        models = self.session.query(CategoriaCardapioModel).order_by(CategoriaCardapioModel.nome).all()
        return [self._to_entity(model) for model in models]

    def buscar_por_id(self, categoria_id: int) -> CategoriaCardapio | None:
        model = self.session.get(CategoriaCardapioModel, categoria_id)
        return self._to_entity(model) if model is not None else None

    def buscar_por_nome(self, nome: str) -> CategoriaCardapio | None:
        model = self.session.query(CategoriaCardapioModel).filter(CategoriaCardapioModel.nome == nome).one_or_none()
        return self._to_entity(model) if model is not None else None

    def excluir(self, categoria_id: int) -> None:
        model = self.session.get(CategoriaCardapioModel, categoria_id)
        if model is None:
            return
        self.session.delete(model)
        self.session.commit()

    def possui_itens_vinculados(self, categoria_id: int) -> bool:
        query = select(exists().where(ItemCardapioModel.categoria_id == categoria_id))
        return bool(self.session.execute(query).scalar())

    @staticmethod
    def _to_entity(model: CategoriaCardapioModel) -> CategoriaCardapio:
        return CategoriaCardapio(
            id=model.id,
            nome=model.nome,
        )
