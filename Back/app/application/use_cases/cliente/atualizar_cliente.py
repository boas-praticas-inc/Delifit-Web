from app.application.dto.cliente_dto import AtualizarClienteDTO
from app.domain.entities.cliente import Cliente
from app.domain.repositories.cliente_repository import ClienteRepository


class ClienteNaoEncontradoError(Exception):
    pass


class AtualizarClienteUseCase:
    def __init__(self, repository: ClienteRepository) -> None:
        self.repository = repository

    def executar(self, cliente_id: int, dto: AtualizarClienteDTO) -> Cliente:
        cliente = Cliente(
            id=cliente_id,
            usuario_id=dto.usuario_id,
            nome_completo=dto.nome_completo,
            cpf=dto.cpf,
            data_nascimento=dto.data_nascimento,
        )
        cliente_atualizado = self.repository.atualizar(cliente_id, cliente)
        if cliente_atualizado is None:
            raise ClienteNaoEncontradoError
        return cliente_atualizado
