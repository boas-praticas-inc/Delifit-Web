from app.core.exceptions import AppError
from app.domain.entities.cliente import Cliente
from app.domain.repositories.cliente_repository import ClienteRepository


class ClienteNaoEncontradoError(AppError):
    status_code = 404
    detail = "Cliente nao encontrado."


class BuscarClientePorIdUseCase:
    def __init__(self, repository: ClienteRepository) -> None:
        self.repository = repository

    def executar(self, cliente_id: int) -> Cliente:
        cliente = self.repository.buscar_por_id(cliente_id)
        if cliente is None:
            raise ClienteNaoEncontradoError()
        return cliente

