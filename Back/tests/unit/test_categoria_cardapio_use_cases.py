import pytest

from app.application.dto.categoria_cardapio_dto import CriarCategoriaCardapioDTO
from app.application.use_cases.categoria_cardapio.criar_categoria_cardapio import CriarCategoriaCardapioUseCase
from app.application.use_cases.categoria_cardapio.excluir_categoria_cardapio import ExcluirCategoriaCardapioUseCase
from app.application.use_cases.categoria_cardapio.listar_categorias_cardapio import ListarCategoriasCardapioUseCase
from app.core.categoria_cardapio_exceptions import (
    CategoriaCardapioEmUsoError,
    CategoriaCardapioJaExisteError,
    CategoriaCardapioNaoEncontradaError,
)
from app.domain.entities.categoria_cardapio import CategoriaCardapio
from app.domain.repositories.categoria_cardapio_repository import CategoriaCardapioRepository


class FakeCategoriaCardapioRepository(CategoriaCardapioRepository):
    def __init__(self) -> None:
        self.categorias: list[CategoriaCardapio] = []
        self.categorias_em_uso: set[int] = set()

    def criar(self, categoria: CategoriaCardapio) -> CategoriaCardapio:
        categoria_criada = CategoriaCardapio(id=len(self.categorias) + 1, nome=categoria.nome)
        self.categorias.append(categoria_criada)
        return categoria_criada

    def listar(self) -> list[CategoriaCardapio]:
        return self.categorias

    def buscar_por_id(self, categoria_id: int) -> CategoriaCardapio | None:
        return next((categoria for categoria in self.categorias if categoria.id == categoria_id), None)

    def buscar_por_nome(self, nome: str) -> CategoriaCardapio | None:
        return next((categoria for categoria in self.categorias if categoria.nome == nome), None)

    def excluir(self, categoria_id: int) -> None:
        self.categorias = [categoria for categoria in self.categorias if categoria.id != categoria_id]

    def possui_itens_vinculados(self, categoria_id: int) -> bool:
        return categoria_id in self.categorias_em_uso


def test_criar_categoria_cardapio_normaliza_nome() -> None:
    repository = FakeCategoriaCardapioRepository()
    use_case = CriarCategoriaCardapioUseCase(repository=repository)

    categoria = use_case.executar(CriarCategoriaCardapioDTO(nome="  marmita  "))

    assert categoria.id == 1
    assert categoria.nome == "MARMITA"


def test_criar_categoria_cardapio_lanca_quando_nome_ja_existe() -> None:
    repository = FakeCategoriaCardapioRepository()
    repository.categorias.append(CategoriaCardapio(id=1, nome="MARMITA"))
    use_case = CriarCategoriaCardapioUseCase(repository=repository)

    with pytest.raises(CategoriaCardapioJaExisteError):
        use_case.executar(CriarCategoriaCardapioDTO(nome="marmita"))


def test_listar_categorias_cardapio_retorna_categorias() -> None:
    repository = FakeCategoriaCardapioRepository()
    repository.categorias = [
        CategoriaCardapio(id=1, nome="BEBIDA"),
        CategoriaCardapio(id=2, nome="MARMITA"),
    ]
    use_case = ListarCategoriasCardapioUseCase(repository=repository)

    categorias = use_case.executar()

    assert len(categorias) == 2
    assert categorias[0].nome == "BEBIDA"


def test_excluir_categoria_cardapio_lanca_quando_nao_encontra() -> None:
    repository = FakeCategoriaCardapioRepository()
    use_case = ExcluirCategoriaCardapioUseCase(repository=repository)

    with pytest.raises(CategoriaCardapioNaoEncontradaError):
        use_case.executar(10)


def test_excluir_categoria_cardapio_lanca_quando_categoria_esta_em_uso() -> None:
    repository = FakeCategoriaCardapioRepository()
    repository.categorias.append(CategoriaCardapio(id=1, nome="MARMITA"))
    repository.categorias_em_uso.add(1)
    use_case = ExcluirCategoriaCardapioUseCase(repository=repository)

    with pytest.raises(CategoriaCardapioEmUsoError):
        use_case.executar(1)
