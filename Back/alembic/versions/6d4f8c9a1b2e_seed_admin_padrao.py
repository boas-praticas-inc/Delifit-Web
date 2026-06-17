"""seed admin padrao

Revision ID: 6d4f8c9a1b2e
Revises: e0b74279718b
Create Date: 2026-06-17 18:30:00.000000
"""

from collections.abc import Sequence

from alembic import op

revision: str = "6d4f8c9a1b2e"
down_revision: str | None = "e0b74279718b"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


ADMIN_EMAIL = "admin@delifit.com"
ADMIN_NOME = "Administrador Delifit"
ADMIN_CARGO = "Administrador do sistema"
ADMIN_SENHA_HASH = "$2b$12$NXYYZyIEHu8iut2yFTOnKe5hK35.hxl6Sq76TeRmpJ/CN43cGQHBS"


def upgrade() -> None:
    op.execute(
        f"""
        INSERT INTO usuarios (email, senha_hash, tipo_usuario, status)
        SELECT '{ADMIN_EMAIL}', '{ADMIN_SENHA_HASH}', 'ADMIN', 'ATIVO'
        WHERE NOT EXISTS (
            SELECT 1
            FROM usuarios
            WHERE email = '{ADMIN_EMAIL}'
        );
        """
    )

    op.execute(
        f"""
        INSERT INTO admins (usuario_id, nome_completo, cargo)
        SELECT usuarios.id, '{ADMIN_NOME}', '{ADMIN_CARGO}'
        FROM usuarios
        WHERE usuarios.email = '{ADMIN_EMAIL}'
          AND NOT EXISTS (
              SELECT 1
              FROM admins
              WHERE admins.usuario_id = usuarios.id
          );
        """
    )


def downgrade() -> None:
    op.execute(
        f"""
        DELETE FROM admins
        WHERE usuario_id IN (
            SELECT id
            FROM usuarios
            WHERE email = '{ADMIN_EMAIL}'
        );
        """
    )

    op.execute(
        f"""
        DELETE FROM usuarios
        WHERE email = '{ADMIN_EMAIL}';
        """
    )
