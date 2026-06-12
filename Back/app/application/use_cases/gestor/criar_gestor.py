from app.application.dto.gestor_dto import CriarGestorDTO
from app.domain.entities.gestor import Gestor
from app.domain.repositories.gestor_repository import GestorRepository


class CriarGestorUseCase:
    def __init__(self, repository: GestorRepository) -> None:
        self.repository = repository

    def executar(self, dto: CriarGestorDTO) -> Gestor:
        gestor = Gestor(
            id=None,
            usuario_id=dto.usuario_id,
            nome_completo=dto.nome_completo,
            cpf=dto.cpf,
            telefone=dto.telefone,
        )
        return self.repository.criar(gestor)

