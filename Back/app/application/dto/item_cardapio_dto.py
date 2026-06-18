from dataclasses import dataclass
from decimal import Decimal


@dataclass(slots=True)
class CriarItemCardapioDTO:
    restaurante_id: int
    nome: str
    preco: Decimal
    descricao: str | None = None
    tamanho: str | None = None
    status_item: str = "ATIVO"
    foto_url: str | None = None


@dataclass(slots=True)
class AtualizarItemCardapioDTO:
    restaurante_id: int
    nome: str
    preco: Decimal
    descricao: str | None = None
    tamanho: str | None = None
    status_item: str = "ATIVO"
    foto_url: str | None = None
