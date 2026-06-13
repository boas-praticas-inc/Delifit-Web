from app.domain.repositories.cliente_repository import ClienteRepository


class ClienteNaoEncontradoError(Exception):
    pass


class ExcluirClienteUseCase:
    def __init__(self, repository: ClienteRepository) -> None:
        self.repository = repository

    def executar(self, cliente_id: int) -> None:
        if not self.repository.excluir(cliente_id):
            raise ClienteNaoEncontradoError
