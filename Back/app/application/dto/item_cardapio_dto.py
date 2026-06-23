from dataclasses import dataclass
from decimal import Decimal


@dataclass(slots=True)
class CriarItemCardapioDTO:
    restaurante_id: int
    categoria_id: int
    nome: str
    preco: Decimal
    carboidratos: Decimal
    gorduras: Decimal
    proteina: Decimal
    caloria: Decimal
    tamanho: str
    descricao: str | None = None
    status_item: str = "ATIVO"
    foto_url: str | None = None


@dataclass(slots=True)
class AtualizarItemCardapioDTO:
    restaurante_id: int
    categoria_id: int
    nome: str
    preco: Decimal
    carboidratos: Decimal
    gorduras: Decimal
    proteina: Decimal
    caloria: Decimal
    tamanho: str
    descricao: str | None = None
    status_item: str = "ATIVO"
    foto_url: str | None = None
