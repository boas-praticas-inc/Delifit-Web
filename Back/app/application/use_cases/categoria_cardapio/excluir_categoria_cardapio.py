from app.core.categoria_cardapio_exceptions import (
    CategoriaCardapioEmUsoError,
    CategoriaCardapioNaoEncontradaError,
)
from app.domain.repositories.categoria_cardapio_repository import CategoriaCardapioRepository


class ExcluirCategoriaCardapioUseCase:
    def __init__(self, repository: CategoriaCardapioRepository) -> None:
        self.repository = repository

    def executar(self, categoria_id: int) -> None:
        categoria = self.repository.buscar_por_id(categoria_id)
        if categoria is None:
            raise CategoriaCardapioNaoEncontradaError()

        if self.repository.possui_itens_vinculados(categoria_id):
            raise CategoriaCardapioEmUsoError()

        self.repository.excluir(categoria_id)
