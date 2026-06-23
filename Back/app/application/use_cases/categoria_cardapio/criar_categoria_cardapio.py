from app.application.dto.categoria_cardapio_dto import CriarCategoriaCardapioDTO
from app.core.categoria_cardapio_exceptions import CategoriaCardapioJaExisteError
from app.domain.entities.categoria_cardapio import CategoriaCardapio
from app.domain.repositories.categoria_cardapio_repository import CategoriaCardapioRepository


class CriarCategoriaCardapioUseCase:
    def __init__(self, repository: CategoriaCardapioRepository) -> None:
        self.repository = repository

    def executar(self, dto: CriarCategoriaCardapioDTO) -> CategoriaCardapio:
        nome_normalizado = dto.nome.strip().upper()
        categoria_existente = self.repository.buscar_por_nome(nome_normalizado)
        if categoria_existente is not None:
            raise CategoriaCardapioJaExisteError()

        categoria = CategoriaCardapio(
            id=None,
            nome=nome_normalizado,
        )
        return self.repository.criar(categoria)
