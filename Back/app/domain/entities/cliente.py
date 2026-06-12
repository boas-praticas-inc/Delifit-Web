from dataclasses import dataclass
from datetime import date


@dataclass(slots=True)
class Cliente:
    id: int | None
    usuario_id: int
    nome_completo: str
    cpf: str
    telefone: str
    data_nascimento: date | None = None
