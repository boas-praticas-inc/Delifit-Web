from datetime import datetime

from sqlalchemy import BigInteger, CheckConstraint, DateTime, String, func
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

status_restaurante_pg_enum = ENUM(
    "ATIVO",
    "INATIVO",
    "BLOQUEADO",
    name="status_restaurante_enum",
    create_type=False,
)


class RestauranteModel(Base):
    __tablename__ = "restaurantes"
    __table_args__ = (
        CheckConstraint("length(trim(nome_fantasia)) > 0", name="restaurantes_nome_fantasia_nao_vazio"),
        CheckConstraint("length(trim(razao_social)) > 0", name="restaurantes_razao_social_nao_vazia"),
        CheckConstraint("length(trim(telefone)) > 0", name="restaurantes_telefone_nao_vazio"),
        CheckConstraint("cnpj ~ '^[0-9]{14}$'", name="restaurantes_cnpj_numerico"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    gestor_id: Mapped[int] = mapped_column(BigInteger, nullable=False, unique=True, index=True)
    endereco_id: Mapped[int] = mapped_column(BigInteger, nullable=False, unique=True, index=True)
    solicitacao_adesao_id: Mapped[int | None] = mapped_column(BigInteger, unique=True)
    nome_fantasia: Mapped[str] = mapped_column(String(120), nullable=False)
    razao_social: Mapped[str] = mapped_column(String(150), nullable=False)
    cnpj: Mapped[str] = mapped_column(String(14), nullable=False, unique=True, index=True)
    telefone: Mapped[str] = mapped_column(String(20), nullable=False)
    descricao: Mapped[str | None] = mapped_column(String)
    foto_url: Mapped[str | None] = mapped_column(String)
    status: Mapped[str] = mapped_column(
        status_restaurante_pg_enum,
        nullable=False,
        server_default="ATIVO",
    )
    criado_em: Mapped[datetime] = mapped_column(
        "data_cadastro",
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
    )
