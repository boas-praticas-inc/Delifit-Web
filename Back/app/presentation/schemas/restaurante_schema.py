from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RestauranteCreate(BaseModel):
    usuario_dono_id: int = Field(gt=0)
    nome_fantasia: str = Field(min_length=1, max_length=120)
    razao_social: str = Field(min_length=1, max_length=150)
    cnpj: str = Field(pattern=r"^[0-9]{14}$")
    telefone: str = Field(min_length=1, max_length=20)
    validado: bool = False
    logo_url: str | None = Field(default=None, max_length=255)


class RestauranteUpdate(BaseModel):
    nome_fantasia: str = Field(min_length=1, max_length=120)
    razao_social: str = Field(min_length=1, max_length=150)
    cnpj: str = Field(pattern=r"^[0-9]{14}$")
    telefone: str = Field(min_length=1, max_length=20)
    validado: bool
    logo_url: str | None = Field(default=None, max_length=255)


class RestauranteResponse(BaseModel):
    id: int
    usuario_dono_id: int
    nome_fantasia: str
    razao_social: str
    cnpj: str
    telefone: str
    validado: bool
    logo_url: str | None
    criado_em: datetime
    atualizado_em: datetime | None

    model_config = ConfigDict(from_attributes=True)
