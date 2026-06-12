from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.application.dto.cliente_dto import AtualizarClienteDTO, CriarClienteDTO
from app.application.use_cases.cliente.atualizar_cliente import AtualizarClienteUseCase
from app.application.use_cases.cliente.buscar_cliente_por_id import BuscarClientePorIdUseCase
from app.application.use_cases.cliente.criar_cliente import CriarClienteUseCase
from app.application.use_cases.cliente.excluir_cliente import ExcluirClienteUseCase
from app.application.use_cases.cliente.listar_clientes import ListarClientesUseCase
from app.presentation.schemas.cliente_schema import ClienteCreate, ClienteResponse, ClienteUpdate
from app.shared.dependencies import (
    get_atualizar_cliente_use_case,
    get_buscar_cliente_por_id_use_case,
    get_criar_cliente_use_case,
    get_excluir_cliente_use_case,
    get_listar_clientes_use_case,
)

router = APIRouter(prefix="/clientes", tags=["clientes"])


@router.post("", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
def criar_cliente(
    payload: ClienteCreate,
    use_case: Annotated[CriarClienteUseCase, Depends(get_criar_cliente_use_case)],
) -> ClienteResponse:
    cliente = use_case.executar(
        CriarClienteDTO(
            usuario_id=payload.usuario_id,
            nome_completo=payload.nome_completo,
            cpf=payload.cpf,
            telefone=payload.telefone,
            data_nascimento=payload.data_nascimento,
        )
    )
    return ClienteResponse.model_validate(cliente)


@router.get("", response_model=list[ClienteResponse])
def listar_clientes(
    use_case: Annotated[ListarClientesUseCase, Depends(get_listar_clientes_use_case)],
) -> list[ClienteResponse]:
    clientes = use_case.executar()
    return [ClienteResponse.model_validate(cliente) for cliente in clientes]


@router.get("/{cliente_id}", response_model=ClienteResponse)
def buscar_cliente_por_id(
    cliente_id: int,
    use_case: Annotated[BuscarClientePorIdUseCase, Depends(get_buscar_cliente_por_id_use_case)],
) -> ClienteResponse:
    cliente = use_case.executar(cliente_id)
    return ClienteResponse.model_validate(cliente)


@router.put("/{cliente_id}", response_model=ClienteResponse)
def atualizar_cliente(
    cliente_id: int,
    payload: ClienteUpdate,
    use_case: Annotated[AtualizarClienteUseCase, Depends(get_atualizar_cliente_use_case)],
) -> ClienteResponse:
    cliente = use_case.executar(
        cliente_id,
        AtualizarClienteDTO(
            usuario_id=payload.usuario_id,
            nome_completo=payload.nome_completo,
            cpf=payload.cpf,
            telefone=payload.telefone,
            data_nascimento=payload.data_nascimento,
        ),
    )
    return ClienteResponse.model_validate(cliente)


@router.delete("/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_cliente(
    cliente_id: int,
    use_case: Annotated[ExcluirClienteUseCase, Depends(get_excluir_cliente_use_case)],
) -> None:
    use_case.executar(cliente_id)

