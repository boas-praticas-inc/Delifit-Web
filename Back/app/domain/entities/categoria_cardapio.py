from dataclasses import dataclass


@dataclass(slots=True)
class CategoriaCardapio:
    id: int | None
    nome: str
