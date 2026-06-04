from datetime import datetime

from sqlalchemy import BigInteger, CheckConstraint, DateTime, String, func
from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.domain.enums.usuario_enums import StatusUsuarioEnum, TipoUsuarioEnum


tipo_usuario_pg_enum = ENUM(
    TipoUsuarioEnum,
    name="tipo_usuario_enum",
    values_callable=lambda enum_cls: [item.value for item in enum_cls],
    create_type=False,
)

status_usuario_pg_enum = ENUM(
    StatusUsuarioEnum,
    name="status_usuario_enum",
    values_callable=lambda enum_cls: [item.value for item in enum_cls],
    create_type=False,
)


class UsuarioModel(Base):
    __tablename__ = "usuarios"
    __table_args__ = (
        CheckConstraint("length(trim(email)) > 0", name="usuarios_email_nao_vazio"),
        CheckConstraint("length(trim(senha_hash)) > 0", name="usuarios_senha_hash_nao_vazia"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(150), nullable=False, unique=True, index=True)
    senha_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    tipo_usuario: Mapped[TipoUsuarioEnum] = mapped_column(
        tipo_usuario_pg_enum,
        nullable=False,
        index=True,
    )
    status: Mapped[StatusUsuarioEnum] = mapped_column(
        status_usuario_pg_enum,
        nullable=False,
        default=StatusUsuarioEnum.ATIVO,
        server_default=StatusUsuarioEnum.ATIVO.value,
    )
    criado_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
    )
    atualizado_em: Mapped[datetime | None] = mapped_column(DateTime)
