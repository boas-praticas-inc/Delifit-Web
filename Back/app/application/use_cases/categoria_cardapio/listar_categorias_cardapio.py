from app.domain.entities.categoria_cardapio import CategoriaCardapio
from app.domain.repositories.categoria_cardapio_repository import CategoriaCardapioRepository


class ListarCategoriasCardapioUseCase:
    def __init__(self, repository: CategoriaCardapioRepository) -> None:
        self.repository = repository

    def executar(self) -> list[CategoriaCardapio]:
        return self.repository.listar()
