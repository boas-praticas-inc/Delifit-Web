from datetime import datetime

from sqlalchemy import BigInteger, CheckConstraint, DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


status_solicitacao_pg_enum = ENUM(
    "EM_ANALISE",
    "APROVADO",
    "REPROVADO",
    name="status_solicitacao_adesao_enum",
    create_type=False,
)


class SolicitacaoAdesaoRestauranteModel(Base):
    __tablename__ = "solicitacoes_adesao_restaurante"
    __table_args__ = (
        CheckConstraint("cnpj ~ '^[0-9]{14}$'", name="chk_solicitacoes_cnpj_numerico"),
        CheckConstraint("cep ~ '^[0-9]{8}$'", name="chk_solicitacoes_cep_numerico"),
        CheckConstraint("length(trim(estado)) = 2", name="chk_solicitacoes_estado_maiusculo"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    gestor_id: Mapped[int] = mapped_column(BigInteger, nullable=False, index=True)
    nome_fantasia: Mapped[str] = mapped_column(String(150), nullable=False)
    razao_social: Mapped[str] = mapped_column(String(150), nullable=False)
    cnpj: Mapped[str] = mapped_column(String(14), nullable=False, unique=True, index=True)
    telefone: Mapped[str] = mapped_column(String(20), nullable=False)
    descricao: Mapped[str | None] = mapped_column(Text)
    foto_url: Mapped[str | None] = mapped_column(Text)
    cep: Mapped[str] = mapped_column(String(8), nullable=False)
    logradouro: Mapped[str] = mapped_column(String(150), nullable=False)
    numero: Mapped[str] = mapped_column(String(20), nullable=False)
    bairro: Mapped[str] = mapped_column(String(100), nullable=False)
    cidade: Mapped[str] = mapped_column(String(100), nullable=False)
    estado: Mapped[str] = mapped_column(String(2), nullable=False)
    complemento: Mapped[str | None] = mapped_column(String(100))
    referencia: Mapped[str | None] = mapped_column(String(150))
    status_solicitacao: Mapped[str] = mapped_column(
        status_solicitacao_pg_enum,
        nullable=False,
        server_default="EM_ANALISE",
    )
    motivo_reprovacao: Mapped[str | None] = mapped_column(Text)
    criado_em: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.current_timestamp())
    analisado_em: Mapped[datetime | None] = mapped_column(DateTime)
    analisado_por_admin_id: Mapped[int | None] = mapped_column(BigInteger)

