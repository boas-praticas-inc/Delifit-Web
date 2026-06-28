from app.application.dto.endereco_dto import CriarEnderecoDTO
from app.application.use_cases.cliente.buscar_cliente_por_id import ClienteNaoEncontradoError
from app.domain.entities.endereco import Endereco
from app.domain.repositories.cliente_repository import ClienteRepository
from app.domain.repositories.endereco_repository import EnderecoRepository


class CriarMeuEnderecoUseCase:
    def __init__(
        self,
        repository: EnderecoRepository,
        cliente_repository: ClienteRepository,
    ) -> None:
        self.repository = repository
        self.cliente_repository = cliente_repository

    def executar(self, usuario_id: int, dto: CriarEnderecoDTO) -> Endereco:
        cliente = self.cliente_repository.buscar_por_usuario_id(usuario_id)
        if cliente is None or cliente.id is None:
            raise ClienteNaoEncontradoError()

        endereco = Endereco(
            id=None,
            cep=dto.cep,
            logradouro=dto.logradouro,
            numero=dto.numero,
            bairro=dto.bairro,
            cidade=dto.cidade,
            estado=dto.estado,
            complemento=dto.complemento,
            referencia=dto.referencia,
            label=dto.label,
            cliente_id=cliente.id,
        )
        return self.repository.criar(endereco)
