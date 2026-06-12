from app.application.dto.restaurante_dto import AtualizarRestauranteDTO
from app.core.restaurante_exceptions import CnpjJaCadastradoError, RestauranteNaoEncontradoError
from app.domain.repositories.restaurante_repository import RestauranteRepository


class AtualizarRestauranteUseCase:
    def __init__(self, repository: RestauranteRepository) -> None:
        self.repository = repository

    def executar(self, restaurante_id: int, dto: AtualizarRestauranteDTO):
        restaurante = self.repository.buscar_por_id(restaurante_id)
        if restaurante is None:
            raise RestauranteNaoEncontradoError()

        outro = self.repository.buscar_por_cnpj(dto.cnpj)
        if outro is not None and outro.id != restaurante_id:
            raise CnpjJaCadastradoError()

        restaurante.nome_fantasia = dto.nome_fantasia
        restaurante.razao_social = dto.razao_social
        restaurante.cnpj = dto.cnpj
        restaurante.telefone = dto.telefone
        restaurante.gestor_id = dto.gestor_id
        restaurante.endereco_id = dto.endereco_id
        restaurante.solicitacao_adesao_id = dto.solicitacao_adesao_id
        restaurante.descricao = dto.descricao
        restaurante.foto_url = dto.foto_url
        return self.repository.atualizar(restaurante)
