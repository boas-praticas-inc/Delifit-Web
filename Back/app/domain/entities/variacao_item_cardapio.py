from dataclasses import dataclass
from decimal import Decimal


@dataclass(slots=True)
class VariacaoItemCardapio:
    id: int | None
    tamanho: str
    preco: Decimal
    carboidratos: Decimal
    gorduras: Decimal
    proteina: Decimal
    caloria: Decimal
