from app.application.use_cases.cartao.buscar_meu_cartao_por_id import CartaoNaoEncontradoError
from app.application.use_cases.cliente.buscar_cliente_por_id import ClienteNaoEncontradoError
from app.domain.repositories.cartao_repository import CartaoRepository
from app.domain.repositories.cliente_repository import ClienteRepository


class ExcluirMeuCartaoUseCase:
    def __init__(
        self,
        repository: CartaoRepository,
        cliente_repository: ClienteRepository,
    ) -> None:
        self.repository = repository
        self.cliente_repository = cliente_repository

    def executar(self, usuario_id: int, cartao_id: int) -> None:
        cliente = self.cliente_repository.buscar_por_usuario_id(usuario_id)
        if cliente is None or cliente.id is None:
            raise ClienteNaoEncontradoError()

        cartao = self.repository.buscar_por_id_e_cliente_id(cartao_id, cliente.id)
        if cartao is None:
            raise CartaoNaoEncontradoError()

        removido = self.repository.excluir(cartao_id)
        if not removido:
            raise CartaoNaoEncontradoError()
