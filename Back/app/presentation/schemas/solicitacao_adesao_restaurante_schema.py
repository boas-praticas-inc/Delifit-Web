from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SolicitacaoAdesaoRestauranteCreate(BaseModel):
    gestor_id: int = Field(gt=0)
    nome_fantasia: str = Field(min_length=1, max_length=150)
    razao_social: str = Field(min_length=1, max_length=150)
    cnpj: str = Field(pattern=r"^[0-9]{14}$")
    telefone: str = Field(min_length=1, max_length=20)
    cep: str = Field(pattern=r"^[0-9]{8}$")
    logradouro: str = Field(min_length=1, max_length=150)
    numero: str = Field(min_length=1, max_length=20)
    bairro: str = Field(min_length=1, max_length=100)
    cidade: str = Field(min_length=1, max_length=100)
    estado: str = Field(pattern=r"^[A-Z]{2}$")
    complemento: str | None = Field(default=None, max_length=100)
    referencia: str | None = Field(default=None, max_length=150)
    descricao: str | None = None
    foto_url: str | None = None


class SolicitacaoAdesaoRestauranteResponse(BaseModel):
    id: int
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
    complemento: str | None
    referencia: str | None
    descricao: str | None
    foto_url: str | None
    status_solicitacao: str
    motivo_reprovacao: str | None
    criado_em: datetime
    analisado_em: datetime | None
    analisado_por_admin_id: int | None

    model_config = ConfigDict(from_attributes=True)


class AprovarSolicitacaoAdesaoRestauranteRequest(BaseModel):
    analisado_por_admin_id: int = Field(gt=0)


class RecusarSolicitacaoAdesaoRestauranteRequest(BaseModel):
    analisado_por_admin_id: int = Field(gt=0)
    motivo_reprovacao: str = Field(min_length=1)

