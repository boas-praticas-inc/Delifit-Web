from app.core.exceptions import AppError
from app.domain.entities.endereco import Endereco
from app.domain.repositories.endereco_repository import EnderecoRepository


class EnderecoNaoEncontradoError(AppError):
    status_code = 404
    detail = "Endereco nao encontrado."


class BuscarEnderecoPorIdUseCase:
    def __init__(self, repository: EnderecoRepository) -> None:
        self.repository = repository

    def executar(self, endereco_id: int) -> Endereco:
        endereco = self.repository.buscar_por_id(endereco_id)
        if endereco is None:
            raise EnderecoNaoEncontradoError()
        return endereco

