from app.application.dto.cartao_dto import CriarCartaoDTO
from app.application.use_cases.cliente.buscar_cliente_por_id import ClienteNaoEncontradoError
from app.domain.entities.cartao import Cartao
from app.domain.repositories.cartao_repository import CartaoRepository
from app.domain.repositories.cliente_repository import ClienteRepository


class CriarMeuCartaoUseCase:
    def __init__(
        self,
        repository: CartaoRepository,
        cliente_repository: ClienteRepository,
    ) -> None:
        self.repository = repository
        self.cliente_repository = cliente_repository

    def executar(self, usuario_id: int, dto: CriarCartaoDTO) -> Cartao:
        cliente = self.cliente_repository.buscar_por_usuario_id(usuario_id)
        if cliente is None or cliente.id is None:
            raise ClienteNaoEncontradoError()

        if dto.padrao:
            self.repository.desmarcar_padrao_por_cliente(cliente.id)

        cartao = Cartao(
            id=None,
            cliente_id=cliente.id,
            nome_titular=dto.nome_titular,
            ultimos_quatro_digitos=dto.ultimos_quatro_digitos,
            bandeira=dto.bandeira,
            token_gateway=dto.token_gateway,
            padrao=dto.padrao,
        )
        return self.repository.criar(cartao)
