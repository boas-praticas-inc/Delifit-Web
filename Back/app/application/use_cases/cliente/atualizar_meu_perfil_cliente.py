from app.application.dto.cliente_dto import AtualizarMeuPerfilClienteDTO
from app.application.use_cases.cliente.buscar_cliente_por_id import ClienteNaoEncontradoError
from app.domain.entities.cliente import Cliente
from app.domain.repositories.cliente_repository import ClienteRepository


class AtualizarMeuPerfilClienteUseCase:
    def __init__(self, repository: ClienteRepository) -> None:
        self.repository = repository

    def executar(self, usuario_id: int, dto: AtualizarMeuPerfilClienteDTO) -> Cliente:
        cliente_atual = self.repository.buscar_por_usuario_id(usuario_id)
        if cliente_atual is None:
            raise ClienteNaoEncontradoError()

        cliente = Cliente(
            id=cliente_atual.id,
            usuario_id=cliente_atual.usuario_id,
            nome_completo=dto.nome_completo,
            cpf=dto.cpf,
            telefone=dto.telefone,
            data_nascimento=dto.data_nascimento,
        )
        cliente_atualizado = self.repository.atualizar(cliente_atual.id, cliente)
        if cliente_atualizado is None:
            raise ClienteNaoEncontradoError()
        return cliente_atualizado
