from app.domain.entities.cliente import Cliente
from app.domain.repositories.cliente_repository import ClienteRepository


class ListarClientesUseCase:
    def __init__(self, repository: ClienteRepository) -> None:
        self.repository = repository

    def executar(self) -> list[Cliente]:
        return self.repository.listar()

