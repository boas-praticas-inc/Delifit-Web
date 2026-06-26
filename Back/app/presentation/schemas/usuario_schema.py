from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

from app.domain.enums.usuario_enums import StatusUsuarioEnum, TipoUsuarioEnum


class UsuarioCreate(BaseModel):
    email: EmailStr | None = None
    telefone: str | None = Field(default=None, pattern=r"^[0-9]{10,11}$")
    senha: str = Field(min_length=8, max_length=128)
    tipo_usuario: TipoUsuarioEnum

    @model_validator(mode="after")
    def validar_credencial_login(self) -> "UsuarioCreate":
        if self.tipo_usuario == TipoUsuarioEnum.CLIENTE:
            if self.telefone is None:
                raise ValueError("Cliente deve informar telefone.")
        elif self.email is None:
            raise ValueError("Gestor e admin devem informar email.")
        return self


class UsuarioResponse(BaseModel):
    id: int
    email: EmailStr | None
    telefone: str | None
    tipo_usuario: TipoUsuarioEnum
    status: StatusUsuarioEnum
    criado_em: datetime
    atualizado_em: datetime | None

    model_config = ConfigDict(from_attributes=True)
