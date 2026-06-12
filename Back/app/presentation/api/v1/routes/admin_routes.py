from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.application.dto.admin_dto import CriarAdminDTO
from app.application.use_cases.admin.buscar_admin_por_id import BuscarAdminPorIdUseCase
from app.application.use_cases.admin.criar_admin import CriarAdminUseCase
from app.application.use_cases.admin.listar_admins import ListarAdminsUseCase
from app.presentation.schemas.admin_schema import AdminCreate, AdminResponse
from app.shared.dependencies import (
    get_buscar_admin_por_id_use_case,
    get_criar_admin_use_case,
    get_listar_admins_use_case,
)

router = APIRouter(prefix="/admins", tags=["admins"])


@router.post("", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
def criar_admin(
    payload: AdminCreate,
    use_case: Annotated[CriarAdminUseCase, Depends(get_criar_admin_use_case)],
) -> AdminResponse:
    admin = use_case.executar(
        CriarAdminDTO(
            usuario_id=payload.usuario_id,
            nome_completo=payload.nome_completo,
            cargo=payload.cargo,
        )
    )
    return AdminResponse.model_validate(admin)


@router.get("", response_model=list[AdminResponse])
def listar_admins(
    use_case: Annotated[ListarAdminsUseCase, Depends(get_listar_admins_use_case)],
) -> list[AdminResponse]:
    admins = use_case.executar()
    return [AdminResponse.model_validate(admin) for admin in admins]


@router.get("/{admin_id}", response_model=AdminResponse)
def buscar_admin_por_id(
    admin_id: int,
    use_case: Annotated[BuscarAdminPorIdUseCase, Depends(get_buscar_admin_por_id_use_case)],
) -> AdminResponse:
    admin = use_case.executar(admin_id)
    return AdminResponse.model_validate(admin)

