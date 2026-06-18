from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal


@dataclass(slots=True)
class ItemCardapio:
    id: int | None
    restaurante_id: int
    nome: str
    preco: Decimal
    descricao: str | None = None
    tamanho: str | None = None
    status_item: str = "ATIVO"
    foto_url: str | None = None
    criado_em: datetime | None = None
    atualizado_em: datetime | None = None
