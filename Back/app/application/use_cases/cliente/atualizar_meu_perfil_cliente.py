from app.application.dto.cliente_dto import AtualizarMeuPerfilClienteDTO
from app.application.use_cases.cliente.buscar_cliente_por_id import ClienteNaoEncontradoError
from app.domain.entities.cliente import Cliente
from app.domain.repositories.cliente_repository import ClienteRepository
from app.domain.repositories.usuario_repository import UsuarioRepository


class AtualizarMeuPerfilClienteUseCase:
    def __init__(
        self,
        repository: ClienteRepository,
        usuario_repository: UsuarioRepository,
    ) -> None:
        self.repository = repository
        self.usuario_repository = usuario_repository

    def executar(self, usuario_id: int, dto: AtualizarMeuPerfilClienteDTO) -> Cliente:
        cliente_atual = self.repository.buscar_por_usuario_id(usuario_id)
        if cliente_atual is None:
            raise ClienteNaoEncontradoError()

        usuario_atualizado = self.usuario_repository.atualizar_telefone(usuario_id, dto.telefone)
        if usuario_atualizado is None:
            raise ClienteNaoEncontradoError()

        cliente = Cliente(
            id=cliente_atual.id,
            usuario_id=cliente_atual.usuario_id,
            nome_completo=dto.nome_completo,
            cpf=dto.cpf,
            data_nascimento=dto.data_nascimento,
        )
        cliente_atualizado = self.repository.atualizar(cliente_atual.id, cliente)
        if cliente_atualizado is None:
            raise ClienteNaoEncontradoError()
        return cliente_atualizado
