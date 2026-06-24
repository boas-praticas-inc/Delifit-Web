from dataclasses import dataclass
from datetime import datetime

from app.domain.entities.variacao_item_cardapio import VariacaoItemCardapio


@dataclass(slots=True)
class ItemCardapio:
    id: int | None
    restaurante_id: int
    categoria_id: int
    nome: str
    variacoes: list[VariacaoItemCardapio]
    descricao: str | None = None
    status_item: str = "ATIVO"
    foto_url: str | None = None
    criado_em: datetime | None = None
    atualizado_em: datetime | None = None
