from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.exceptions import CredenciaisInvalidasError
from app.core.security import gerar_access_token, verificar_senha
from app.domain.entities.usuario import Usuario
from app.infrastructure.database.repositories.sqlalchemy_usuario_repository import (
    SQLAlchemyUsuarioRepository,
)
from app.presentation.schemas.auth_schema import LoginRequest, LoginResponse
from app.presentation.schemas.usuario_schema import UsuarioResponse
from app.shared.dependencies import get_current_user, get_session

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginRequest,
    session: Annotated[Session, Depends(get_session)],
) -> LoginResponse:
    repository = SQLAlchemyUsuarioRepository(session)
    usuario = repository.buscar_por_email(payload.email)

    if usuario is None or not verificar_senha(payload.senha, usuario.senha_hash):
        raise CredenciaisInvalidasError()
    if usuario.id is None:
        raise CredenciaisInvalidasError()

    return LoginResponse(
        access_token=gerar_access_token(usuario.id),
        usuario=UsuarioResponse.model_validate(usuario),
    )


@router.get("/me", response_model=UsuarioResponse)
def obter_usuario_autenticado(
    usuario: Annotated[Usuario, Depends(get_current_user)],
) -> UsuarioResponse:
    return UsuarioResponse.model_validate(usuario)
