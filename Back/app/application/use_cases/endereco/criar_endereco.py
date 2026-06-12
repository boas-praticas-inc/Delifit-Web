from app.application.dto.endereco_dto import CriarEnderecoDTO
from app.domain.entities.endereco import Endereco
from app.domain.repositories.endereco_repository import EnderecoRepository


class CriarEnderecoUseCase:
    def __init__(self, repository: EnderecoRepository) -> None:
        self.repository = repository

    def executar(self, dto: CriarEnderecoDTO) -> Endereco:
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
            cliente_id=dto.cliente_id,
        )
        return self.repository.criar(endereco)

