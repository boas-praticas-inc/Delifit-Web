from dataclasses import dataclass
from datetime import datetime

from app.domain.enums.usuario_enums import StatusUsuarioEnum, TipoUsuarioEnum


@dataclass(slots=True)
class Usuario:
    id: int | None
    email: str
    senha_hash: str
    tipo_usuario: TipoUsuarioEnum
    status: StatusUsuarioEnum = StatusUsuarioEnum.ATIVO
    criado_em: datetime | None = None
    atualizado_em: datetime | None = None
