from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.usuario.buscar_usuario_por_id import BuscarUsuarioPorIdUseCase
from app.application.use_cases.usuario.criar_usuario import CriarUsuarioUseCase
from app.application.use_cases.usuario.listar_usuarios import ListarUsuariosUseCase
from app.core.database import get_db_session
from app.core.security import gerar_hash_senha
from app.infrastructure.database.repositories.sqlalchemy_usuario_repository import (
    SQLAlchemyUsuarioRepository,
)


def get_session() -> Generator[Session, None, None]:
    yield from get_db_session()


def get_usuario_repository(
    session: Session,
) -> SQLAlchemyUsuarioRepository:
    return SQLAlchemyUsuarioRepository(session)


def get_criar_usuario_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarUsuarioUseCase:
    repository = SQLAlchemyUsuarioRepository(session)
    return CriarUsuarioUseCase(repository=repository, gerar_hash=gerar_hash_senha)


def get_listar_usuarios_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ListarUsuariosUseCase:
    repository = SQLAlchemyUsuarioRepository(session)
    return ListarUsuariosUseCase(repository=repository)


def get_buscar_usuario_por_id_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarUsuarioPorIdUseCase:
    repository = SQLAlchemyUsuarioRepository(session)
    return BuscarUsuarioPorIdUseCase(repository=repository)
