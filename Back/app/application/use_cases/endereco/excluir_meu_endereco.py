from app.application.use_cases.cliente.buscar_cliente_por_id import ClienteNaoEncontradoError
from app.application.use_cases.endereco.buscar_endereco_por_id import EnderecoNaoEncontradoError
from app.domain.repositories.cliente_repository import ClienteRepository
from app.domain.repositories.endereco_repository import EnderecoRepository


class ExcluirMeuEnderecoUseCase:
    def __init__(
        self,
        repository: EnderecoRepository,
        cliente_repository: ClienteRepository,
    ) -> None:
        self.repository = repository
        self.cliente_repository = cliente_repository

    def executar(self, usuario_id: int, endereco_id: int) -> None:
        cliente = self.cliente_repository.buscar_por_usuario_id(usuario_id)
        if cliente is None or cliente.id is None:
            raise ClienteNaoEncontradoError()

        endereco = self.repository.buscar_por_id_e_cliente_id(endereco_id, cliente.id)
        if endereco is None:
            raise EnderecoNaoEncontradoError()

        removido = self.repository.excluir(endereco_id)
        if not removido:
            raise EnderecoNaoEncontradoError()
