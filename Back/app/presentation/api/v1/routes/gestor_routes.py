from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.application.dto.gestor_dto import CriarGestorDTO
from app.application.use_cases.gestor.buscar_gestor_por_id import BuscarGestorPorIdUseCase
from app.application.use_cases.gestor.criar_gestor import CriarGestorUseCase
from app.application.use_cases.gestor.listar_gestores import ListarGestoresUseCase
from app.presentation.schemas.gestor_schema import GestorCreate, GestorResponse
from app.shared.dependencies import (
    get_buscar_gestor_por_id_use_case,
    get_criar_gestor_use_case,
    get_listar_gestores_use_case,
)

router = APIRouter(prefix="/gestores", tags=["gestores"])


@router.post("", response_model=GestorResponse, status_code=status.HTTP_201_CREATED)
def criar_gestor(
    payload: GestorCreate,
    use_case: Annotated[CriarGestorUseCase, Depends(get_criar_gestor_use_case)],
) -> GestorResponse:
    gestor = use_case.executar(
        CriarGestorDTO(
            usuario_id=payload.usuario_id,
            nome_completo=payload.nome_completo,
            cpf=payload.cpf,
            telefone=payload.telefone,
        )
    )
    return GestorResponse.model_validate(gestor)


@router.get("", response_model=list[GestorResponse])
def listar_gestores(
    use_case: Annotated[ListarGestoresUseCase, Depends(get_listar_gestores_use_case)],
) -> list[GestorResponse]:
    gestores = use_case.executar()
    return [GestorResponse.model_validate(gestor) for gestor in gestores]


@router.get("/{gestor_id}", response_model=GestorResponse)
def buscar_gestor_por_id(
    gestor_id: int,
    use_case: Annotated[BuscarGestorPorIdUseCase, Depends(get_buscar_gestor_por_id_use_case)],
) -> GestorResponse:
    gestor = use_case.executar(gestor_id)
    return GestorResponse.model_validate(gestor)

