"""adiciona categorias e tags em itens_cardapio

Revision ID: 7a1c5e9d3f4b
Revises: 4f2d6b8c7a9e
Create Date: 2026-06-23 11:30:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "7a1c5e9d3f4b"
down_revision: str | None = "4f2d6b8c7a9e"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


tag_item_cardapio_enum = postgresql.ENUM(
    "LOW_CARB",
    "ALTO_EM_PROTEINA",
    "VEGANO",
    "VEGETARIANO",
    "ZERO_LACTOSE",
    "ZERO_GLUTEN",
    "SEM_ACUCAR",
    name="tag_item_cardapio_enum",
    create_type=False,
)


def upgrade() -> None:
    bind = op.get_bind()
    tag_item_cardapio_enum.create(bind, checkfirst=True)

    op.create_table(
        "categorias_cardapio",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("nome", sa.VARCHAR(length=80), nullable=False),
        sa.CheckConstraint("length(trim(nome)) > 0", name=op.f("categorias_cardapio_nome_nao_vazio")),
        sa.PrimaryKeyConstraint("id", name=op.f("categorias_cardapio_pkey")),
        sa.UniqueConstraint("nome", name=op.f("categorias_cardapio_nome_key")),
    )

    bind.execute(
        sa.text(
            """
            INSERT INTO categorias_cardapio (nome)
            VALUES
                ('SEM_CATEGORIA'),
                ('MARMITA'),
                ('BEBIDA'),
                ('SOBREMESA'),
                ('LANCHE')
            """
        )
    )

    categoria_padrao_id = bind.execute(
        sa.text(
            """
            SELECT id
            FROM categorias_cardapio
            WHERE nome = 'SEM_CATEGORIA'
            """
        )
    ).scalar_one()

    op.add_column(
        "itens_cardapio",
        sa.Column("categoria_id", sa.BIGINT(), nullable=True),
    )
    op.execute(
        sa.text(
            """
            UPDATE itens_cardapio
            SET categoria_id = :categoria_padrao_id
            WHERE categoria_id IS NULL
            """
        ).bindparams(categoria_padrao_id=categoria_padrao_id)
    )
    op.alter_column("itens_cardapio", "categoria_id", nullable=False)
    op.create_foreign_key(
        op.f("itens_cardapio_categoria_id_fkey"),
        "itens_cardapio",
        "categorias_cardapio",
        ["categoria_id"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_index(op.f("idx_itens_categoria_id"), "itens_cardapio", ["categoria_id"], unique=False)

    op.create_table(
        "itens_cardapio_tags",
        sa.Column("item_cardapio_id", sa.BIGINT(), nullable=False),
        sa.Column("tag", tag_item_cardapio_enum, nullable=False),
        sa.ForeignKeyConstraint(
            ["item_cardapio_id"],
            ["itens_cardapio.id"],
            name=op.f("itens_cardapio_tags_item_cardapio_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("item_cardapio_id", "tag", name=op.f("itens_cardapio_tags_pkey")),
    )
    op.create_index(op.f("idx_itens_cardapio_tags_tag"), "itens_cardapio_tags", ["tag"], unique=False)


def downgrade() -> None:
    raise NotImplementedError("Downgrade nao suportado para evitar operacoes destrutivas.")
