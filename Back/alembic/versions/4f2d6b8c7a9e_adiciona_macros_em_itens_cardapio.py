"""adiciona macronutrientes em itens_cardapio

Revision ID: 4f2d6b8c7a9e
Revises: 6d4f8c9a1b2e
Create Date: 2026-06-22 10:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "4f2d6b8c7a9e"
down_revision: str | None = "6d4f8c9a1b2e"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "itens_cardapio",
        sa.Column("carboidratos", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
    )
    op.add_column(
        "itens_cardapio",
        sa.Column("gorduras", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
    )
    op.add_column(
        "itens_cardapio",
        sa.Column("proteina", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
    )
    op.add_column(
        "itens_cardapio",
        sa.Column("caloria", sa.Numeric(10, 2), nullable=False, server_default=sa.text("0")),
    )
    op.create_check_constraint(
        op.f("chk_itens_carboidratos_positivo"),
        "itens_cardapio",
        "carboidratos >= 0::numeric",
    )
    op.create_check_constraint(
        op.f("chk_itens_gorduras_positivo"),
        "itens_cardapio",
        "gorduras >= 0::numeric",
    )
    op.create_check_constraint(
        op.f("chk_itens_proteina_positivo"),
        "itens_cardapio",
        "proteina >= 0::numeric",
    )
    op.create_check_constraint(
        op.f("chk_itens_caloria_positivo"),
        "itens_cardapio",
        "caloria >= 0::numeric",
    )
    op.execute("UPDATE itens_cardapio SET tamanho = 'MEDIO' WHERE tamanho IS NULL")
    op.alter_column(
        "itens_cardapio",
        "tamanho",
        existing_type=sa.Enum("PEQUENO", "MEDIO", "GRANDE", name="tamanho_item_enum"),
        nullable=False,
    )
    op.alter_column("itens_cardapio", "carboidratos", server_default=None)
    op.alter_column("itens_cardapio", "gorduras", server_default=None)
    op.alter_column("itens_cardapio", "proteina", server_default=None)
    op.alter_column("itens_cardapio", "caloria", server_default=None)


def downgrade() -> None:
    op.alter_column(
        "itens_cardapio",
        "tamanho",
        existing_type=sa.Enum("PEQUENO", "MEDIO", "GRANDE", name="tamanho_item_enum"),
        nullable=True,
    )
    op.drop_constraint(op.f("chk_itens_caloria_positivo"), "itens_cardapio", type_="check")
    op.drop_constraint(op.f("chk_itens_proteina_positivo"), "itens_cardapio", type_="check")
    op.drop_constraint(op.f("chk_itens_gorduras_positivo"), "itens_cardapio", type_="check")
    op.drop_constraint(op.f("chk_itens_carboidratos_positivo"), "itens_cardapio", type_="check")
    op.drop_column("itens_cardapio", "caloria")
    op.drop_column("itens_cardapio", "proteina")
    op.drop_column("itens_cardapio", "gorduras")
    op.drop_column("itens_cardapio", "carboidratos")
