from app.application.dto.cartao_dto import AtualizarCartaoDTO
from app.application.use_cases.cartao.buscar_meu_cartao_por_id import CartaoNaoEncontradoError
from app.application.use_cases.cliente.buscar_cliente_por_id import ClienteNaoEncontradoError
from app.domain.entities.cartao import Cartao
from app.domain.repositories.cartao_repository import CartaoRepository
from app.domain.repositories.cliente_repository import ClienteRepository


class AtualizarMeuCartaoUseCase:
    def __init__(
        self,
        repository: CartaoRepository,
        cliente_repository: ClienteRepository,
    ) -> None:
        self.repository = repository
        self.cliente_repository = cliente_repository

    def executar(self, usuario_id: int, cartao_id: int, dto: AtualizarCartaoDTO) -> Cartao:
        cliente = self.cliente_repository.buscar_por_usuario_id(usuario_id)
        if cliente is None or cliente.id is None:
            raise ClienteNaoEncontradoError()

        cartao_atual = self.repository.buscar_por_id_e_cliente_id(cartao_id, cliente.id)
        if cartao_atual is None:
            raise CartaoNaoEncontradoError()

        if dto.padrao:
            self.repository.desmarcar_padrao_por_cliente(cliente.id)

        cartao = Cartao(
            id=cartao_atual.id,
            cliente_id=cliente.id,
            nome_titular=dto.nome_titular,
            ultimos_quatro_digitos=dto.ultimos_quatro_digitos,
            bandeira=dto.bandeira,
            token_gateway=dto.token_gateway,
            padrao=dto.padrao,
            criado_em=cartao_atual.criado_em,
        )
        cartao_atualizado = self.repository.atualizar(cartao_id, cartao)
        if cartao_atualizado is None:
            raise CartaoNaoEncontradoError()
        return cartao_atualizado
