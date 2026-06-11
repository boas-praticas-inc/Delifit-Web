from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.usuario.buscar_usuario_por_id import BuscarUsuarioPorIdUseCase
from app.application.use_cases.usuario.criar_usuario import CriarUsuarioUseCase
from app.application.use_cases.usuario.listar_usuarios import ListarUsuariosUseCase
from app.application.use_cases.restaurante.atualizar_restaurante import AtualizarRestauranteUseCase
from app.application.use_cases.restaurante.buscar_restaurante_por_id import BuscarRestaurantePorIdUseCase
from app.application.use_cases.restaurante.criar_restaurante import CriarRestauranteUseCase
from app.application.use_cases.restaurante.excluir_restaurante import ExcluirRestauranteUseCase
from app.application.use_cases.restaurante.listar_restaurantes import ListarRestaurantesUseCase
from app.core.database import get_db_session
from app.core.security import gerar_hash_senha
from app.infrastructure.database.repositories.sqlalchemy_restaurante_repository import (
    SQLAlchemyRestauranteRepository,
)
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


def get_restaurante_repository(
    session: Session,
) -> SQLAlchemyRestauranteRepository:
    return SQLAlchemyRestauranteRepository(session)


def get_criar_restaurante_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarRestauranteUseCase:
    repository = SQLAlchemyRestauranteRepository(session)
    return CriarRestauranteUseCase(repository=repository)


def get_listar_restaurantes_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ListarRestaurantesUseCase:
    repository = SQLAlchemyRestauranteRepository(session)
    return ListarRestaurantesUseCase(repository=repository)


def get_buscar_restaurante_por_id_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarRestaurantePorIdUseCase:
    repository = SQLAlchemyRestauranteRepository(session)
    return BuscarRestaurantePorIdUseCase(repository=repository)


def get_atualizar_restaurante_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> AtualizarRestauranteUseCase:
    repository = SQLAlchemyRestauranteRepository(session)
    return AtualizarRestauranteUseCase(repository=repository)


def get_excluir_restaurante_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ExcluirRestauranteUseCase:
    repository = SQLAlchemyRestauranteRepository(session)
    return ExcluirRestauranteUseCase(repository=repository)
