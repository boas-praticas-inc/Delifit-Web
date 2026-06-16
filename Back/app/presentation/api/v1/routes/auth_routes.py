from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.exceptions import CredenciaisInvalidasError
from app.core.security import verificar_senha
from app.infrastructure.database.repositories.sqlalchemy_usuario_repository import (
    SQLAlchemyUsuarioRepository,
)
from app.presentation.schemas.auth_schema import LoginRequest, LoginResponse
from app.presentation.schemas.usuario_schema import UsuarioResponse
from app.shared.dependencies import get_session

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

    return LoginResponse(usuario=UsuarioResponse.model_validate(usuario))
