from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.application.dto.solicitacao_adesao_restaurante_dto import (
    AnalisarSolicitacaoAdesaoRestauranteDTO,
    CriarSolicitacaoAdesaoRestauranteDTO,
)
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
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import TipoUsuarioEnum
from app.presentation.schemas.solicitacao_adesao_restaurante_schema import (
    AprovarSolicitacaoAdesaoRestauranteRequest,
    RecusarSolicitacaoAdesaoRestauranteRequest,
    SolicitacaoAdesaoRestauranteCreate,
    SolicitacaoAdesaoRestauranteResponse,
)
from app.shared.dependencies import (
    get_analisar_solicitacao_adesao_restaurante_use_case,
    get_buscar_solicitacao_adesao_restaurante_por_id_use_case,
    get_criar_solicitacao_adesao_restaurante_use_case,
    get_listar_solicitacoes_adesao_restaurante_use_case,
    get_solicitar_nova_analise_solicitacao_adesao_restaurante_use_case,
    require_roles,
)

router = APIRouter(
    prefix="/solicitacoes-adesao-restaurante",
    tags=["solicitacoes_adesao_restaurante"],
)


@router.post(
    "",
    response_model=SolicitacaoAdesaoRestauranteResponse,
    status_code=status.HTTP_201_CREATED,
)
def criar_solicitacao(
    payload: SolicitacaoAdesaoRestauranteCreate,
    _gestor: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.GESTOR))],
    use_case: Annotated[
        CriarSolicitacaoAdesaoRestauranteUseCase,
        Depends(get_criar_solicitacao_adesao_restaurante_use_case),
    ],
) -> SolicitacaoAdesaoRestauranteResponse:
    solicitacao = use_case.executar(
        CriarSolicitacaoAdesaoRestauranteDTO(
            gestor_id=payload.gestor_id,
            nome_fantasia=payload.nome_fantasia,
            razao_social=payload.razao_social,
            cnpj=payload.cnpj,
            telefone=payload.telefone,
            cep=payload.cep,
            logradouro=payload.logradouro,
            numero=payload.numero,
            bairro=payload.bairro,
            cidade=payload.cidade,
            estado=payload.estado,
            complemento=payload.complemento,
            referencia=payload.referencia,
            descricao=payload.descricao,
            foto_url=payload.foto_url,
        )
    )
    return SolicitacaoAdesaoRestauranteResponse.model_validate(solicitacao)


@router.get("", response_model=list[SolicitacaoAdesaoRestauranteResponse])
def listar_solicitacoes(
    _equipe: Annotated[
        Usuario,
        Depends(require_roles(TipoUsuarioEnum.GESTOR, TipoUsuarioEnum.ADMIN)),
    ],
    use_case: Annotated[
        ListarSolicitacoesAdesaoRestauranteUseCase,
        Depends(get_listar_solicitacoes_adesao_restaurante_use_case),
    ],
) -> list[SolicitacaoAdesaoRestauranteResponse]:
    solicitacoes = use_case.executar()
    return [SolicitacaoAdesaoRestauranteResponse.model_validate(item) for item in solicitacoes]


@router.get("/{solicitacao_id}", response_model=SolicitacaoAdesaoRestauranteResponse)
def buscar_solicitacao_por_id(
    solicitacao_id: int,
    _equipe: Annotated[
        Usuario,
        Depends(require_roles(TipoUsuarioEnum.GESTOR, TipoUsuarioEnum.ADMIN)),
    ],
    use_case: Annotated[
        BuscarSolicitacaoAdesaoRestaurantePorIdUseCase,
        Depends(get_buscar_solicitacao_adesao_restaurante_por_id_use_case),
    ],
) -> SolicitacaoAdesaoRestauranteResponse:
    solicitacao = use_case.executar(solicitacao_id)
    return SolicitacaoAdesaoRestauranteResponse.model_validate(solicitacao)


@router.patch("/{solicitacao_id}/aprovar", response_model=SolicitacaoAdesaoRestauranteResponse)
def aprovar_solicitacao(
    solicitacao_id: int,
    payload: AprovarSolicitacaoAdesaoRestauranteRequest,
    _admin: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.ADMIN))],
    use_case: Annotated[
        AnalisarSolicitacaoAdesaoRestauranteUseCase,
        Depends(get_analisar_solicitacao_adesao_restaurante_use_case),
    ],
) -> SolicitacaoAdesaoRestauranteResponse:
    solicitacao = use_case.executar(
        solicitacao_id,
        AnalisarSolicitacaoAdesaoRestauranteDTO(
            status_solicitacao="APROVADO",
            analisado_por_admin_id=payload.analisado_por_admin_id,
        ),
    )
    return SolicitacaoAdesaoRestauranteResponse.model_validate(solicitacao)


@router.patch("/{solicitacao_id}/recusar", response_model=SolicitacaoAdesaoRestauranteResponse)
def recusar_solicitacao(
    solicitacao_id: int,
    payload: RecusarSolicitacaoAdesaoRestauranteRequest,
    _admin: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.ADMIN))],
    use_case: Annotated[
        AnalisarSolicitacaoAdesaoRestauranteUseCase,
        Depends(get_analisar_solicitacao_adesao_restaurante_use_case),
    ],
) -> SolicitacaoAdesaoRestauranteResponse:
    solicitacao = use_case.executar(
        solicitacao_id,
        AnalisarSolicitacaoAdesaoRestauranteDTO(
            status_solicitacao="REPROVADO",
            analisado_por_admin_id=payload.analisado_por_admin_id,
            motivo_reprovacao=payload.motivo_reprovacao,
        ),
    )
    return SolicitacaoAdesaoRestauranteResponse.model_validate(solicitacao)


@router.patch(
    "/{solicitacao_id}/solicitar-nova-analise",
    response_model=SolicitacaoAdesaoRestauranteResponse,
)
def solicitar_nova_analise(
    solicitacao_id: int,
    _gestor: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.GESTOR))],
    use_case: Annotated[
        SolicitarNovaAnaliseSolicitacaoAdesaoRestauranteUseCase,
        Depends(get_solicitar_nova_analise_solicitacao_adesao_restaurante_use_case),
    ],
) -> SolicitacaoAdesaoRestauranteResponse:
    solicitacao = use_case.executar(solicitacao_id)
    return SolicitacaoAdesaoRestauranteResponse.model_validate(solicitacao)

