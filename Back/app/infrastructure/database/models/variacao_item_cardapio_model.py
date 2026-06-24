from datetime import datetime
from decimal import Decimal

from sqlalchemy import BigInteger, DateTime, ForeignKey, Numeric, func
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


class VariacaoItemCardapioModel(Base):
    __tablename__ = "variacoes_item_cardapio"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    item_cardapio_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("itens_cardapio.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    tamanho: Mapped[str] = mapped_column(tamanho_item_pg_enum, nullable=False)
    preco: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    carboidratos: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    gorduras: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    proteina: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    caloria: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
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
