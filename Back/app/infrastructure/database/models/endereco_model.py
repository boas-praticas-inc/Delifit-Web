from sqlalchemy import BigInteger, CheckConstraint, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class EnderecoModel(Base):
    __tablename__ = "enderecos"
    __table_args__ = (
        CheckConstraint("cep ~ '^[0-9]{8}$'", name="chk_enderecos_cep_numerico"),
        CheckConstraint("estado ~ '^[A-Z]{2}$'", name="chk_enderecos_estado_maiusculo"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    cep: Mapped[str] = mapped_column(String(8), nullable=False)
    logradouro: Mapped[str] = mapped_column(String(150), nullable=False)
    numero: Mapped[str] = mapped_column(String(20), nullable=False)
    bairro: Mapped[str] = mapped_column(String(100), nullable=False)
    cidade: Mapped[str] = mapped_column(String(100), nullable=False)
    estado: Mapped[str] = mapped_column(String(2), nullable=False)
    complemento: Mapped[str | None] = mapped_column(String(100))
    referencia: Mapped[str | None] = mapped_column(String(150))
    label: Mapped[str | None] = mapped_column(String(50))
    cliente_id: Mapped[int | None] = mapped_column(
        BigInteger,
        ForeignKey("clientes.id", ondelete="CASCADE"),
        index=True,
    )

