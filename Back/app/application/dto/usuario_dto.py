from dataclasses import dataclass

from app.domain.enums.usuario_enums import TipoUsuarioEnum


@dataclass(slots=True)
class CriarUsuarioDTO:
    email: str
    senha: str
    tipo_usuario: TipoUsuarioEnum
