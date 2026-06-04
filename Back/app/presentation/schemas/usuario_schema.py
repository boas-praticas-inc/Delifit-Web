from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.domain.enums.usuario_enums import StatusUsuarioEnum, TipoUsuarioEnum


class UsuarioCreate(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=8, max_length=128)
    tipo_usuario: TipoUsuarioEnum


class UsuarioResponse(BaseModel):
    id: int
    email: EmailStr
    tipo_usuario: TipoUsuarioEnum
    status: StatusUsuarioEnum
    criado_em: datetime
    atualizado_em: datetime | None

    model_config = ConfigDict(from_attributes=True)
