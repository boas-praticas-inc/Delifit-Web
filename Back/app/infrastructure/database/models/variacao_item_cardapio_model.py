from datetime import datetime
from decimal import Decimal

from sqlalchemy import BigInteger, DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class VariacaoItemCardapioModel(Base):
    __tablename__ = "variacoes_item_cardapio"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    item_cardapio_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("itens_cardapio.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    descricao_variacao: Mapped[str] = mapped_column(String(30), nullable=False)
    quantidade: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    unidade_medida: Mapped[str | None] = mapped_column(String(10))
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
