from app.application.use_cases.cliente.buscar_cliente_por_id import ClienteNaoEncontradoError
from app.core.exceptions import AppError
from app.domain.entities.cartao import Cartao
from app.domain.repositories.cartao_repository import CartaoRepository
from app.domain.repositories.cliente_repository import ClienteRepository


class CartaoNaoEncontradoError(AppError):
    status_code = 404
    detail = "Cartao nao encontrado."


class BuscarMeuCartaoPorIdUseCase:
    def __init__(
        self,
        repository: CartaoRepository,
        cliente_repository: ClienteRepository,
    ) -> None:
        self.repository = repository
        self.cliente_repository = cliente_repository

    def executar(self, usuario_id: int, cartao_id: int) -> Cartao:
        cliente = self.cliente_repository.buscar_por_usuario_id(usuario_id)
        if cliente is None or cliente.id is None:
            raise ClienteNaoEncontradoError()

        cartao = self.repository.buscar_por_id_e_cliente_id(cartao_id, cliente.id)
        if cartao is None:
            raise CartaoNaoEncontradoError()
        return cartao
