from datetime import datetime

from sqlalchemy import BigInteger, Boolean, CheckConstraint, DateTime, String, func, text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class RestauranteModel(Base):
    __tablename__ = "restaurantes"
    __table_args__ = (
        CheckConstraint("length(trim(nome_fantasia)) > 0", name="restaurantes_nome_fantasia_nao_vazio"),
        CheckConstraint("length(trim(razao_social)) > 0", name="restaurantes_razao_social_nao_vazia"),
        CheckConstraint("length(trim(telefone)) > 0", name="restaurantes_telefone_nao_vazio"),
        CheckConstraint("cnpj ~ '^[0-9]{14}$'", name="restaurantes_cnpj_apenas_digitos"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    usuario_dono_id: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        index=True,
    )
    nome_fantasia: Mapped[str] = mapped_column(String(120), nullable=False)
    razao_social: Mapped[str] = mapped_column(String(150), nullable=False)
    cnpj: Mapped[str] = mapped_column(String(14), nullable=False, unique=True, index=True)
    telefone: Mapped[str] = mapped_column(String(20), nullable=False)
    validado: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=text("false"),
    )
    logo_url: Mapped[str | None] = mapped_column(String(255))
    criado_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
    )
    atualizado_em: Mapped[datetime | None] = mapped_column(DateTime)
