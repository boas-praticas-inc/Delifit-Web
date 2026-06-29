from app.application.use_cases.endereco.buscar_endereco_por_id import EnderecoNaoEncontradoError
from app.application.use_cases.gestor.buscar_meu_perfil_gestor import GestorNaoEncontradoError
from app.core.exceptions import AppError
from app.domain.entities.endereco import Endereco
from app.domain.repositories.endereco_repository import EnderecoRepository
from app.domain.repositories.gestor_repository import GestorRepository
from app.domain.repositories.restaurante_repository import RestauranteRepository


class RestauranteDoGestorNaoEncontradoError(AppError):
    status_code = 404
    detail = "Restaurante do gestor nao encontrado."


class BuscarEnderecoRestauranteDoGestorUseCase:
    def __init__(
        self,
        endereco_repository: EnderecoRepository,
        gestor_repository: GestorRepository,
        restaurante_repository: RestauranteRepository,
    ) -> None:
        self.endereco_repository = endereco_repository
        self.gestor_repository = gestor_repository
        self.restaurante_repository = restaurante_repository

    def executar(self, usuario_id: int) -> Endereco:
        gestor = self.gestor_repository.buscar_por_usuario_id(usuario_id)
        if gestor is None or gestor.id is None:
            raise GestorNaoEncontradoError()

        restaurante = self.restaurante_repository.buscar_por_gestor_id(gestor.id)
        if restaurante is None:
            raise RestauranteDoGestorNaoEncontradoError()

        endereco = self.endereco_repository.buscar_por_id(restaurante.endereco_id)
        if endereco is None:
            raise EnderecoNaoEncontradoError()

        return endereco
