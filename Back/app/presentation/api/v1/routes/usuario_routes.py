from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.application.dto.usuario_dto import CriarUsuarioDTO
from app.application.use_cases.usuario.buscar_usuario_por_id import BuscarUsuarioPorIdUseCase
from app.application.use_cases.usuario.criar_usuario import CriarUsuarioUseCase
from app.application.use_cases.usuario.listar_usuarios import ListarUsuariosUseCase
from app.presentation.schemas.usuario_schema import UsuarioCreate, UsuarioResponse
from app.shared.dependencies import (
    get_buscar_usuario_por_id_use_case,
    get_criar_usuario_use_case,
    get_listar_usuarios_use_case,
)

router = APIRouter(prefix="/usuarios", tags=["usuarios"])


@router.post("", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def criar_usuario(
    payload: UsuarioCreate,
    use_case: Annotated[CriarUsuarioUseCase, Depends(get_criar_usuario_use_case)],
) -> UsuarioResponse:
    usuario = use_case.executar(
        CriarUsuarioDTO(
            email=payload.email,
            senha=payload.senha,
            tipo_usuario=payload.tipo_usuario,
        )
    )
    return UsuarioResponse.model_validate(usuario)


@router.get("", response_model=list[UsuarioResponse])
def listar_usuarios(
    use_case: Annotated[ListarUsuariosUseCase, Depends(get_listar_usuarios_use_case)],
) -> list[UsuarioResponse]:
    usuarios = use_case.executar()
    return [UsuarioResponse.model_validate(usuario) for usuario in usuarios]


@router.get("/{usuario_id}", response_model=UsuarioResponse)
def buscar_usuario_por_id(
    usuario_id: int,
    use_case: Annotated[BuscarUsuarioPorIdUseCase, Depends(get_buscar_usuario_por_id_use_case)],
) -> UsuarioResponse:
    usuario = use_case.executar(usuario_id)
    return UsuarioResponse.model_validate(usuario)
