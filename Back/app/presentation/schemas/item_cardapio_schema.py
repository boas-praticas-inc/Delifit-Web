from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ItemCardapioCreate(BaseModel):
    restaurante_id: int = Field(gt=0)
    nome: str = Field(min_length=1, max_length=150)
    descricao: str | None = None
    preco: float = Field(ge=0)
    tamanho: str | None = Field(default=None, pattern=r"^(PEQUENO|MEDIO|GRANDE)$")
    status_item: str = Field(pattern=r"^(ATIVO|INDISPONIVEL|INATIVO|ARQUIVADO)$")
    foto_url: str | None = None


class ItemCardapioUpdate(BaseModel):
    restaurante_id: int = Field(gt=0)
    nome: str = Field(min_length=1, max_length=150)
    descricao: str | None = None
    preco: float = Field(ge=0)
    tamanho: str | None = Field(default=None, pattern=r"^(PEQUENO|MEDIO|GRANDE)$")
    status_item: str = Field(pattern=r"^(ATIVO|INDISPONIVEL|INATIVO|ARQUIVADO)$")
    foto_url: str | None = None


class ItemCardapioResponse(BaseModel):
    id: int
    restaurante_id: int
    nome: str
    descricao: str | None
    preco: float
    tamanho: str | None
    status_item: str
    foto_url: str | None
    criado_em: datetime
    atualizado_em: datetime

    model_config = ConfigDict(from_attributes=True)
