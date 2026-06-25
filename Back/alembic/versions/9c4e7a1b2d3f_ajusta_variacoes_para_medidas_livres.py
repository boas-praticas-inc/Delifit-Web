"""ajusta variacoes para medidas livres

Revision ID: 9c4e7a1b2d3f
Revises: 8b3d1f6a2c4e
Create Date: 2026-06-24 10:15:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "9c4e7a1b2d3f"
down_revision: str | None = "8b3d1f6a2c4e"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    colunas = {coluna["name"] for coluna in inspector.get_columns("variacoes_item_cardapio")}
    indices = {indice["name"] for indice in inspector.get_indexes("variacoes_item_cardapio")}
    uniques = {
        constraint["name"]
        for constraint in inspector.get_unique_constraints("variacoes_item_cardapio")
        if constraint["name"]
    }
    checks = {
        constraint["name"]
        for constraint in inspector.get_check_constraints("variacoes_item_cardapio")
        if constraint["name"]
    }

    if "tamanho" in colunas and "descricao_variacao" not in colunas:
        op.alter_column(
            "variacoes_item_cardapio",
            "tamanho",
            new_column_name="descricao_variacao",
            existing_type=sa.String(length=7),
        )
        colunas.remove("tamanho")
        colunas.add("descricao_variacao")

    op.alter_column(
        "variacoes_item_cardapio",
        "descricao_variacao",
        existing_type=sa.Enum("PEQUENO", "MEDIO", "GRANDE", name="tamanho_item_enum"),
        type_=sa.String(length=30),
        postgresql_using="descricao_variacao::text",
    )

    if "quantidade" not in colunas:
        op.add_column(
            "variacoes_item_cardapio",
            sa.Column("quantidade", sa.Numeric(10, 2), nullable=True),
        )

    if "unidade_medida" not in colunas:
        op.add_column(
            "variacoes_item_cardapio",
            sa.Column("unidade_medida", sa.String(length=10), nullable=True),
        )

    if "idx_variacoes_item_cardapio_tamanho" in indices:
        op.drop_index("idx_variacoes_item_cardapio_tamanho", table_name="variacoes_item_cardapio")

    if "variacoes_item_cardapio_item_cardapio_id_tamanho_key" in uniques:
        op.drop_constraint(
            "variacoes_item_cardapio_item_cardapio_id_tamanho_key",
            "variacoes_item_cardapio",
            type_="unique",
        )

    if "idx_variacoes_item_cardapio_unidade_medida" not in indices:
        op.create_index(
            op.f("idx_variacoes_item_cardapio_unidade_medida"),
            "variacoes_item_cardapio",
            ["unidade_medida"],
            unique=False,
        )

    if "variacoes_item_cardapio_item_cardapio_id_descricao_variacao_key" not in uniques:
        op.create_unique_constraint(
            op.f("variacoes_item_cardapio_item_cardapio_id_descricao_variacao_key"),
            "variacoes_item_cardapio",
            ["item_cardapio_id", "descricao_variacao"],
        )

    if "variacoes_item_descricao_nao_vazia" not in checks:
        op.create_check_constraint(
            op.f("variacoes_item_descricao_nao_vazia"),
            "variacoes_item_cardapio",
            "length(trim(descricao_variacao)) > 0",
        )

    if "chk_variacoes_item_quantidade_positiva" not in checks:
        op.create_check_constraint(
            op.f("chk_variacoes_item_quantidade_positiva"),
            "variacoes_item_cardapio",
            "quantidade IS NULL OR quantidade > 0::numeric",
        )

    if "chk_variacoes_item_quantidade_unidade_consistentes" not in checks:
        op.create_check_constraint(
            op.f("chk_variacoes_item_quantidade_unidade_consistentes"),
            "variacoes_item_cardapio",
            "(quantidade IS NULL AND unidade_medida IS NULL) OR "
            "(quantidade IS NOT NULL AND unidade_medida IS NOT NULL)",
        )

    if "chk_variacoes_item_unidade_medida_valida" not in checks:
        op.create_check_constraint(
            op.f("chk_variacoes_item_unidade_medida_valida"),
            "variacoes_item_cardapio",
            "unidade_medida IS NULL OR unidade_medida IN ('G', 'KG', 'ML', 'L', 'UNIDADE')",
        )


def downgrade() -> None:
    raise NotImplementedError("Downgrade nao suportado para evitar operacoes destrutivas.")
