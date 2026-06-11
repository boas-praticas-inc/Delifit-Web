from dataclasses import dataclass
from datetime import datetime


@dataclass(slots=True)
class Restaurante:
    id: int | None
    usuario_dono_id: int
    nome_fantasia: str
    razao_social: str
    cnpj: str
    telefone: str
    validado: bool = False
    logo_url: str | None = None
    criado_em: datetime | None = None
    atualizado_em: datetime | None = None
