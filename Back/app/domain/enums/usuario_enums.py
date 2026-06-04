from enum import StrEnum


class TipoUsuarioEnum(StrEnum):
    CLIENTE = "CLIENTE"
    RESTAURANTE = "RESTAURANTE"
    ENTREGADOR = "ENTREGADOR"
    ADMIN = "ADMIN"


class StatusUsuarioEnum(StrEnum):
    ATIVO = "ATIVO"
    INATIVO = "INATIVO"
    BANIDO = "BANIDO"
