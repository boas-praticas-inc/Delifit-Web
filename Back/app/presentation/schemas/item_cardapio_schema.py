from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class VariacaoItemCardapioPayload(BaseModel):
    tamanho: str = Field(pattern=r"^(PEQUENO|MEDIO|GRANDE)$")
    preco: float = Field(ge=0)
    carboidratos: float = Field(ge=0)
    gorduras: float = Field(ge=0)
    proteina: float = Field(ge=0)
    caloria: float = Field(ge=0)


class ItemCardapioCreate(BaseModel):
    restaurante_id: int = Field(gt=0)
    categoria_id: int = Field(gt=0)
    nome: str = Field(min_length=1, max_length=150)
    descricao: str | None = None
    variacoes: list[VariacaoItemCardapioPayload] = Field(min_length=1)
    status_item: str = Field(pattern=r"^(ATIVO|INDISPONIVEL|INATIVO|ARQUIVADO)$")
    foto_url: str | None = None


class ItemCardapioUpdate(BaseModel):
    restaurante_id: int = Field(gt=0)
    categoria_id: int = Field(gt=0)
    nome: str = Field(min_length=1, max_length=150)
    descricao: str | None = None
    variacoes: list[VariacaoItemCardapioPayload] = Field(min_length=1)
    status_item: str = Field(pattern=r"^(ATIVO|INDISPONIVEL|INATIVO|ARQUIVADO)$")
    foto_url: str | None = None


class VariacaoItemCardapioResponse(BaseModel):
    id: int | None
    tamanho: str
    preco: float
    carboidratos: float
    gorduras: float
    proteina: float
    caloria: float

    model_config = ConfigDict(from_attributes=True)


class ItemCardapioResponse(BaseModel):
    id: int
    restaurante_id: int
    categoria_id: int
    nome: str
    descricao: str | None
    variacoes: list[VariacaoItemCardapioResponse]
    status_item: str
    foto_url: str | None
    criado_em: datetime
    atualizado_em: datetime

    model_config = ConfigDict(from_attributes=True)
