from datetime import datetime
from decimal import Decimal

import pytest

from app.application.dto.item_cardapio_dto import AtualizarItemCardapioDTO, CriarItemCardapioDTO
from app.application.dto.item_cardapio_dto import VariacaoItemCardapioDTO
from app.application.use_cases.item_cardapio.atualizar_item_cardapio import AtualizarItemCardapioUseCase
from app.application.use_cases.item_cardapio.criar_item_cardapio import CriarItemCardapioUseCase
from app.application.use_cases.item_cardapio.excluir_item_cardapio import ExcluirItemCardapioUseCase
from app.application.use_cases.item_cardapio.listar_itens_cardapio import ListarItensCardapioUseCase
from app.core.item_cardapio_exceptions import ItemCardapioNaoEncontradoError
from app.domain.entities.item_cardapio import ItemCardapio
from app.domain.repositories.item_cardapio_repository import ItemCardapioRepository
from app.domain.entities.variacao_item_cardapio import VariacaoItemCardapio


class FakeItemCardapioRepository(ItemCardapioRepository):
    def __init__(self) -> None:
        self.itens: list[ItemCardapio] = []

    def criar(self, item: ItemCardapio) -> ItemCardapio:
        item_criado = ItemCardapio(
            id=len(self.itens) + 1,
            restaurante_id=item.restaurante_id,
            categoria_id=item.categoria_id,
            nome=item.nome,
            variacoes=[
                VariacaoItemCardapio(
                    id=index + 1,
                    descricao_variacao=variacao.descricao_variacao,
                    quantidade=variacao.quantidade,
                    unidade_medida=variacao.unidade_medida,
                    preco=variacao.preco,
                    carboidratos=variacao.carboidratos,
                    gorduras=variacao.gorduras,
                    proteina=variacao.proteina,
                    caloria=variacao.caloria,
                )
                for index, variacao in enumerate(item.variacoes)
            ],
            descricao=item.descricao,
            status_item=item.status_item,
            foto_url=item.foto_url,
            criado_em=datetime(2026, 6, 18, 12, 0, 0),
            atualizado_em=datetime(2026, 6, 18, 12, 0, 0),
        )
        self.itens.append(item_criado)
        return item_criado

    def listar(self, restaurante_id: int | None = None) -> list[ItemCardapio]:
        if restaurante_id is None:
            return self.itens
        return [item for item in self.itens if item.restaurante_id == restaurante_id]

    def buscar_por_id(self, item_id: int) -> ItemCardapio | None:
        return next((item for item in self.itens if item.id == item_id), None)

    def atualizar(self, item: ItemCardapio) -> ItemCardapio:
        return item

    def excluir(self, item_id: int) -> None:
        self.itens = [item for item in self.itens if item.id != item_id]


def test_criar_item_cardapio_persiste_item() -> None:
    repository = FakeItemCardapioRepository()
    use_case = CriarItemCardapioUseCase(repository=repository)

    item = use_case.executar(
        CriarItemCardapioDTO(
            restaurante_id=3,
            categoria_id=2,
            nome="Marmita Fit",
            descricao="Frango com legumes",
            variacoes=[
                VariacaoItemCardapioDTO(
                    quantidade=Decimal("500"),
                    unidade_medida="G",
                    preco=Decimal("29.90"),
                    carboidratos=Decimal("18.50"),
                    gorduras=Decimal("7.20"),
                    proteina=Decimal("25.00"),
                    caloria=Decimal("310.00"),
                )
            ],
            status_item="ATIVO",
            foto_url=None,
        )
    )

    assert item.id == 1
    assert item.restaurante_id == 3
    assert item.categoria_id == 2
    assert item.variacoes[0].preco == Decimal("29.90")
    assert item.variacoes[0].proteina == Decimal("25.00")


def test_atualizar_item_cardapio_lanca_quando_nao_encontra() -> None:
    repository = FakeItemCardapioRepository()
    use_case = AtualizarItemCardapioUseCase(repository=repository)

    with pytest.raises(ItemCardapioNaoEncontradoError):
        use_case.executar(
            99,
            AtualizarItemCardapioDTO(
                restaurante_id=1,
                categoria_id=1,
                nome="Novo item",
                descricao=None,
                variacoes=[
                VariacaoItemCardapioDTO(
                        quantidade=Decimal("300"),
                        unidade_medida="G",
                        preco=Decimal("10.00"),
                        carboidratos=Decimal("10.00"),
                        gorduras=Decimal("2.00"),
                        proteina=Decimal("5.00"),
                        caloria=Decimal("120.00"),
                    )
                ],
                status_item="ATIVO",
                foto_url=None,
            ),
        )


def test_listar_itens_cardapio_filtra_por_restaurante() -> None:
    repository = FakeItemCardapioRepository()
    criar_use_case = CriarItemCardapioUseCase(repository=repository)
    listar_use_case = ListarItensCardapioUseCase(repository=repository)

    criar_use_case.executar(
        CriarItemCardapioDTO(
            restaurante_id=1,
            categoria_id=1,
            nome="Item A",
            descricao=None,
            variacoes=[
                VariacaoItemCardapioDTO(
                    quantidade=Decimal("500"),
                    unidade_medida="G",
                    preco=Decimal("11.50"),
                    carboidratos=Decimal("14.00"),
                    gorduras=Decimal("3.00"),
                    proteina=Decimal("8.00"),
                    caloria=Decimal("160.00"),
                )
            ],
            status_item="ATIVO",
            foto_url=None,
        )
    )
    criar_use_case.executar(
        CriarItemCardapioDTO(
            restaurante_id=2,
            categoria_id=2,
            nome="Item B",
            descricao=None,
            variacoes=[
                VariacaoItemCardapioDTO(
                    quantidade=Decimal("700"),
                    unidade_medida="G",
                    preco=Decimal("13.50"),
                    carboidratos=Decimal("20.00"),
                    gorduras=Decimal("4.00"),
                    proteina=Decimal("10.00"),
                    caloria=Decimal("210.00"),
                )
            ],
            status_item="ATIVO",
            foto_url=None,
        )
    )

    itens = listar_use_case.executar(restaurante_id=1)

    assert len(itens) == 1
    assert itens[0].nome == "Item A"


def test_excluir_item_cardapio_lanca_quando_nao_encontra() -> None:
    repository = FakeItemCardapioRepository()
    use_case = ExcluirItemCardapioUseCase(repository=repository)

    with pytest.raises(ItemCardapioNaoEncontradoError):
        use_case.executar(10)
