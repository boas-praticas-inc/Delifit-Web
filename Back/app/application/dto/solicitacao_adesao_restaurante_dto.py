from dataclasses import dataclass
from datetime import datetime


@dataclass(slots=True)
class CriarSolicitacaoAdesaoRestauranteDTO:
    gestor_id: int
    nome_fantasia: str
    razao_social: str
    cnpj: str
    telefone: str
    cep: str
    logradouro: str
    numero: str
    bairro: str
    cidade: str
    estado: str
    complemento: str | None = None
    referencia: str | None = None
    descricao: str | None = None
    foto_url: str | None = None


@dataclass(slots=True)
class AnalisarSolicitacaoAdesaoRestauranteDTO:
    status_solicitacao: str
    analisado_por_admin_id: int
    motivo_reprovacao: str | None = None
    analisado_em: datetime | None = None

