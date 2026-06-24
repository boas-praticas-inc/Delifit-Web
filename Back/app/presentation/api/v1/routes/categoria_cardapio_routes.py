from typing import Annotated

from fastapi import APIRouter, Depends

from app.application.use_cases.categoria_cardapio.listar_categorias_cardapio import ListarCategoriasCardapioUseCase
from app.presentation.schemas.categoria_cardapio_schema import CategoriaCardapioResponse
from app.shared.dependencies import get_listar_categorias_cardapio_use_case

router = APIRouter(prefix="/categorias-cardapio", tags=["categorias-cardapio"])


@router.get("", response_model=list[CategoriaCardapioResponse])
def listar_categorias_cardapio(
    use_case: Annotated[ListarCategoriasCardapioUseCase, Depends(get_listar_categorias_cardapio_use_case)],
) -> list[CategoriaCardapioResponse]:
    categorias = use_case.executar()
    return [CategoriaCardapioResponse.model_validate(categoria) for categoria in categorias]
