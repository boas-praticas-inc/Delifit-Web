from pydantic import BaseModel, ConfigDict, Field


class AdminCreate(BaseModel):
    usuario_id: int = Field(gt=0)
    nome_completo: str = Field(min_length=1, max_length=150)
    cargo: str | None = Field(default=None, max_length=100)


class AdminResponse(BaseModel):
    id: int
    usuario_id: int
    nome_completo: str
    cargo: str | None

    model_config = ConfigDict(from_attributes=True)

