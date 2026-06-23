from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.application.dto.item_cardapio_dto import AtualizarItemCardapioDTO, CriarItemCardapioDTO
from app.application.use_cases.item_cardapio.atualizar_item_cardapio import AtualizarItemCardapioUseCase
from app.application.use_cases.item_cardapio.buscar_item_cardapio_por_id import BuscarItemCardapioPorIdUseCase
from app.application.use_cases.item_cardapio.criar_item_cardapio import CriarItemCardapioUseCase
from app.application.use_cases.item_cardapio.excluir_item_cardapio import ExcluirItemCardapioUseCase
from app.application.use_cases.item_cardapio.listar_itens_cardapio import ListarItensCardapioUseCase
from app.presentation.schemas.item_cardapio_schema import (
    ItemCardapioCreate,
    ItemCardapioResponse,
    ItemCardapioUpdate,
)
from app.shared.dependencies import (
    get_atualizar_item_cardapio_use_case,
    get_buscar_item_cardapio_por_id_use_case,
    get_criar_item_cardapio_use_case,
    get_excluir_item_cardapio_use_case,
    get_listar_itens_cardapio_use_case,
)

router = APIRouter(prefix="/itens-cardapio", tags=["itens-cardapio"])


@router.post("", response_model=ItemCardapioResponse, status_code=status.HTTP_201_CREATED)
def criar_item_cardapio(
    payload: ItemCardapioCreate,
    use_case: Annotated[CriarItemCardapioUseCase, Depends(get_criar_item_cardapio_use_case)],
) -> ItemCardapioResponse:
    item = use_case.executar(
        CriarItemCardapioDTO(
            restaurante_id=payload.restaurante_id,
            categoria_id=payload.categoria_id,
            nome=payload.nome,
            descricao=payload.descricao,
            preco=Decimal(str(payload.preco)),
            carboidratos=Decimal(str(payload.carboidratos)),
            gorduras=Decimal(str(payload.gorduras)),
            proteina=Decimal(str(payload.proteina)),
            caloria=Decimal(str(payload.caloria)),
            tamanho=payload.tamanho,
            status_item=payload.status_item,
            foto_url=payload.foto_url,
        )
    )
    return ItemCardapioResponse.model_validate(item)


@router.get("", response_model=list[ItemCardapioResponse])
def listar_itens_cardapio(
    use_case: Annotated[
        ListarItensCardapioUseCase,
        Depends(get_listar_itens_cardapio_use_case),
    ],
    restaurante_id: int | None = Query(default=None, gt=0),
) -> list[ItemCardapioResponse]:
    itens = use_case.executar(restaurante_id=restaurante_id)
    return [ItemCardapioResponse.model_validate(item) for item in itens]


@router.get("/{item_id}", response_model=ItemCardapioResponse)
def buscar_item_cardapio_por_id(
    item_id: int,
    use_case: Annotated[BuscarItemCardapioPorIdUseCase, Depends(get_buscar_item_cardapio_por_id_use_case)],
) -> ItemCardapioResponse:
    item = use_case.executar(item_id)
    return ItemCardapioResponse.model_validate(item)


@router.put("/{item_id}", response_model=ItemCardapioResponse)
def atualizar_item_cardapio(
    item_id: int,
    payload: ItemCardapioUpdate,
    use_case: Annotated[AtualizarItemCardapioUseCase, Depends(get_atualizar_item_cardapio_use_case)],
) -> ItemCardapioResponse:
    item = use_case.executar(
        item_id,
        AtualizarItemCardapioDTO(
            restaurante_id=payload.restaurante_id,
            categoria_id=payload.categoria_id,
            nome=payload.nome,
            descricao=payload.descricao,
            preco=Decimal(str(payload.preco)),
            carboidratos=Decimal(str(payload.carboidratos)),
            gorduras=Decimal(str(payload.gorduras)),
            proteina=Decimal(str(payload.proteina)),
            caloria=Decimal(str(payload.caloria)),
            tamanho=payload.tamanho,
            status_item=payload.status_item,
            foto_url=payload.foto_url,
        ),
    )
    return ItemCardapioResponse.model_validate(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_item_cardapio(
    item_id: int,
    use_case: Annotated[ExcluirItemCardapioUseCase, Depends(get_excluir_item_cardapio_use_case)],
) -> None:
    use_case.executar(item_id)
