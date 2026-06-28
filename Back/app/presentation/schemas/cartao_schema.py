from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MeuCartaoCreate(BaseModel):
    nome_titular: str = Field(min_length=1, max_length=150)
    ultimos_quatro_digitos: str = Field(pattern=r"^[0-9]{4}$")
    bandeira: str = Field(min_length=1, max_length=30)
    token_gateway: str | None = Field(default=None, max_length=255)
    padrao: bool = False


class MeuCartaoUpdate(BaseModel):
    nome_titular: str = Field(min_length=1, max_length=150)
    ultimos_quatro_digitos: str = Field(pattern=r"^[0-9]{4}$")
    bandeira: str = Field(min_length=1, max_length=30)
    token_gateway: str | None = Field(default=None, max_length=255)
    padrao: bool = False


class CartaoResponse(BaseModel):
    id: int
    cliente_id: int
    nome_titular: str
    ultimos_quatro_digitos: str
    bandeira: str
    token_gateway: str | None
    padrao: bool
    criado_em: datetime | None

    model_config = ConfigDict(from_attributes=True)
