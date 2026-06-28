from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dto.cartao_dto import AtualizarCartaoDTO, CriarCartaoDTO
from app.application.use_cases.cartao.atualizar_meu_cartao import AtualizarMeuCartaoUseCase
from app.application.use_cases.cartao.buscar_meu_cartao_por_id import BuscarMeuCartaoPorIdUseCase
from app.application.use_cases.cartao.criar_meu_cartao import CriarMeuCartaoUseCase
from app.application.use_cases.cartao.excluir_meu_cartao import ExcluirMeuCartaoUseCase
from app.application.use_cases.cartao.listar_meus_cartoes import ListarMeusCartoesUseCase
from app.domain.entities.usuario import Usuario
from app.domain.enums.usuario_enums import TipoUsuarioEnum
from app.presentation.schemas.cartao_schema import (
    CartaoResponse,
    MeuCartaoCreate,
    MeuCartaoUpdate,
)
from app.shared.dependencies import (
    get_atualizar_meu_cartao_use_case,
    get_buscar_meu_cartao_por_id_use_case,
    get_criar_meu_cartao_use_case,
    get_current_user,
    get_excluir_meu_cartao_use_case,
    get_listar_meus_cartoes_use_case,
    require_roles,
)

router = APIRouter(prefix="/clientes/me/cartoes", tags=["cartoes"])


@router.post("", response_model=CartaoResponse, status_code=status.HTTP_201_CREATED)
def criar_meu_cartao(
    payload: MeuCartaoCreate,
    usuario: Annotated[Usuario, Depends(get_current_user)],
    _cliente: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.CLIENTE))],
    use_case: Annotated[CriarMeuCartaoUseCase, Depends(get_criar_meu_cartao_use_case)],
) -> CartaoResponse:
    if usuario.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nao autenticado.")

    cartao = use_case.executar(
        usuario.id,
        CriarCartaoDTO(
            nome_titular=payload.nome_titular,
            ultimos_quatro_digitos=payload.ultimos_quatro_digitos,
            bandeira=payload.bandeira,
            token_gateway=payload.token_gateway,
            padrao=payload.padrao,
        ),
    )
    return CartaoResponse.model_validate(cartao)


@router.get("", response_model=list[CartaoResponse])
def listar_meus_cartoes(
    usuario: Annotated[Usuario, Depends(get_current_user)],
    _cliente: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.CLIENTE))],
    use_case: Annotated[ListarMeusCartoesUseCase, Depends(get_listar_meus_cartoes_use_case)],
) -> list[CartaoResponse]:
    if usuario.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nao autenticado.")

    cartoes = use_case.executar(usuario.id)
    return [CartaoResponse.model_validate(cartao) for cartao in cartoes]


@router.get("/{cartao_id}", response_model=CartaoResponse)
def buscar_meu_cartao_por_id(
    cartao_id: int,
    usuario: Annotated[Usuario, Depends(get_current_user)],
    _cliente: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.CLIENTE))],
    use_case: Annotated[
        BuscarMeuCartaoPorIdUseCase,
        Depends(get_buscar_meu_cartao_por_id_use_case),
    ],
) -> CartaoResponse:
    if usuario.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nao autenticado.")

    cartao = use_case.executar(usuario.id, cartao_id)
    return CartaoResponse.model_validate(cartao)


@router.put("/{cartao_id}", response_model=CartaoResponse)
def atualizar_meu_cartao(
    cartao_id: int,
    payload: MeuCartaoUpdate,
    usuario: Annotated[Usuario, Depends(get_current_user)],
    _cliente: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.CLIENTE))],
    use_case: Annotated[
        AtualizarMeuCartaoUseCase,
        Depends(get_atualizar_meu_cartao_use_case),
    ],
) -> CartaoResponse:
    if usuario.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nao autenticado.")

    cartao = use_case.executar(
        usuario.id,
        cartao_id,
        AtualizarCartaoDTO(
            nome_titular=payload.nome_titular,
            ultimos_quatro_digitos=payload.ultimos_quatro_digitos,
            bandeira=payload.bandeira,
            token_gateway=payload.token_gateway,
            padrao=payload.padrao,
        ),
    )
    return CartaoResponse.model_validate(cartao)


@router.delete("/{cartao_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_meu_cartao(
    cartao_id: int,
    usuario: Annotated[Usuario, Depends(get_current_user)],
    _cliente: Annotated[Usuario, Depends(require_roles(TipoUsuarioEnum.CLIENTE))],
    use_case: Annotated[
        ExcluirMeuCartaoUseCase,
        Depends(get_excluir_meu_cartao_use_case),
    ],
) -> None:
    if usuario.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Nao autenticado.")

    use_case.executar(usuario.id, cartao_id)
