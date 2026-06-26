from datetime import date

from pydantic import BaseModel, EmailStr, Field

from app.presentation.schemas.cliente_schema import ClienteResponse
from app.presentation.schemas.usuario_schema import UsuarioResponse


class LoginClienteRequest(BaseModel):
    telefone: str = Field(pattern=r"^[0-9]{10,11}$")
    senha: str = Field(min_length=8, max_length=128)


class LoginEquipeRequest(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=8, max_length=128)


class RegistrarClienteRequest(BaseModel):
    telefone: str = Field(pattern=r"^[0-9]{10,11}$")
    senha: str = Field(min_length=8, max_length=128)
    nome_completo: str = Field(min_length=1, max_length=150)
    cpf: str = Field(pattern=r"^[0-9]{11}$")
    data_nascimento: date | None = None


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResponse


class RegistroClienteResponse(LoginResponse):
    cliente: ClienteResponse
