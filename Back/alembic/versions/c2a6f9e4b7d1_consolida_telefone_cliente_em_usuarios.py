"""consolida telefone do cliente em usuarios

Revision ID: c2a6f9e4b7d1
Revises: b1f4c7d9e2a3
Create Date: 2026-06-25 19:10:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "c2a6f9e4b7d1"
down_revision: str | None = "b1f4c7d9e2a3"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    colunas_clientes = {coluna["name"] for coluna in inspector.get_columns("clientes")}
    checks_usuarios = {
        constraint["name"]
        for constraint in inspector.get_check_constraints("usuarios")
        if constraint["name"]
    }

    if "telefone" in colunas_clientes:
        op.execute(
            """
            UPDATE usuarios
            SET telefone = clientes.telefone
            FROM clientes
            WHERE clientes.usuario_id = usuarios.id
              AND usuarios.tipo_usuario = 'CLIENTE'
              AND usuarios.telefone IS NULL
            """
        )
        op.drop_column("clientes", "telefone")

    if "usuarios_credencial_login_obrigatoria" in checks_usuarios:
        op.drop_constraint(
            op.f("usuarios_credencial_login_obrigatoria"),
            "usuarios",
            type_="check",
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
    raise NotImplementedError("Downgrade nao suportado para evitar perda de dados.")
