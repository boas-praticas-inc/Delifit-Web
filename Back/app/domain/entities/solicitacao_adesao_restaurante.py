from dataclasses import dataclass
from datetime import datetime


@dataclass(slots=True)
class SolicitacaoAdesaoRestaurante:
    id: int | None
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
    status_solicitacao: str = "EM_ANALISE"
    motivo_reprovacao: str | None = None
    criado_em: datetime | None = None
    analisado_em: datetime | None = None
    analisado_por_admin_id: int | None = None
