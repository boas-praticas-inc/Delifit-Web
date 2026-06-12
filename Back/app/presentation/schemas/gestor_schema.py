from pydantic import BaseModel, ConfigDict, Field


class GestorCreate(BaseModel):
    usuario_id: int = Field(gt=0)
    nome_completo: str = Field(min_length=1, max_length=150)
    cpf: str = Field(pattern=r"^[0-9]{11}$")
    telefone: str = Field(min_length=1, max_length=20)


class GestorResponse(BaseModel):
    id: int
    usuario_id: int
    nome_completo: str
    cpf: str
    telefone: str

    model_config = ConfigDict(from_attributes=True)

