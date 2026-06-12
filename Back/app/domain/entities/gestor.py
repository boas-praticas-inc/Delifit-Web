from dataclasses import dataclass


@dataclass(slots=True)
class Gestor:
    id: int | None
    usuario_id: int
    nome_completo: str
    cpf: str
    telefone: str
