from dataclasses import dataclass
from datetime import datetime


@dataclass(slots=True)
class Cartao:
    id: int | None
    cliente_id: int
    nome_titular: str
    ultimos_quatro_digitos: str
    bandeira: str
    token_gateway: str | None = None
    padrao: bool = False
    criado_em: datetime | None = None
