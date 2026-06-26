from app.application.use_cases.cliente.buscar_cliente_por_id import ClienteNaoEncontradoError
from app.domain.entities.cliente import Cliente
from app.domain.repositories.cliente_repository import ClienteRepository


class BuscarMeuPerfilClienteUseCase:
    def __init__(self, repository: ClienteRepository) -> None:
        self.repository = repository

    def executar(self, usuario_id: int) -> Cliente:
        cliente = self.repository.buscar_por_usuario_id(usuario_id)
        if cliente is None:
            raise ClienteNaoEncontradoError()
        return cliente
