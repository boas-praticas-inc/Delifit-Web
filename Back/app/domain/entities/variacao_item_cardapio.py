from dataclasses import dataclass
from decimal import Decimal


@dataclass(slots=True)
class VariacaoItemCardapio:
    id: int | None
    descricao_variacao: str
    quantidade: Decimal | None
    unidade_medida: str | None
    preco: Decimal
    carboidratos: Decimal
    gorduras: Decimal
    proteina: Decimal
    caloria: Decimal
