from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class ClienteCreate(BaseModel):
    usuario_id: int = Field(gt=0)
    nome_completo: str = Field(min_length=1, max_length=150)
    cpf: str = Field(pattern=r"^[0-9]{11}$")
    data_nascimento: date | None = None


class ClienteUpdate(BaseModel):
    usuario_id: int = Field(gt=0)
    nome_completo: str = Field(min_length=1, max_length=150)
    cpf: str = Field(pattern=r"^[0-9]{11}$")
    data_nascimento: date | None = None


class MeuPerfilClienteUpdate(BaseModel):
    nome_completo: str = Field(min_length=1, max_length=150)
    cpf: str = Field(pattern=r"^[0-9]{11}$")
    telefone: str = Field(min_length=1, max_length=20)
    data_nascimento: date | None = None


class ClienteResponse(BaseModel):
    id: int
    usuario_id: int
    nome_completo: str
    cpf: str
    telefone: str | None = None
    data_nascimento: date | None

    model_config = ConfigDict(from_attributes=True)

