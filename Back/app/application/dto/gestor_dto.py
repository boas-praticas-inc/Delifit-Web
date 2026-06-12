from dataclasses import dataclass


@dataclass(slots=True)
class CriarGestorDTO:
    usuario_id: int
    nome_completo: str
    cpf: str
    telefone: str

