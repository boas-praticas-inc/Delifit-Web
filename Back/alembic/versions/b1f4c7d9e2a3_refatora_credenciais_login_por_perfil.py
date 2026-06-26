"""refatora credenciais de login por perfil

Revision ID: b1f4c7d9e2a3
Revises: 9c4e7a1b2d3f
Create Date: 2026-06-25 17:10:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "b1f4c7d9e2a3"
down_revision: str | None = "9c4e7a1b2d3f"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("usuarios", sa.Column("telefone", sa.String(length=20), nullable=True))

    op.execute(
        """
        UPDATE usuarios
        SET telefone = clientes.telefone
        FROM clientes
        WHERE clientes.usuario_id = usuarios.id
          AND usuarios.tipo_usuario = 'CLIENTE'
        """
    )

    op.alter_column(
        "usuarios",
        "email",
        existing_type=sa.String(length=150),
        nullable=True,
    )

    op.drop_column("clientes", "telefone")

    op.create_index(op.f("ix_usuarios_telefone"), "usuarios", ["telefone"], unique=True)

    op.drop_constraint(op.f("usuarios_email_nao_vazio"), "usuarios", type_="check")
    op.create_check_constraint(
        op.f("usuarios_email_nao_vazio"),
        "usuarios",
        "email IS NULL OR length(trim(email)) > 0",
    )

    op.create_check_constraint(
        op.f("usuarios_telefone_nao_vazio"),
        "usuarios",
        "telefone IS NULL OR length(trim(telefone)) > 0",
    )

    op.create_check_constraint(
        op.f("usuarios_credencial_login_obrigatoria"),
        "usuarios",
        "("
        "tipo_usuario = 'CLIENTE' AND telefone IS NOT NULL"
        ") OR ("
        "tipo_usuario IN ('GESTOR', 'ADMIN') AND email IS NOT NULL"
        ")",
    )


def downgrade() -> None:
    raise NotImplementedError("Downgrade nao suportado para evitar perda de credenciais.")
