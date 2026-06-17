from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.application.use_cases.usuario.buscar_usuario_por_id import BuscarUsuarioPorIdUseCase
from app.application.use_cases.usuario.criar_usuario import CriarUsuarioUseCase
from app.application.use_cases.usuario.listar_usuarios import ListarUsuariosUseCase
from app.application.use_cases.cliente.atualizar_cliente import AtualizarClienteUseCase
from app.application.use_cases.cliente.buscar_cliente_por_id import BuscarClientePorIdUseCase
from app.application.use_cases.cliente.criar_cliente import CriarClienteUseCase
from app.application.use_cases.cliente.excluir_cliente import ExcluirClienteUseCase
from app.application.use_cases.cliente.listar_clientes import ListarClientesUseCase
from app.application.use_cases.admin.buscar_admin_por_id import BuscarAdminPorIdUseCase
from app.application.use_cases.admin.criar_admin import CriarAdminUseCase
from app.application.use_cases.admin.listar_admins import ListarAdminsUseCase
from app.application.use_cases.gestor.buscar_gestor_por_id import BuscarGestorPorIdUseCase
from app.application.use_cases.gestor.criar_gestor import CriarGestorUseCase
from app.application.use_cases.gestor.listar_gestores import ListarGestoresUseCase
from app.application.use_cases.solicitacao_adesao_restaurante.buscar_solicitacao_adesao_restaurante_por_id import (
    BuscarSolicitacaoAdesaoRestaurantePorIdUseCase,
)
from app.application.use_cases.solicitacao_adesao_restaurante.analisar_solicitacao_adesao_restaurante import (
    AnalisarSolicitacaoAdesaoRestauranteUseCase,
)
from app.application.use_cases.solicitacao_adesao_restaurante.criar_solicitacao_adesao_restaurante import (
    CriarSolicitacaoAdesaoRestauranteUseCase,
)
from app.application.use_cases.solicitacao_adesao_restaurante.listar_solicitacoes_adesao_restaurante import (
    ListarSolicitacoesAdesaoRestauranteUseCase,
)
from app.application.use_cases.endereco.buscar_endereco_por_id import BuscarEnderecoPorIdUseCase
from app.application.use_cases.endereco.criar_endereco import CriarEnderecoUseCase
from app.application.use_cases.endereco.listar_enderecos import ListarEnderecosUseCase
from app.application.use_cases.restaurante.atualizar_restaurante import AtualizarRestauranteUseCase
from app.application.use_cases.restaurante.buscar_restaurante_por_id import BuscarRestaurantePorIdUseCase
from app.application.use_cases.restaurante.criar_restaurante import CriarRestauranteUseCase
from app.application.use_cases.restaurante.excluir_restaurante import ExcluirRestauranteUseCase
from app.application.use_cases.restaurante.listar_restaurantes import ListarRestaurantesUseCase
from app.core.database import get_db_session
from app.core.security import gerar_hash_senha
from app.infrastructure.database.repositories.sqlalchemy_solicitacao_adesao_restaurante_repository import (
    SQLAlchemySolicitacaoAdesaoRestauranteRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_cliente_repository import (
    SQLAlchemyClienteRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_admin_repository import (
    SQLAlchemyAdminRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_gestor_repository import (
    SQLAlchemyGestorRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_endereco_repository import (
    SQLAlchemyEnderecoRepository,
)
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


def get_solicitacao_adesao_restaurante_repository(
    session: Session,
) -> SQLAlchemySolicitacaoAdesaoRestauranteRepository:
    return SQLAlchemySolicitacaoAdesaoRestauranteRepository(session)


def get_criar_solicitacao_adesao_restaurante_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarSolicitacaoAdesaoRestauranteUseCase:
    repository = SQLAlchemySolicitacaoAdesaoRestauranteRepository(session)
    return CriarSolicitacaoAdesaoRestauranteUseCase(repository=repository)


def get_listar_solicitacoes_adesao_restaurante_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ListarSolicitacoesAdesaoRestauranteUseCase:
    repository = SQLAlchemySolicitacaoAdesaoRestauranteRepository(session)
    return ListarSolicitacoesAdesaoRestauranteUseCase(repository=repository)


def get_buscar_solicitacao_adesao_restaurante_por_id_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarSolicitacaoAdesaoRestaurantePorIdUseCase:
    repository = SQLAlchemySolicitacaoAdesaoRestauranteRepository(session)
    return BuscarSolicitacaoAdesaoRestaurantePorIdUseCase(repository=repository)


def get_analisar_solicitacao_adesao_restaurante_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> AnalisarSolicitacaoAdesaoRestauranteUseCase:
    repository = SQLAlchemySolicitacaoAdesaoRestauranteRepository(session)
    endereco_repository = SQLAlchemyEnderecoRepository(session)
    restaurante_repository = SQLAlchemyRestauranteRepository(session)
    return AnalisarSolicitacaoAdesaoRestauranteUseCase(
        repository=repository,
        endereco_repository=endereco_repository,
        restaurante_repository=restaurante_repository,
    )


def get_endereco_repository(session: Session) -> SQLAlchemyEnderecoRepository:
    return SQLAlchemyEnderecoRepository(session)


def get_criar_endereco_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarEnderecoUseCase:
    repository = SQLAlchemyEnderecoRepository(session)
    return CriarEnderecoUseCase(repository=repository)


def get_listar_enderecos_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ListarEnderecosUseCase:
    repository = SQLAlchemyEnderecoRepository(session)
    return ListarEnderecosUseCase(repository=repository)


def get_buscar_endereco_por_id_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarEnderecoPorIdUseCase:
    repository = SQLAlchemyEnderecoRepository(session)
    return BuscarEnderecoPorIdUseCase(repository=repository)


def get_cliente_repository(session: Session) -> SQLAlchemyClienteRepository:
    return SQLAlchemyClienteRepository(session)


def get_criar_cliente_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarClienteUseCase:
    repository = SQLAlchemyClienteRepository(session)
    return CriarClienteUseCase(repository=repository)


def get_listar_clientes_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ListarClientesUseCase:
    repository = SQLAlchemyClienteRepository(session)
    return ListarClientesUseCase(repository=repository)


def get_buscar_cliente_por_id_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarClientePorIdUseCase:
    repository = SQLAlchemyClienteRepository(session)
    return BuscarClientePorIdUseCase(repository=repository)


def get_atualizar_cliente_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> AtualizarClienteUseCase:
    repository = SQLAlchemyClienteRepository(session)
    return AtualizarClienteUseCase(repository=repository)


def get_excluir_cliente_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ExcluirClienteUseCase:
    repository = SQLAlchemyClienteRepository(session)
    return ExcluirClienteUseCase(repository=repository)


def get_gestor_repository(session: Session) -> SQLAlchemyGestorRepository:
    return SQLAlchemyGestorRepository(session)


def get_criar_gestor_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarGestorUseCase:
    repository = SQLAlchemyGestorRepository(session)
    return CriarGestorUseCase(repository=repository)


def get_listar_gestores_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ListarGestoresUseCase:
    repository = SQLAlchemyGestorRepository(session)
    return ListarGestoresUseCase(repository=repository)


def get_buscar_gestor_por_id_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarGestorPorIdUseCase:
    repository = SQLAlchemyGestorRepository(session)
    return BuscarGestorPorIdUseCase(repository=repository)


def get_admin_repository(session: Session) -> SQLAlchemyAdminRepository:
    return SQLAlchemyAdminRepository(session)


def get_criar_admin_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarAdminUseCase:
    repository = SQLAlchemyAdminRepository(session)
    return CriarAdminUseCase(repository=repository)


def get_listar_admins_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ListarAdminsUseCase:
    repository = SQLAlchemyAdminRepository(session)
    return ListarAdminsUseCase(repository=repository)


def get_buscar_admin_por_id_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarAdminPorIdUseCase:
    repository = SQLAlchemyAdminRepository(session)
    return BuscarAdminPorIdUseCase(repository=repository)
