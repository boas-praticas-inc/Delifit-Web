from app.domain.entities.endereco import Endereco
from app.domain.repositories.endereco_repository import EnderecoRepository


class ListarEnderecosUseCase:
    def __init__(self, repository: EnderecoRepository) -> None:
        self.repository = repository

    def executar(self) -> list[Endereco]:
        return self.repository.listar()

