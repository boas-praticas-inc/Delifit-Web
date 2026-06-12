from enum import StrEnum


class TipoUsuarioEnum(StrEnum):
    CLIENTE = "CLIENTE"
    GESTOR = "GESTOR"
    ADMIN = "ADMIN"


class StatusUsuarioEnum(StrEnum):
    ATIVO = "ATIVO"
    INATIVO = "INATIVO"
    BLOQUEADO = "BLOQUEADO"
