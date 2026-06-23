from dataclasses import dataclass


@dataclass(slots=True)
class CriarCategoriaCardapioDTO:
    nome: str
