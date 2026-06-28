from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.application.use_cases.admin.buscar_admin_por_id import BuscarAdminPorIdUseCase
from app.application.use_cases.admin.criar_admin import CriarAdminUseCase
from app.application.use_cases.admin.listar_admins import ListarAdminsUseCase
from app.application.use_cases.endereco.atualizar_meu_endereco import AtualizarMeuEnderecoUseCase
from app.application.use_cases.auth.registrar_cliente import RegistrarClienteUseCase
from app.application.use_cases.cartao.atualizar_meu_cartao import AtualizarMeuCartaoUseCase
from app.application.use_cases.cartao.buscar_meu_cartao_por_id import BuscarMeuCartaoPorIdUseCase
from app.application.use_cases.cartao.criar_meu_cartao import CriarMeuCartaoUseCase
from app.application.use_cases.cartao.excluir_meu_cartao import ExcluirMeuCartaoUseCase
from app.application.use_cases.cartao.listar_meus_cartoes import ListarMeusCartoesUseCase
from app.application.use_cases.categoria_cardapio.criar_categoria_cardapio import (
    CriarCategoriaCardapioUseCase,
)
from app.application.use_cases.categoria_cardapio.excluir_categoria_cardapio import (
    ExcluirCategoriaCardapioUseCase,
)
from app.application.use_cases.categoria_cardapio.listar_categorias_cardapio import (
    ListarCategoriasCardapioUseCase,
)
from app.application.use_cases.cliente.atualizar_cliente import AtualizarClienteUseCase
from app.application.use_cases.cliente.atualizar_meu_perfil_cliente import (
    AtualizarMeuPerfilClienteUseCase,
)
from app.application.use_cases.cliente.buscar_cliente_por_id import BuscarClientePorIdUseCase
from app.application.use_cases.cliente.buscar_meu_perfil_cliente import (
    BuscarMeuPerfilClienteUseCase,
)
from app.application.use_cases.cliente.criar_cliente import CriarClienteUseCase
from app.application.use_cases.cliente.excluir_cliente import ExcluirClienteUseCase
from app.application.use_cases.cliente.listar_clientes import ListarClientesUseCase
from app.application.use_cases.endereco.buscar_endereco_por_id import BuscarEnderecoPorIdUseCase
from app.application.use_cases.endereco.buscar_meu_endereco_por_id import BuscarMeuEnderecoPorIdUseCase
from app.application.use_cases.endereco.criar_endereco import CriarEnderecoUseCase
from app.application.use_cases.endereco.criar_meu_endereco import CriarMeuEnderecoUseCase
from app.application.use_cases.endereco.excluir_meu_endereco import ExcluirMeuEnderecoUseCase
from app.application.use_cases.endereco.listar_enderecos import ListarEnderecosUseCase
from app.application.use_cases.endereco.listar_meus_enderecos import ListarMeusEnderecosUseCase
from app.application.use_cases.gestor.buscar_gestor_por_id import BuscarGestorPorIdUseCase
from app.application.use_cases.gestor.buscar_meu_perfil_gestor import (
    BuscarMeuPerfilGestorUseCase,
)
from app.application.use_cases.gestor.criar_gestor import CriarGestorUseCase
from app.application.use_cases.gestor.listar_gestores import ListarGestoresUseCase
from app.application.use_cases.item_cardapio.atualizar_item_cardapio import (
    AtualizarItemCardapioUseCase,
)
from app.application.use_cases.item_cardapio.buscar_item_cardapio_por_id import (
    BuscarItemCardapioPorIdUseCase,
)
from app.application.use_cases.item_cardapio.criar_item_cardapio import CriarItemCardapioUseCase
from app.application.use_cases.item_cardapio.excluir_item_cardapio import ExcluirItemCardapioUseCase
from app.application.use_cases.item_cardapio.listar_itens_cardapio import ListarItensCardapioUseCase
from app.application.use_cases.restaurante.atualizar_restaurante import AtualizarRestauranteUseCase
from app.application.use_cases.restaurante.buscar_restaurante_por_id import (
    BuscarRestaurantePorIdUseCase,
)
from app.application.use_cases.restaurante.criar_restaurante import CriarRestauranteUseCase
from app.application.use_cases.restaurante.excluir_restaurante import ExcluirRestauranteUseCase
from app.application.use_cases.restaurante.listar_restaurantes import ListarRestaurantesUseCase
from app.application.use_cases.solicitacao_adesao_restaurante.analisar_solicitacao_adesao_restaurante import (  # noqa: E501
    AnalisarSolicitacaoAdesaoRestauranteUseCase,
)
from app.application.use_cases.solicitacao_adesao_restaurante.buscar_solicitacao_adesao_restaurante_por_id import (  # noqa: E501
    BuscarSolicitacaoAdesaoRestaurantePorIdUseCase,
)
from app.application.use_cases.solicitacao_adesao_restaurante.criar_solicitacao_adesao_restaurante import (  # noqa: E501
    CriarSolicitacaoAdesaoRestauranteUseCase,
)
from app.application.use_cases.solicitacao_adesao_restaurante.listar_solicitacoes_adesao_restaurante import (  # noqa: E501
    ListarSolicitacoesAdesaoRestauranteUseCase,
)
from app.application.use_cases.solicitacao_adesao_restaurante.solicitar_nova_analise_solicitacao_adesao_restaurante import (  # noqa: E501
    SolicitarNovaAnaliseSolicitacaoAdesaoRestauranteUseCase,
)
from app.application.use_cases.usuario.buscar_usuario_por_id import BuscarUsuarioPorIdUseCase
from app.application.use_cases.usuario.criar_usuario import CriarUsuarioUseCase
from app.application.use_cases.usuario.listar_usuarios import ListarUsuariosUseCase
from app.core.database import get_db_session
from app.core.security import gerar_hash_senha, validar_access_token
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import TipoUsuarioEnum
from app.infrastructure.database.repositories.sqlalchemy_admin_repository import (
    SQLAlchemyAdminRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_categoria_cardapio_repository import (
    SQLAlchemyCategoriaCardapioRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_cartao_repository import (
    SQLAlchemyCartaoRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_cliente_repository import (
    SQLAlchemyClienteRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_endereco_repository import (
    SQLAlchemyEnderecoRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_gestor_repository import (
    SQLAlchemyGestorRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_item_cardapio_repository import (
    SQLAlchemyItemCardapioRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_restaurante_repository import (
    SQLAlchemyRestauranteRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_solicitacao_adesao_restaurante_repository import (  # noqa: E501
    SQLAlchemySolicitacaoAdesaoRestauranteRepository,
)
from app.infrastructure.database.repositories.sqlalchemy_usuario_repository import (
    SQLAlchemyUsuarioRepository,
)

bearer_scheme = HTTPBearer(auto_error=False)


def get_session() -> Generator[Session, None, None]:
    yield from get_db_session()


def get_usuario_repository(
    session: Session,
) -> SQLAlchemyUsuarioRepository:
    return SQLAlchemyUsuarioRepository(session)


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    session: Annotated[Session, Depends(get_session)],
) -> Usuario:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nao autenticado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = validar_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso invalido.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        usuario_id = int(payload["sub"])
    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de acesso invalido.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from None

    repository = SQLAlchemyUsuarioRepository(session)
    usuario = repository.buscar_por_id(usuario_id)
    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario autenticado nao encontrado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return usuario


def require_roles(*tipos_permitidos: TipoUsuarioEnum):
    def dependency(
        usuario: Annotated[Usuario, Depends(get_current_user)],
    ) -> Usuario:
        if usuario.tipo_usuario not in tipos_permitidos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuario sem permissao para acessar este recurso.",
            )
        return usuario

    return dependency


def get_criar_usuario_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarUsuarioUseCase:
    repository = SQLAlchemyUsuarioRepository(session)
    return CriarUsuarioUseCase(repository=repository, gerar_hash=gerar_hash_senha)


def get_registrar_cliente_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> RegistrarClienteUseCase:
    usuario_repository = SQLAlchemyUsuarioRepository(session)
    cliente_repository = SQLAlchemyClienteRepository(session)
    return RegistrarClienteUseCase(
        usuario_repository=usuario_repository,
        cliente_repository=cliente_repository,
        gerar_hash=gerar_hash_senha,
    )


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


def get_item_cardapio_repository(
    session: Session,
) -> SQLAlchemyItemCardapioRepository:
    return SQLAlchemyItemCardapioRepository(session)


def get_categoria_cardapio_repository(
    session: Session,
) -> SQLAlchemyCategoriaCardapioRepository:
    return SQLAlchemyCategoriaCardapioRepository(session)


def get_criar_item_cardapio_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarItemCardapioUseCase:
    repository = SQLAlchemyItemCardapioRepository(session)
    return CriarItemCardapioUseCase(repository=repository)


def get_listar_itens_cardapio_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ListarItensCardapioUseCase:
    repository = SQLAlchemyItemCardapioRepository(session)
    return ListarItensCardapioUseCase(repository=repository)


def get_buscar_item_cardapio_por_id_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarItemCardapioPorIdUseCase:
    repository = SQLAlchemyItemCardapioRepository(session)
    return BuscarItemCardapioPorIdUseCase(repository=repository)


def get_atualizar_item_cardapio_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> AtualizarItemCardapioUseCase:
    repository = SQLAlchemyItemCardapioRepository(session)
    return AtualizarItemCardapioUseCase(repository=repository)


def get_excluir_item_cardapio_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ExcluirItemCardapioUseCase:
    repository = SQLAlchemyItemCardapioRepository(session)
    return ExcluirItemCardapioUseCase(repository=repository)


def get_criar_categoria_cardapio_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarCategoriaCardapioUseCase:
    repository = SQLAlchemyCategoriaCardapioRepository(session)
    return CriarCategoriaCardapioUseCase(repository=repository)


def get_listar_categorias_cardapio_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ListarCategoriasCardapioUseCase:
    repository = SQLAlchemyCategoriaCardapioRepository(session)
    return ListarCategoriasCardapioUseCase(repository=repository)


def get_excluir_categoria_cardapio_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ExcluirCategoriaCardapioUseCase:
    repository = SQLAlchemyCategoriaCardapioRepository(session)
    return ExcluirCategoriaCardapioUseCase(repository=repository)


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


def get_solicitar_nova_analise_solicitacao_adesao_restaurante_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> SolicitarNovaAnaliseSolicitacaoAdesaoRestauranteUseCase:
    repository = SQLAlchemySolicitacaoAdesaoRestauranteRepository(session)
    return SolicitarNovaAnaliseSolicitacaoAdesaoRestauranteUseCase(repository=repository)


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


def get_criar_meu_endereco_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarMeuEnderecoUseCase:
    repository = SQLAlchemyEnderecoRepository(session)
    cliente_repository = SQLAlchemyClienteRepository(session)
    return CriarMeuEnderecoUseCase(
        repository=repository,
        cliente_repository=cliente_repository,
    )


def get_listar_meus_enderecos_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ListarMeusEnderecosUseCase:
    repository = SQLAlchemyEnderecoRepository(session)
    cliente_repository = SQLAlchemyClienteRepository(session)
    return ListarMeusEnderecosUseCase(
        repository=repository,
        cliente_repository=cliente_repository,
    )


def get_buscar_meu_endereco_por_id_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarMeuEnderecoPorIdUseCase:
    repository = SQLAlchemyEnderecoRepository(session)
    cliente_repository = SQLAlchemyClienteRepository(session)
    return BuscarMeuEnderecoPorIdUseCase(
        repository=repository,
        cliente_repository=cliente_repository,
    )


def get_atualizar_meu_endereco_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> AtualizarMeuEnderecoUseCase:
    repository = SQLAlchemyEnderecoRepository(session)
    cliente_repository = SQLAlchemyClienteRepository(session)
    return AtualizarMeuEnderecoUseCase(
        repository=repository,
        cliente_repository=cliente_repository,
    )


def get_excluir_meu_endereco_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ExcluirMeuEnderecoUseCase:
    repository = SQLAlchemyEnderecoRepository(session)
    cliente_repository = SQLAlchemyClienteRepository(session)
    return ExcluirMeuEnderecoUseCase(
        repository=repository,
        cliente_repository=cliente_repository,
    )


def get_cartao_repository(session: Session) -> SQLAlchemyCartaoRepository:
    return SQLAlchemyCartaoRepository(session)


def get_criar_meu_cartao_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> CriarMeuCartaoUseCase:
    repository = SQLAlchemyCartaoRepository(session)
    cliente_repository = SQLAlchemyClienteRepository(session)
    return CriarMeuCartaoUseCase(
        repository=repository,
        cliente_repository=cliente_repository,
    )


def get_listar_meus_cartoes_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ListarMeusCartoesUseCase:
    repository = SQLAlchemyCartaoRepository(session)
    cliente_repository = SQLAlchemyClienteRepository(session)
    return ListarMeusCartoesUseCase(
        repository=repository,
        cliente_repository=cliente_repository,
    )


def get_buscar_meu_cartao_por_id_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarMeuCartaoPorIdUseCase:
    repository = SQLAlchemyCartaoRepository(session)
    cliente_repository = SQLAlchemyClienteRepository(session)
    return BuscarMeuCartaoPorIdUseCase(
        repository=repository,
        cliente_repository=cliente_repository,
    )


def get_atualizar_meu_cartao_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> AtualizarMeuCartaoUseCase:
    repository = SQLAlchemyCartaoRepository(session)
    cliente_repository = SQLAlchemyClienteRepository(session)
    return AtualizarMeuCartaoUseCase(
        repository=repository,
        cliente_repository=cliente_repository,
    )


def get_excluir_meu_cartao_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> ExcluirMeuCartaoUseCase:
    repository = SQLAlchemyCartaoRepository(session)
    cliente_repository = SQLAlchemyClienteRepository(session)
    return ExcluirMeuCartaoUseCase(
        repository=repository,
        cliente_repository=cliente_repository,
    )


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


def get_buscar_meu_perfil_cliente_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarMeuPerfilClienteUseCase:
    repository = SQLAlchemyClienteRepository(session)
    return BuscarMeuPerfilClienteUseCase(repository=repository)


def get_atualizar_meu_perfil_cliente_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> AtualizarMeuPerfilClienteUseCase:
    repository = SQLAlchemyClienteRepository(session)
    usuario_repository = SQLAlchemyUsuarioRepository(session)
    return AtualizarMeuPerfilClienteUseCase(
        repository=repository,
        usuario_repository=usuario_repository,
    )


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


def get_buscar_meu_perfil_gestor_use_case(
    session: Annotated[Session, Depends(get_session)],
) -> BuscarMeuPerfilGestorUseCase:
    repository = SQLAlchemyGestorRepository(session)
    return BuscarMeuPerfilGestorUseCase(repository=repository)


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
