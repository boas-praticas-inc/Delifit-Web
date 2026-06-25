from pydantic import BaseModel, ConfigDict, Field


class CategoriaCardapioCreate(BaseModel):
    nome: str = Field(min_length=1, max_length=80)


class CategoriaCardapioResponse(BaseModel):
    id: int
    nome: str

    model_config = ConfigDict(from_attributes=True)
