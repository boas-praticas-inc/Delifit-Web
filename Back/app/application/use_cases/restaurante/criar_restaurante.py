from app.core.restaurante_exceptions import CnpjJaCadastradoError
from app.domain.entities.restaurante import Restaurante
from app.domain.repositories.restaurante_repository import RestauranteRepository
from app.application.dto.restaurante_dto import CriarRestauranteDTO


class CriarRestauranteUseCase:
    def __init__(self, repository: RestauranteRepository) -> None:
        self.repository = repository

    def executar(self, dto: CriarRestauranteDTO) -> Restaurante:
        if self.repository.buscar_por_cnpj(dto.cnpj) is not None:
            raise CnpjJaCadastradoError()

        restaurante = Restaurante(
            id=None,
            usuario_dono_id=dto.usuario_dono_id,
            nome_fantasia=dto.nome_fantasia,
            razao_social=dto.razao_social,
            cnpj=dto.cnpj,
            telefone=dto.telefone,
            validado=dto.validado,
            logo_url=dto.logo_url,
        )
        return self.repository.criar(restaurante)
