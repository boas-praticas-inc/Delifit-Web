from app.application.dto.endereco_dto import AtualizarEnderecoDTO
from app.application.use_cases.endereco.buscar_endereco_por_id import EnderecoNaoEncontradoError
from app.application.use_cases.endereco.buscar_endereco_restaurante_do_gestor import (
    RestauranteDoGestorNaoEncontradoError,
)
from app.application.use_cases.gestor.buscar_meu_perfil_gestor import GestorNaoEncontradoError
from app.domain.entities.endereco import Endereco
from app.domain.repositories.endereco_repository import EnderecoRepository
from app.domain.repositories.gestor_repository import GestorRepository
from app.domain.repositories.restaurante_repository import RestauranteRepository


class AtualizarEnderecoRestauranteDoGestorUseCase:
    def __init__(
        self,
        endereco_repository: EnderecoRepository,
        gestor_repository: GestorRepository,
        restaurante_repository: RestauranteRepository,
    ) -> None:
        self.endereco_repository = endereco_repository
        self.gestor_repository = gestor_repository
        self.restaurante_repository = restaurante_repository

    def executar(self, usuario_id: int, dto: AtualizarEnderecoDTO) -> Endereco:
        gestor = self.gestor_repository.buscar_por_usuario_id(usuario_id)
        if gestor is None or gestor.id is None:
            raise GestorNaoEncontradoError()

        restaurante = self.restaurante_repository.buscar_por_gestor_id(gestor.id)
        if restaurante is None:
            raise RestauranteDoGestorNaoEncontradoError()

        endereco_atual = self.endereco_repository.buscar_por_id(restaurante.endereco_id)
        if endereco_atual is None or endereco_atual.id is None:
            raise EnderecoNaoEncontradoError()

        endereco = Endereco(
            id=endereco_atual.id,
            cep=dto.cep,
            logradouro=dto.logradouro,
            numero=dto.numero,
            bairro=dto.bairro,
            cidade=dto.cidade,
            estado=dto.estado,
            complemento=dto.complemento,
            referencia=dto.referencia,
            label=endereco_atual.label,
            cliente_id=endereco_atual.cliente_id,
        )
        endereco_atualizado = self.endereco_repository.atualizar(endereco_atual.id, endereco)
        if endereco_atualizado is None:
            raise EnderecoNaoEncontradoError()
        return endereco_atualizado
