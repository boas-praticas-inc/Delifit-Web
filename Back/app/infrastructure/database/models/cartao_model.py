from datetime import datetime

from sqlalchemy import BigInteger, Boolean, CheckConstraint, DateTime, ForeignKey, String, func, text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class CartaoModel(Base):
    __tablename__ = "cartoes"
    __table_args__ = (
        CheckConstraint(
            "ultimos_quatro_digitos ~ '^[0-9]{4}$'",
            name="chk_cartoes_ultimos_4",
        ),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    cliente_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("clientes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    nome_titular: Mapped[str] = mapped_column(String(150), nullable=False)
    ultimos_quatro_digitos: Mapped[str] = mapped_column(String(4), nullable=False)
    bandeira: Mapped[str] = mapped_column(String(30), nullable=False)
    token_gateway: Mapped[str | None] = mapped_column(String(255))
    padrao: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=text("false"),
    )
    criado_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
    )
