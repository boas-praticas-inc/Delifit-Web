from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.application.dto.endereco_dto import CriarEnderecoDTO
from app.application.use_cases.endereco.buscar_endereco_por_id import BuscarEnderecoPorIdUseCase
from app.application.use_cases.endereco.criar_endereco import CriarEnderecoUseCase
from app.application.use_cases.endereco.listar_enderecos import ListarEnderecosUseCase
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import TipoUsuarioEnum
from app.presentation.schemas.endereco_schema import EnderecoCreate, EnderecoResponse
from app.shared.dependencies import (
    get_buscar_endereco_por_id_use_case,
    get_criar_endereco_use_case,
    get_listar_enderecos_use_case,
    require_roles,
)

router = APIRouter(prefix="/enderecos", tags=["enderecos"])


@router.post("", response_model=EnderecoResponse, status_code=status.HTTP_201_CREATED)
def criar_endereco(
    payload: EnderecoCreate,
    _admin: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.ADMIN))],
    use_case: Annotated[CriarEnderecoUseCase, Depends(get_criar_endereco_use_case)],
) -> EnderecoResponse:
    endereco = use_case.executar(
        CriarEnderecoDTO(
            cep=payload.cep,
            logradouro=payload.logradouro,
            numero=payload.numero,
            bairro=payload.bairro,
            cidade=payload.cidade,
            estado=payload.estado,
            complemento=payload.complemento,
            referencia=payload.referencia,
            label=payload.label,
            cliente_id=payload.cliente_id,
        )
    )
    return EnderecoResponse.model_validate(endereco)


@router.get("", response_model=list[EnderecoResponse])
def listar_enderecos(
    _admin: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.ADMIN))],
    use_case: Annotated[ListarEnderecosUseCase, Depends(get_listar_enderecos_use_case)],
) -> list[EnderecoResponse]:
    enderecos = use_case.executar()
    return [EnderecoResponse.model_validate(endereco) for endereco in enderecos]


@router.get("/{endereco_id}", response_model=EnderecoResponse)
def buscar_endereco_por_id(
    endereco_id: int,
    _admin: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.ADMIN))],
    use_case: Annotated[BuscarEnderecoPorIdUseCase, Depends(get_buscar_endereco_por_id_use_case)],
) -> EnderecoResponse:
    endereco = use_case.executar(endereco_id)
    return EnderecoResponse.model_validate(endereco)

