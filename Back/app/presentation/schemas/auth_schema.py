from pydantic import BaseModel, EmailStr, Field

from app.presentation.schemas.usuario_schema import UsuarioResponse


class LoginClienteRequest(BaseModel):
    telefone: str = Field(pattern=r"^[0-9]{10,11}$")
    senha: str = Field(min_length=8, max_length=128)


class LoginEquipeRequest(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=8, max_length=128)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResponse
