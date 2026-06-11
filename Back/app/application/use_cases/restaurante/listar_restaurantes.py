from app.domain.entities.restaurante import Restaurante
from app.domain.repositories.restaurante_repository import RestauranteRepository


class ListarRestaurantesUseCase:
    def __init__(self, repository: RestauranteRepository) -> None:
        self.repository = repository

    def executar(self) -> list[Restaurante]:
        return self.repository.listar()
