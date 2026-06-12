from sqlalchemy import BigInteger, CheckConstraint, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class GestorModel(Base):
    __tablename__ = "gestores"
    __table_args__ = (
        CheckConstraint("length(trim(cpf)) = 11", name="chk_gestores_cpf_numerico"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    usuario_id: Mapped[int] = mapped_column(BigInteger, nullable=False, unique=True, index=True)
    nome_completo: Mapped[str] = mapped_column(String(150), nullable=False)
    cpf: Mapped[str] = mapped_column(String(11), nullable=False, unique=True)
    telefone: Mapped[str] = mapped_column(String(20), nullable=False)

