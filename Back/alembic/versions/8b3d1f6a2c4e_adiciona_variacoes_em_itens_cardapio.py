"""adiciona variacoes em itens_cardapio

Revision ID: 8b3d1f6a2c4e
Revises: 7a1c5e9d3f4b
Create Date: 2026-06-23 21:45:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "8b3d1f6a2c4e"
down_revision: str | None = "7a1c5e9d3f4b"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


tamanho_item_pg_enum = postgresql.ENUM(
    "PEQUENO",
    "MEDIO",
    "GRANDE",
    name="tamanho_item_enum",
    create_type=False,
)


def upgrade() -> None:
    op.create_table(
        "variacoes_item_cardapio",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("item_cardapio_id", sa.BIGINT(), nullable=False),
        sa.Column("tamanho", tamanho_item_pg_enum, nullable=False),
        sa.Column("preco", sa.Numeric(10, 2), nullable=False),
        sa.Column("carboidratos", sa.Numeric(10, 2), nullable=False),
        sa.Column("gorduras", sa.Numeric(10, 2), nullable=False),
        sa.Column("proteina", sa.Numeric(10, 2), nullable=False),
        sa.Column("caloria", sa.Numeric(10, 2), nullable=False),
        sa.Column(
            "criado_em",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "atualizado_em",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.CheckConstraint("preco >= 0::numeric", name=op.f("chk_variacoes_item_preco_positivo")),
        sa.CheckConstraint(
            "carboidratos >= 0::numeric",
            name=op.f("chk_variacoes_item_carboidratos_positivo"),
        ),
        sa.CheckConstraint(
            "gorduras >= 0::numeric",
            name=op.f("chk_variacoes_item_gorduras_positivo"),
        ),
        sa.CheckConstraint(
            "proteina >= 0::numeric",
            name=op.f("chk_variacoes_item_proteina_positivo"),
        ),
        sa.CheckConstraint(
            "caloria >= 0::numeric",
            name=op.f("chk_variacoes_item_caloria_positivo"),
        ),
        sa.ForeignKeyConstraint(
            ["item_cardapio_id"],
            ["itens_cardapio.id"],
            name=op.f("variacoes_item_cardapio_item_cardapio_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("variacoes_item_cardapio_pkey")),
        sa.UniqueConstraint(
            "item_cardapio_id",
            "tamanho",
            name=op.f("variacoes_item_cardapio_item_cardapio_id_tamanho_key"),
        ),
    )
    op.create_index(
        op.f("idx_variacoes_item_cardapio_item_cardapio_id"),
        "variacoes_item_cardapio",
        ["item_cardapio_id"],
        unique=False,
    )
    op.create_index(
        op.f("idx_variacoes_item_cardapio_tamanho"),
        "variacoes_item_cardapio",
        ["tamanho"],
        unique=False,
    )

    op.execute(
        sa.text(
            """
            INSERT INTO variacoes_item_cardapio (
                item_cardapio_id,
                tamanho,
                preco,
                carboidratos,
                gorduras,
                proteina,
                caloria,
                criado_em,
                atualizado_em
            )
            SELECT
                itens_cardapio.id,
                itens_cardapio.tamanho,
                itens_cardapio.preco,
                itens_cardapio.carboidratos,
                itens_cardapio.gorduras,
                itens_cardapio.proteina,
                itens_cardapio.caloria,
                itens_cardapio.criado_em,
                itens_cardapio.atualizado_em
            FROM itens_cardapio
            """
        )
    )


def downgrade() -> None:
    raise NotImplementedError("Downgrade nao suportado para evitar operacoes destrutivas.")
