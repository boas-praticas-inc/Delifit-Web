from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RestauranteCreate(BaseModel):
    gestor_id: int = Field(gt=0)
    endereco_id: int = Field(gt=0)
    solicitacao_adesao_id: int | None = Field(default=None, gt=0)
    nome_fantasia: str = Field(min_length=1, max_length=120)
    razao_social: str = Field(min_length=1, max_length=150)
    cnpj: str = Field(pattern=r"^[0-9]{14}$")
    telefone: str = Field(min_length=1, max_length=20)
    descricao: str | None = None
    foto_url: str | None = None


class RestauranteUpdate(BaseModel):
    gestor_id: int = Field(gt=0)
    endereco_id: int = Field(gt=0)
    solicitacao_adesao_id: int | None = Field(default=None, gt=0)
    nome_fantasia: str = Field(min_length=1, max_length=120)
    razao_social: str = Field(min_length=1, max_length=150)
    cnpj: str = Field(pattern=r"^[0-9]{14}$")
    telefone: str = Field(min_length=1, max_length=20)
    descricao: str | None = None
    foto_url: str | None = None


class RestauranteResponse(BaseModel):
    id: int
    gestor_id: int
    endereco_id: int
    solicitacao_adesao_id: int | None
    nome_fantasia: str
    razao_social: str
    cnpj: str
    telefone: str
    descricao: str | None
    foto_url: str | None
    status: str
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)
