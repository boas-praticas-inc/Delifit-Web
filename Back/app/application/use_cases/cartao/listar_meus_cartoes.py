from app.application.use_cases.cliente.buscar_cliente_por_id import ClienteNaoEncontradoError
from app.domain.entities.cartao import Cartao
from app.domain.repositories.cartao_repository import CartaoRepository
from app.domain.repositories.cliente_repository import ClienteRepository


class ListarMeusCartoesUseCase:
    def __init__(
        self,
        repository: CartaoRepository,
        cliente_repository: ClienteRepository,
    ) -> None:
        self.repository = repository
        self.cliente_repository = cliente_repository

    def executar(self, usuario_id: int) -> list[Cartao]:
        cliente = self.cliente_repository.buscar_por_usuario_id(usuario_id)
        if cliente is None or cliente.id is None:
            raise ClienteNaoEncontradoError()
        return self.repository.listar_por_cliente_id(cliente.id)
