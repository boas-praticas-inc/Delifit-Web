"""adiciona variacoes em itens_cardapio

Revision ID: 8b3d1f6a2c4e
Revises: 7a1c5e9d3f4b
Create Date: 2026-06-23 21:45:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "8b3d1f6a2c4e"
down_revision: str | None = "7a1c5e9d3f4b"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "variacoes_item_cardapio",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("item_cardapio_id", sa.BIGINT(), nullable=False),
        sa.Column("descricao_variacao", sa.VARCHAR(length=30), nullable=False),
        sa.Column("quantidade", sa.Numeric(10, 2), nullable=True),
        sa.Column("unidade_medida", sa.VARCHAR(length=10), nullable=True),
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
        sa.CheckConstraint(
            "length(trim(descricao_variacao)) > 0",
            name=op.f("variacoes_item_descricao_nao_vazia"),
        ),
        sa.CheckConstraint(
            "quantidade IS NULL OR quantidade > 0::numeric",
            name=op.f("chk_variacoes_item_quantidade_positiva"),
        ),
        sa.CheckConstraint(
            "(quantidade IS NULL AND unidade_medida IS NULL) OR "
            "(quantidade IS NOT NULL AND unidade_medida IS NOT NULL)",
            name=op.f("chk_variacoes_item_quantidade_unidade_consistentes"),
        ),
        sa.CheckConstraint(
            "unidade_medida IS NULL OR unidade_medida IN ('G', 'KG', 'ML', 'L', 'UNIDADE')",
            name=op.f("chk_variacoes_item_unidade_medida_valida"),
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
            "descricao_variacao",
            name=op.f("variacoes_item_cardapio_item_cardapio_id_descricao_variacao_key"),
        ),
    )
    op.create_index(
        op.f("idx_variacoes_item_cardapio_item_cardapio_id"),
        "variacoes_item_cardapio",
        ["item_cardapio_id"],
        unique=False,
    )
    op.create_index(
        op.f("idx_variacoes_item_cardapio_unidade_medida"),
        "variacoes_item_cardapio",
        ["unidade_medida"],
        unique=False,
    )

    op.execute(
        sa.text(
            """
            INSERT INTO variacoes_item_cardapio (
                item_cardapio_id,
                descricao_variacao,
                quantidade,
                unidade_medida,
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
                NULL,
                NULL,
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
