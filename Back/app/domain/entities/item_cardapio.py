from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal


@dataclass(slots=True)
class ItemCardapio:
    id: int | None
    restaurante_id: int
    categoria_id: int
    nome: str
    preco: Decimal
    carboidratos: Decimal
    gorduras: Decimal
    proteina: Decimal
    caloria: Decimal
    descricao: str | None = None
    tamanho: str = "MEDIO"
    status_item: str = "ATIVO"
    foto_url: str | None = None
    criado_em: datetime | None = None
    atualizado_em: datetime | None = None
