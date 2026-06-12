from datetime import date

from sqlalchemy import BigInteger, CheckConstraint, Date, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ClienteModel(Base):
    __tablename__ = "clientes"
    __table_args__ = (
        CheckConstraint("length(trim(cpf)) = 11", name="chk_clientes_cpf_numerico"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    usuario_id: Mapped[int] = mapped_column(BigInteger, nullable=False, unique=True, index=True)
    nome_completo: Mapped[str] = mapped_column(String(150), nullable=False)
    cpf: Mapped[str] = mapped_column(String(11), nullable=False, unique=True)
    telefone: Mapped[str] = mapped_column(String(20), nullable=False)
    data_nascimento: Mapped[date | None] = mapped_column(Date)

