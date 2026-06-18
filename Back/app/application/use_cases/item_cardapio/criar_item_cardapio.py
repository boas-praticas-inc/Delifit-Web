from app.application.dto.item_cardapio_dto import CriarItemCardapioDTO
from app.domain.entities.item_cardapio import ItemCardapio
from app.domain.repositories.item_cardapio_repository import ItemCardapioRepository


class CriarItemCardapioUseCase:
    def __init__(self, repository: ItemCardapioRepository) -> None:
        self.repository = repository

    def executar(self, dto: CriarItemCardapioDTO) -> ItemCardapio:
        item = ItemCardapio(
            id=None,
            restaurante_id=dto.restaurante_id,
            nome=dto.nome,
            descricao=dto.descricao,
            preco=dto.preco,
            tamanho=dto.tamanho,
            status_item=dto.status_item,
            foto_url=dto.foto_url,
        )
        return self.repository.criar(item)
