from dataclasses import dataclass


@dataclass(slots=True)
class Admin:
    id: int | None
    usuario_id: int
    nome_completo: str
    cargo: str | None = None
