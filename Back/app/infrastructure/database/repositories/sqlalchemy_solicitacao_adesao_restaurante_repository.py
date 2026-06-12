from sqlalchemy.orm import Session

from app.domain.entities.solicitacao_adesao_restaurante import SolicitacaoAdesaoRestaurante
from app.domain.repositories.solicitacao_adesao_restaurante_repository import (
    SolicitacaoAdesaoRestauranteRepository,
)
from app.infrastructure.database.models.solicitacao_adesao_restaurante_model import (
    SolicitacaoAdesaoRestauranteModel,
)


class SQLAlchemySolicitacaoAdesaoRestauranteRepository(SolicitacaoAdesaoRestauranteRepository):
    def __init__(self, session: Session) -> None:
        self.session = session

    def criar(self, solicitacao: SolicitacaoAdesaoRestaurante) -> SolicitacaoAdesaoRestaurante:
        model = SolicitacaoAdesaoRestauranteModel(
            gestor_id=solicitacao.gestor_id,
            nome_fantasia=solicitacao.nome_fantasia,
            razao_social=solicitacao.razao_social,
            cnpj=solicitacao.cnpj,
            telefone=solicitacao.telefone,
            descricao=solicitacao.descricao,
            foto_url=solicitacao.foto_url,
            cep=solicitacao.cep,
            logradouro=solicitacao.logradouro,
            numero=solicitacao.numero,
            bairro=solicitacao.bairro,
            cidade=solicitacao.cidade,
            estado=solicitacao.estado,
            complemento=solicitacao.complemento,
            referencia=solicitacao.referencia,
        )
        self.session.add(model)
        self.session.commit()
        self.session.refresh(model)
        return self._to_entity(model)

    def listar(self) -> list[SolicitacaoAdesaoRestaurante]:
        models = self.session.query(SolicitacaoAdesaoRestauranteModel).order_by(
            SolicitacaoAdesaoRestauranteModel.id
        ).all()
        return [self._to_entity(model) for model in models]

    def buscar_por_id(self, solicitacao_id: int) -> SolicitacaoAdesaoRestaurante | None:
        model = self.session.get(SolicitacaoAdesaoRestauranteModel, solicitacao_id)
        return self._to_entity(model) if model is not None else None

    @staticmethod
    def _to_entity(model: SolicitacaoAdesaoRestauranteModel) -> SolicitacaoAdesaoRestaurante:
        return SolicitacaoAdesaoRestaurante(
            id=model.id,
            gestor_id=model.gestor_id,
            nome_fantasia=model.nome_fantasia,
            razao_social=model.razao_social,
            cnpj=model.cnpj,
            telefone=model.telefone,
            cep=model.cep,
            logradouro=model.logradouro,
            numero=model.numero,
            bairro=model.bairro,
            cidade=model.cidade,
            estado=model.estado,
            complemento=model.complemento,
            referencia=model.referencia,
            descricao=model.descricao,
            foto_url=model.foto_url,
            status_solicitacao=model.status_solicitacao,
            motivo_reprovacao=model.motivo_reprovacao,
            criado_em=model.criado_em,
            analisado_em=model.analisado_em,
            analisado_por_admin_id=model.analisado_por_admin_id,
        )

