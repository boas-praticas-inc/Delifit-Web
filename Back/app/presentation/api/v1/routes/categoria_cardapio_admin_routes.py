from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.application.dto.categoria_cardapio_dto import CriarCategoriaCardapioDTO
from app.application.use_cases.categoria_cardapio.criar_categoria_cardapio import (
    CriarCategoriaCardapioUseCase,
)
from app.application.use_cases.categoria_cardapio.excluir_categoria_cardapio import (
    ExcluirCategoriaCardapioUseCase,
)
from app.application.use_cases.categoria_cardapio.listar_categorias_cardapio import (
    ListarCategoriasCardapioUseCase,
)
from app.domain.enums.usuario_enums import TipoUsuarioEnum
from app.presentation.schemas.categoria_cardapio_schema import (
    CategoriaCardapioCreate,
    CategoriaCardapioResponse,
)
from app.shared.dependencies import (
    get_criar_categoria_cardapio_use_case,
    get_excluir_categoria_cardapio_use_case,
    get_listar_categorias_cardapio_use_case,
    require_roles,
)

router = APIRouter(
    prefix="/admins/categorias-cardapio",
    tags=["admins-categorias-cardapio"],
    dependencies=[Depends(require_roles(TipoUsuarioEnum.ADMIN))],
)


@router.post("", response_model=CategoriaCardapioResponse, status_code=status.HTTP_201_CREATED)
def criar_categoria_cardapio(
    payload: CategoriaCardapioCreate,
    use_case: Annotated[
        CriarCategoriaCardapioUseCase,
        Depends(get_criar_categoria_cardapio_use_case),
    ],
) -> CategoriaCardapioResponse:
    categoria = use_case.executar(CriarCategoriaCardapioDTO(nome=payload.nome))
    return CategoriaCardapioResponse.model_validate(categoria)


@router.get("", response_model=list[CategoriaCardapioResponse])
def listar_categorias_cardapio(
    use_case: Annotated[
        ListarCategoriasCardapioUseCase,
        Depends(get_listar_categorias_cardapio_use_case),
    ],
) -> list[CategoriaCardapioResponse]:
    categorias = use_case.executar()
    return [CategoriaCardapioResponse.model_validate(categoria) for categoria in categorias]


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_categoria_cardapio(
    categoria_id: int,
    use_case: Annotated[
        ExcluirCategoriaCardapioUseCase,
        Depends(get_excluir_categoria_cardapio_use_case),
    ],
) -> None:
    use_case.executar(categoria_id)
