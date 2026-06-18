from datetime import datetime
from decimal import Decimal

from sqlalchemy import BigInteger, DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

tamanho_item_pg_enum = ENUM(
    "PEQUENO",
    "MEDIO",
    "GRANDE",
    name="tamanho_item_enum",
    create_type=False,
)

status_item_pg_enum = ENUM(
    "ATIVO",
    "INDISPONIVEL",
    "INATIVO",
    "ARQUIVADO",
    name="status_item_enum",
    create_type=False,
)


class ItemCardapioModel(Base):
    __tablename__ = "itens_cardapio"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    restaurante_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("restaurantes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    nome: Mapped[str] = mapped_column(String(150), nullable=False)
    descricao: Mapped[str | None] = mapped_column(Text)
    preco: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    tamanho: Mapped[str | None] = mapped_column(tamanho_item_pg_enum)
    status_item: Mapped[str] = mapped_column(
        status_item_pg_enum,
        nullable=False,
        server_default="ATIVO",
    )
    foto_url: Mapped[str | None] = mapped_column(Text)
    criado_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
    )
    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
    )
