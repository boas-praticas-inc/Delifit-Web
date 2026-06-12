from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.application.dto.cliente_dto import CriarClienteDTO
from app.application.use_cases.cliente.buscar_cliente_por_id import BuscarClientePorIdUseCase
from app.application.use_cases.cliente.criar_cliente import CriarClienteUseCase
from app.application.use_cases.cliente.listar_clientes import ListarClientesUseCase
from app.presentation.schemas.cliente_schema import ClienteCreate, ClienteResponse
from app.shared.dependencies import (
    get_buscar_cliente_por_id_use_case,
    get_criar_cliente_use_case,
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

