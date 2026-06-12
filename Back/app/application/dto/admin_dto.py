from dataclasses import dataclass


@dataclass(slots=True)
class CriarAdminDTO:
    usuario_id: int
    nome_completo: str
    cargo: str | None = None

