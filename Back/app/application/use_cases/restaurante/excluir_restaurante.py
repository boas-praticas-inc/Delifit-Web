from app.core.restaurante_exceptions import RestauranteNaoEncontradoError
from app.domain.repositories.restaurante_repository import RestauranteRepository


class ExcluirRestauranteUseCase:
    def __init__(self, repository: RestauranteRepository) -> None:
        self.repository = repository

    def executar(self, restaurante_id: int) -> None:
        restaurante = self.repository.buscar_por_id(restaurante_id)
        if restaurante is None:
            raise RestauranteNaoEncontradoError()
        self.repository.excluir(restaurante_id)
