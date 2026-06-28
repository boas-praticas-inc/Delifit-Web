from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dto.endereco_dto import AtualizarEnderecoDTO
from app.application.dto.endereco_dto import CriarEnderecoDTO
from app.application.use_cases.endereco.atualizar_meu_endereco import AtualizarMeuEnderecoUseCase
from app.application.use_cases.endereco.buscar_endereco_por_id import BuscarEnderecoPorIdUseCase
from app.application.use_cases.endereco.buscar_meu_endereco_por_id import BuscarMeuEnderecoPorIdUseCase
from app.application.use_cases.endereco.criar_endereco import CriarEnderecoUseCase
from app.application.use_cases.endereco.criar_meu_endereco import CriarMeuEnderecoUseCase
from app.application.use_cases.endereco.excluir_meu_endereco import ExcluirMeuEnderecoUseCase
from app.application.use_cases.endereco.listar_enderecos import ListarEnderecosUseCase
from app.application.use_cases.endereco.listar_meus_enderecos import ListarMeusEnderecosUseCase
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import TipoUsuarioEnum
from app.presentation.schemas.endereco_schema import (
    EnderecoCreate,
    EnderecoResponse,
    MeuEnderecoCreate,
    MeuEnderecoUpdate,
)
from app.shared.dependencies import (
    get_atualizar_meu_endereco_use_case,
    get_buscar_endereco_por_id_use_case,
    get_buscar_meu_endereco_por_id_use_case,
    get_criar_endereco_use_case,
    get_criar_meu_endereco_use_case,
    get_current_user,
    get_excluir_meu_endereco_use_case,
    get_listar_enderecos_use_case,
    get_listar_meus_enderecos_use_case,
    require_roles,
)

router = APIRouter(tags=["enderecos"])
admin_router = APIRouter(prefix="/enderecos")
cliente_router = APIRouter(prefix="/clientes/me/enderecos")


@admin_router.post("", response_model=EnderecoResponse, status_code=status.HTTP_201_CREATED)
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


@admin_router.get("", response_model=list[EnderecoResponse])
def listar_enderecos(
    _admin: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.ADMIN))],
    use_case: Annotated[ListarEnderecosUseCase, Depends(get_listar_enderecos_use_case)],
) -> list[EnderecoResponse]:
    enderecos = use_case.executar()
    return [EnderecoResponse.model_validate(endereco) for endereco in enderecos]


@admin_router.get("/{endereco_id}", response_model=EnderecoResponse)
def buscar_endereco_por_id(
    endereco_id: int,
    _admin: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.ADMIN))],
    use_case: Annotated[BuscarEnderecoPorIdUseCase, Depends(get_buscar_endereco_por_id_use_case)],
) -> EnderecoResponse:
    endereco = use_case.executar(endereco_id)
    return EnderecoResponse.model_validate(endereco)


@cliente_router.post("", response_model=EnderecoResponse, status_code=status.HTTP_201_CREATED)
def criar_meu_endereco(
    payload: MeuEnderecoCreate,
    usuario: Annotated[Usuario, Depends(get_current_user)],
    _cliente: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.CLIENTE))],
    use_case: Annotated[CriarMeuEnderecoUseCase, Depends(get_criar_meu_endereco_use_case)],
) -> EnderecoResponse:
    if usuario.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nao autenticado.")

    endereco = use_case.executar(
        usuario.id,
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
        ),
    )
    return EnderecoResponse.model_validate(endereco)


@cliente_router.get("", response_model=list[EnderecoResponse])
def listar_meus_enderecos(
    usuario: Annotated[Usuario, Depends(get_current_user)],
    _cliente: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.CLIENTE))],
    use_case: Annotated[ListarMeusEnderecosUseCase, Depends(get_listar_meus_enderecos_use_case)],
) -> list[EnderecoResponse]:
    if usuario.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nao autenticado.")

    enderecos = use_case.executar(usuario.id)
    return [EnderecoResponse.model_validate(endereco) for endereco in enderecos]


@cliente_router.get("/{endereco_id}", response_model=EnderecoResponse)
def buscar_meu_endereco_por_id(
    endereco_id: int,
    usuario: Annotated[Usuario, Depends(get_current_user)],
    _cliente: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.CLIENTE))],
    use_case: Annotated[
        BuscarMeuEnderecoPorIdUseCase,
        Depends(get_buscar_meu_endereco_por_id_use_case),
    ],
) -> EnderecoResponse:
    if usuario.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nao autenticado.")

    endereco = use_case.executar(usuario.id, endereco_id)
    return EnderecoResponse.model_validate(endereco)


@cliente_router.put("/{endereco_id}", response_model=EnderecoResponse)
def atualizar_meu_endereco(
    endereco_id: int,
    payload: MeuEnderecoUpdate,
    usuario: Annotated[Usuario, Depends(get_current_user)],
    _cliente: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.CLIENTE))],
    use_case: Annotated[
        AtualizarMeuEnderecoUseCase,
        Depends(get_atualizar_meu_endereco_use_case),
    ],
) -> EnderecoResponse:
    if usuario.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nao autenticado.")

    endereco = use_case.executar(
        usuario.id,
        endereco_id,
        AtualizarEnderecoDTO(
            cep=payload.cep,
            logradouro=payload.logradouro,
            numero=payload.numero,
            bairro=payload.bairro,
            cidade=payload.cidade,
            estado=payload.estado,
            complemento=payload.complemento,
            referencia=payload.referencia,
            label=payload.label,
        ),
    )
    return EnderecoResponse.model_validate(endereco)


@cliente_router.delete("/{endereco_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_meu_endereco(
    endereco_id: int,
    usuario: Annotated[Usuario, Depends(get_current_user)],
    _cliente: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.CLIENTE))],
    use_case: Annotated[
        ExcluirMeuEnderecoUseCase,
        Depends(get_excluir_meu_endereco_use_case),
    ],
) -> None:
    if usuario.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nao autenticado.")

    use_case.executar(usuario.id, endereco_id)


router.include_router(admin_router)
router.include_router(cliente_router)

