from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.application.dto.restaurante_dto import AtualizarRestauranteDTO, CriarRestauranteDTO
from app.application.use_cases.restaurante.atualizar_restaurante import AtualizarRestauranteUseCase
from app.application.use_cases.restaurante.buscar_restaurante_por_id import (
    BuscarRestaurantePorIdUseCase,
)
from app.application.use_cases.restaurante.criar_restaurante import CriarRestauranteUseCase
from app.application.use_cases.restaurante.excluir_restaurante import ExcluirRestauranteUseCase
from app.application.use_cases.restaurante.listar_restaurantes import ListarRestaurantesUseCase
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import TipoUsuarioEnum
from app.presentation.schemas.restaurante_schema import (
    RestauranteCreate,
    RestauranteResponse,
    RestauranteUpdate,
)
from app.shared.dependencies import (
    get_atualizar_restaurante_use_case,
    get_buscar_restaurante_por_id_use_case,
    get_criar_restaurante_use_case,
    get_excluir_restaurante_use_case,
    get_listar_restaurantes_use_case,
    require_roles,
)

router = APIRouter(prefix="/restaurantes", tags=["restaurantes"])


@router.post("", response_model=RestauranteResponse, status_code=status.HTTP_201_CREATED)
def criar_restaurante(
    payload: RestauranteCreate,
    _gestor: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.GESTOR))],
    use_case: Annotated[CriarRestauranteUseCase, Depends(get_criar_restaurante_use_case)],
) -> RestauranteResponse:
    restaurante = use_case.executar(
        CriarRestauranteDTO(
            gestor_id=payload.gestor_id,
            endereco_id=payload.endereco_id,
            solicitacao_adesao_id=payload.solicitacao_adesao_id,
            nome_fantasia=payload.nome_fantasia,
            razao_social=payload.razao_social,
            cnpj=payload.cnpj,
            telefone=payload.telefone,
            descricao=payload.descricao,
            foto_url=payload.foto_url,
        )
    )
    return RestauranteResponse.model_validate(restaurante)


@router.get("", response_model=list[RestauranteResponse])
def listar_restaurantes(
    use_case: Annotated[ListarRestaurantesUseCase, Depends(get_listar_restaurantes_use_case)],
) -> list[RestauranteResponse]:
    restaurantes = use_case.executar()
    return [RestauranteResponse.model_validate(restaurante) for restaurante in restaurantes]


@router.get("/{restaurante_id}", response_model=RestauranteResponse)
def buscar_restaurante_por_id(
    restaurante_id: int,
    use_case: Annotated[
        BuscarRestaurantePorIdUseCase,
        Depends(get_buscar_restaurante_por_id_use_case),
    ],
) -> RestauranteResponse:
    restaurante = use_case.executar(restaurante_id)
    return RestauranteResponse.model_validate(restaurante)


@router.put("/{restaurante_id}", response_model=RestauranteResponse)
def atualizar_restaurante(
    restaurante_id: int,
    payload: RestauranteUpdate,
    _gestor: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.GESTOR))],
    use_case: Annotated[AtualizarRestauranteUseCase, Depends(get_atualizar_restaurante_use_case)],
) -> RestauranteResponse:
    restaurante = use_case.executar(
        restaurante_id,
        AtualizarRestauranteDTO(
            gestor_id=payload.gestor_id,
            endereco_id=payload.endereco_id,
            solicitacao_adesao_id=payload.solicitacao_adesao_id,
            nome_fantasia=payload.nome_fantasia,
            razao_social=payload.razao_social,
            cnpj=payload.cnpj,
            telefone=payload.telefone,
            descricao=payload.descricao,
            foto_url=payload.foto_url,
        ),
    )
    return RestauranteResponse.model_validate(restaurante)


@router.delete("/{restaurante_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_restaurante(
    restaurante_id: int,
    _gestor: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.GESTOR))],
    use_case: Annotated[ExcluirRestauranteUseCase, Depends(get_excluir_restaurante_use_case)],
) -> None:
    use_case.executar(restaurante_id)
