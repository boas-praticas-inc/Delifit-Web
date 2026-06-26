from datetime import datetime

from sqlalchemy import BigInteger, CheckConstraint, DateTime, String, func, text
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
        CheckConstraint(
            "email IS NULL OR length(trim(email)) > 0",
            name="usuarios_email_nao_vazio",
        ),
        CheckConstraint(
            "telefone IS NULL OR length(trim(telefone)) > 0",
            name="usuarios_telefone_nao_vazio",
        ),
        CheckConstraint("length(trim(senha_hash)) > 0", name="usuarios_senha_hash_nao_vazia"),
        CheckConstraint(
            "("
            "tipo_usuario = 'CLIENTE' AND telefone IS NOT NULL"
            ") OR ("
            "tipo_usuario IN ('GESTOR', 'ADMIN') AND email IS NOT NULL"
            ")",
            name="usuarios_credencial_login_obrigatoria",
        ),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    email: Mapped[str | None] = mapped_column(String(150), nullable=True, unique=True, index=True)
    telefone: Mapped[str | None] = mapped_column(String(20), nullable=True, unique=True, index=True)
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
        server_default=text("'ATIVO'::status_usuario_enum"),
    )
    criado_em: Mapped[datetime] = mapped_column(
        "data_cadastro",
        DateTime,
        nullable=False,
        server_default=func.current_timestamp(),
    )
    atualizado_em: Mapped[datetime | None] = mapped_column("ultimo_login_em", DateTime)
