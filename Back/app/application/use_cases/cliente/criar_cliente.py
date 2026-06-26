from app.application.dto.cliente_dto import CriarClienteDTO
from app.domain.entities.cliente import Cliente
from app.domain.repositories.cliente_repository import ClienteRepository


class CriarClienteUseCase:
    def __init__(self, repository: ClienteRepository) -> None:
        self.repository = repository

    def executar(self, dto: CriarClienteDTO) -> Cliente:
        cliente = Cliente(
            id=None,
            usuario_id=dto.usuario_id,
            nome_completo=dto.nome_completo,
            cpf=dto.cpf,
            data_nascimento=dto.data_nascimento,
        )
        return self.repository.criar(cliente)

