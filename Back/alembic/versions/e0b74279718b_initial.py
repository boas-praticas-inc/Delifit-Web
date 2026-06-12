"""initial

Revision ID: e0b74279718b
Revises:
Create Date: 2026-06-12 12:44:08.924280
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "e0b74279718b"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    tipo_usuario_enum = postgresql.ENUM(
        "CLIENTE",
        "GESTOR",
        "ADMIN",
        name="tipo_usuario_enum",
        create_type=False,
    )
    status_usuario_enum = postgresql.ENUM(
        "ATIVO",
        "INATIVO",
        "BLOQUEADO",
        name="status_usuario_enum",
        create_type=False,
    )
    tamanho_item_enum = postgresql.ENUM(
        "PEQUENO",
        "MEDIO",
        "GRANDE",
        name="tamanho_item_enum",
        create_type=False,
    )
    status_item_enum = postgresql.ENUM(
        "ATIVO",
        "INDISPONIVEL",
        "INATIVO",
        "ARQUIVADO",
        name="status_item_enum",
        create_type=False,
    )
    status_mensalidade_enum = postgresql.ENUM(
        "PENDENTE",
        "PAGA",
        "ATRASADA",
        name="status_mensalidade_restaurante_enum",
        create_type=False,
    )
    status_chat_enum = postgresql.ENUM(
        "ABERTO",
        "FECHADO",
        name="status_chat_enum",
        create_type=False,
    )
    status_restaurante_enum = postgresql.ENUM(
        "ATIVO",
        "INATIVO",
        "BLOQUEADO",
        name="status_restaurante_enum",
        create_type=False,
    )
    status_solicitacao_enum = postgresql.ENUM(
        "EM_ANALISE",
        "APROVADO",
        "REPROVADO",
        name="status_solicitacao_adesao_enum",
        create_type=False,
    )
    dia_semana_enum = postgresql.ENUM(
        "DOMINGO",
        "SEGUNDA",
        "TERCA",
        "QUARTA",
        "QUINTA",
        "SEXTA",
        "SABADO",
        name="dia_semana_enum",
        create_type=False,
    )
    status_pagamento_enum = postgresql.ENUM(
        "PENDENTE",
        "PAGO",
        "FALHOU",
        "ESTORNADO",
        name="status_pagamento_pedido_enum",
        create_type=False,
    )
    forma_pagamento_enum = postgresql.ENUM(
        "PIX",
        "CARTAO_CREDITO",
        "CARTAO_DEBITO",
        "DINHEIRO",
        name="forma_pagamento_enum",
        create_type=False,
    )
    remetente_mensagem_enum = postgresql.ENUM(
        "CLIENTE",
        "RESTAURANTE",
        name="remetente_mensagem_enum",
        create_type=False,
    )
    status_pedido_enum = postgresql.ENUM(
        "PENDENTE",
        "CONFIRMADO",
        "EM_PREPARO",
        "PRONTO",
        "SAIU_PARA_ENTREGA",
        "ENTREGUE",
        "CANCELADO",
        name="status_pedido_enum",
        create_type=False,
    )

    bind = op.get_bind()
    for enum_type in (
        tipo_usuario_enum,
        status_usuario_enum,
        tamanho_item_enum,
        status_item_enum,
        status_mensalidade_enum,
        status_chat_enum,
        status_restaurante_enum,
        status_solicitacao_enum,
        dia_semana_enum,
        status_pagamento_enum,
        forma_pagamento_enum,
        remetente_mensagem_enum,
        status_pedido_enum,
    ):
        enum_type.create(bind, checkfirst=True)

    op.create_table(
        "usuarios",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("senha_hash", sa.String(length=255), nullable=False),
        sa.Column("tipo_usuario", tipo_usuario_enum, nullable=False),
        sa.Column(
            "status",
            status_usuario_enum,
            server_default=sa.text("'ATIVO'::status_usuario_enum"),
            nullable=False,
        ),
        sa.Column(
            "data_cadastro",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column("ultimo_login_em", postgresql.TIMESTAMP(), nullable=True),
        sa.CheckConstraint("length(trim(email)) > 0", name=op.f("usuarios_email_nao_vazio")),
        sa.CheckConstraint("length(trim(senha_hash)) > 0", name=op.f("usuarios_senha_hash_nao_vazia")),
        sa.PrimaryKeyConstraint("id", name=op.f("usuarios_pkey")),
    )
    op.create_index(op.f("ix_usuarios_email"), "usuarios", ["email"], unique=True)
    op.create_index(op.f("ix_usuarios_tipo_usuario"), "usuarios", ["tipo_usuario"], unique=False)

    op.create_table(
        "admins",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("usuario_id", sa.BIGINT(), nullable=False),
        sa.Column("nome_completo", sa.VARCHAR(length=150), nullable=False),
        sa.Column("cargo", sa.VARCHAR(length=100), nullable=True),
        sa.ForeignKeyConstraint(["usuario_id"], ["usuarios.id"], name=op.f("admins_usuario_id_fkey"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("admins_pkey")),
        sa.UniqueConstraint("usuario_id", name=op.f("admins_usuario_id_key"), postgresql_nulls_not_distinct=False),
    )

    op.create_table(
        "clientes",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("usuario_id", sa.BIGINT(), nullable=False),
        sa.Column("nome_completo", sa.VARCHAR(length=150), nullable=False),
        sa.Column("cpf", sa.CHAR(length=11), nullable=False),
        sa.Column("telefone", sa.VARCHAR(length=20), nullable=False),
        sa.Column("data_nascimento", sa.DATE(), nullable=True),
        sa.CheckConstraint("cpf ~ '^[0-9]{11}$'::text", name=op.f("chk_clientes_cpf_numerico")),
        sa.ForeignKeyConstraint(["usuario_id"], ["usuarios.id"], name=op.f("clientes_usuario_id_fkey"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("clientes_pkey")),
        sa.UniqueConstraint("cpf", name=op.f("clientes_cpf_key"), postgresql_nulls_not_distinct=False),
        sa.UniqueConstraint("usuario_id", name=op.f("clientes_usuario_id_key"), postgresql_nulls_not_distinct=False),
    )

    op.create_table(
        "gestores",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("usuario_id", sa.BIGINT(), nullable=False),
        sa.Column("nome_completo", sa.VARCHAR(length=150), nullable=False),
        sa.Column("cpf", sa.CHAR(length=11), nullable=False),
        sa.Column("telefone", sa.VARCHAR(length=20), nullable=False),
        sa.CheckConstraint("cpf ~ '^[0-9]{11}$'::text", name=op.f("chk_gestores_cpf_numerico")),
        sa.ForeignKeyConstraint(["usuario_id"], ["usuarios.id"], name=op.f("gestores_usuario_id_fkey"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("gestores_pkey")),
        sa.UniqueConstraint("cpf", name=op.f("gestores_cpf_key"), postgresql_nulls_not_distinct=False),
        sa.UniqueConstraint("usuario_id", name=op.f("gestores_usuario_id_key"), postgresql_nulls_not_distinct=False),
    )

    op.create_table(
        "enderecos",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("cep", sa.CHAR(length=8), nullable=False),
        sa.Column("logradouro", sa.VARCHAR(length=150), nullable=False),
        sa.Column("numero", sa.VARCHAR(length=20), nullable=False),
        sa.Column("bairro", sa.VARCHAR(length=100), nullable=False),
        sa.Column("cidade", sa.VARCHAR(length=100), nullable=False),
        sa.Column("estado", sa.CHAR(length=2), nullable=False),
        sa.Column("complemento", sa.VARCHAR(length=100), nullable=True),
        sa.Column("referencia", sa.VARCHAR(length=150), nullable=True),
        sa.Column("label", sa.VARCHAR(length=50), nullable=True),
        sa.Column("cliente_id", sa.BIGINT(), nullable=True),
        sa.CheckConstraint("cep ~ '^[0-9]{8}$'::text", name=op.f("chk_enderecos_cep_numerico")),
        sa.CheckConstraint("estado ~ '^[A-Z]{2}$'::text", name=op.f("chk_enderecos_estado_maiusculo")),
        sa.ForeignKeyConstraint(["cliente_id"], ["clientes.id"], name=op.f("enderecos_cliente_id_fkey"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("enderecos_pkey")),
    )
    op.create_index(op.f("idx_enderecos_cliente_id"), "enderecos", ["cliente_id"], unique=False)

    op.create_table(
        "solicitacoes_adesao_restaurante",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("gestor_id", sa.BIGINT(), nullable=False),
        sa.Column("nome_fantasia", sa.VARCHAR(length=150), nullable=False),
        sa.Column("razao_social", sa.VARCHAR(length=150), nullable=False),
        sa.Column("cnpj", sa.CHAR(length=14), nullable=False),
        sa.Column("telefone", sa.VARCHAR(length=20), nullable=False),
        sa.Column("descricao", sa.TEXT(), nullable=True),
        sa.Column("foto_url", sa.TEXT(), nullable=True),
        sa.Column("cep", sa.CHAR(length=8), nullable=False),
        sa.Column("logradouro", sa.VARCHAR(length=150), nullable=False),
        sa.Column("numero", sa.VARCHAR(length=20), nullable=False),
        sa.Column("bairro", sa.VARCHAR(length=100), nullable=False),
        sa.Column("cidade", sa.VARCHAR(length=100), nullable=False),
        sa.Column("estado", sa.CHAR(length=2), nullable=False),
        sa.Column("complemento", sa.VARCHAR(length=100), nullable=True),
        sa.Column("referencia", sa.VARCHAR(length=150), nullable=True),
        sa.Column(
            "status_solicitacao",
            status_solicitacao_enum,
            server_default=sa.text("'EM_ANALISE'::status_solicitacao_adesao_enum"),
            nullable=False,
        ),
        sa.Column("motivo_reprovacao", sa.TEXT(), nullable=True),
        sa.Column(
            "criado_em",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column("analisado_em", postgresql.TIMESTAMP(), nullable=True),
        sa.Column("analisado_por_admin_id", sa.BIGINT(), nullable=True),
        sa.CheckConstraint("cep ~ '^[0-9]{8}$'::text", name=op.f("chk_solicitacoes_cep_numerico")),
        sa.CheckConstraint("cnpj ~ '^[0-9]{14}$'::text", name=op.f("chk_solicitacoes_cnpj_numerico")),
        sa.CheckConstraint("estado ~ '^[A-Z]{2}$'::text", name=op.f("chk_solicitacoes_estado_maiusculo")),
        sa.CheckConstraint(
            "status_solicitacao <> 'REPROVADO'::status_solicitacao_adesao_enum OR motivo_reprovacao IS NOT NULL AND length(TRIM(BOTH FROM motivo_reprovacao)) > 0",
            name=op.f("chk_solicitacoes_motivo_reprovacao"),
        ),
        sa.ForeignKeyConstraint(
            ["analisado_por_admin_id"],
            ["admins.id"],
            name=op.f("solicitacoes_adesao_restaurante_analisado_por_admin_id_fkey"),
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(
            ["gestor_id"],
            ["gestores.id"],
            name=op.f("solicitacoes_adesao_restaurante_gestor_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("solicitacoes_adesao_restaurante_pkey")),
        sa.UniqueConstraint("cnpj", name=op.f("uq_solicitacao_cnpj"), postgresql_nulls_not_distinct=False),
    )
    op.create_index(
        op.f("uq_solicitacao_em_analise_por_gestor"),
        "solicitacoes_adesao_restaurante",
        ["gestor_id"],
        unique=True,
        postgresql_where="(status_solicitacao = 'EM_ANALISE'::status_solicitacao_adesao_enum)",
    )
    op.create_index(op.f("idx_solicitacoes_status"), "solicitacoes_adesao_restaurante", ["status_solicitacao"], unique=False)
    op.create_index(op.f("idx_solicitacoes_gestor_id"), "solicitacoes_adesao_restaurante", ["gestor_id"], unique=False)

    op.create_table(
        "restaurantes",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("gestor_id", sa.BIGINT(), nullable=False),
        sa.Column("endereco_id", sa.BIGINT(), nullable=False),
        sa.Column("solicitacao_adesao_id", sa.BIGINT(), nullable=True),
        sa.Column("nome_fantasia", sa.VARCHAR(length=150), nullable=False),
        sa.Column("razao_social", sa.VARCHAR(length=150), nullable=False),
        sa.Column("cnpj", sa.CHAR(length=14), nullable=False),
        sa.Column("telefone", sa.VARCHAR(length=20), nullable=False),
        sa.Column("descricao", sa.TEXT(), nullable=True),
        sa.Column("foto_url", sa.TEXT(), nullable=True),
        sa.Column(
            "status",
            status_restaurante_enum,
            server_default=sa.text("'ATIVO'::status_restaurante_enum"),
            nullable=False,
        ),
        sa.Column(
            "data_cadastro",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.CheckConstraint("cnpj ~ '^[0-9]{14}$'::text", name=op.f("chk_restaurantes_cnpj_numerico")),
        sa.ForeignKeyConstraint(["endereco_id"], ["enderecos.id"], name=op.f("restaurantes_endereco_id_fkey"), ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["gestor_id"], ["gestores.id"], name=op.f("restaurantes_gestor_id_fkey"), ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(
            ["solicitacao_adesao_id"],
            ["solicitacoes_adesao_restaurante.id"],
            name=op.f("restaurantes_solicitacao_adesao_id_fkey"),
            ondelete="SET NULL",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("restaurantes_pkey")),
        sa.UniqueConstraint("cnpj", name=op.f("restaurantes_cnpj_key"), postgresql_nulls_not_distinct=False),
        sa.UniqueConstraint("endereco_id", name=op.f("restaurantes_endereco_id_key"), postgresql_nulls_not_distinct=False),
        sa.UniqueConstraint("gestor_id", name=op.f("restaurantes_gestor_id_key"), postgresql_nulls_not_distinct=False),
        sa.UniqueConstraint(
            "solicitacao_adesao_id",
            name=op.f("restaurantes_solicitacao_adesao_id_key"),
            postgresql_nulls_not_distinct=False,
        ),
    )
    op.create_index(op.f("idx_restaurantes_status"), "restaurantes", ["status"], unique=False)

    op.create_table(
        "horarios_atendimento",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("restaurante_id", sa.BIGINT(), nullable=False),
        sa.Column("dia_semana", dia_semana_enum, nullable=False),
        sa.Column("horario_inicio", postgresql.TIME(), nullable=False),
        sa.Column("horario_fim", postgresql.TIME(), nullable=False),
        sa.Column("ativo", sa.BOOLEAN(), server_default=sa.text("true"), nullable=False),
        sa.CheckConstraint("horario_fim > horario_inicio", name=op.f("chk_horarios_intervalo")),
        sa.ForeignKeyConstraint(
            ["restaurante_id"],
            ["restaurantes.id"],
            name=op.f("horarios_atendimento_restaurante_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("horarios_atendimento_pkey")),
        sa.UniqueConstraint(
            "restaurante_id",
            "dia_semana",
            name=op.f("uq_horario_restaurante_dia"),
            postgresql_nulls_not_distinct=False,
        ),
    )
    op.create_index(op.f("idx_horarios_restaurante_id"), "horarios_atendimento", ["restaurante_id"], unique=False)

    op.create_table(
        "itens_cardapio",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("restaurante_id", sa.BIGINT(), nullable=False),
        sa.Column("nome", sa.VARCHAR(length=150), nullable=False),
        sa.Column("descricao", sa.TEXT(), nullable=True),
        sa.Column("preco", sa.NUMERIC(precision=10, scale=2), nullable=False),
        sa.Column("tamanho", tamanho_item_enum, nullable=True),
        sa.Column(
            "status_item",
            status_item_enum,
            server_default=sa.text("'ATIVO'::status_item_enum"),
            nullable=False,
        ),
        sa.Column("foto_url", sa.TEXT(), nullable=True),
        sa.Column(
            "criado_em",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "atualizado_em",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.CheckConstraint("preco >= 0::numeric", name=op.f("chk_itens_preco_positivo")),
        sa.ForeignKeyConstraint(["restaurante_id"], ["restaurantes.id"], name=op.f("itens_cardapio_restaurante_id_fkey"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("itens_cardapio_pkey")),
    )
    op.create_index(op.f("idx_itens_status_item"), "itens_cardapio", ["status_item"], unique=False)
    op.create_index(op.f("idx_itens_restaurante_id"), "itens_cardapio", ["restaurante_id"], unique=False)

    op.create_table(
        "pagamentos_mensalidade_restaurante",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("restaurante_id", sa.BIGINT(), nullable=False),
        sa.Column("valor", sa.NUMERIC(precision=10, scale=2), nullable=False),
        sa.Column("data_vencimento", postgresql.TIMESTAMP(), nullable=False),
        sa.Column("data_pagamento", postgresql.TIMESTAMP(), nullable=True),
        sa.Column(
            "status_mensalidade",
            status_mensalidade_enum,
            server_default=sa.text("'PENDENTE'::status_mensalidade_restaurante_enum"),
            nullable=False,
        ),
        sa.Column(
            "criado_em",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.CheckConstraint("valor >= 0::numeric", name=op.f("chk_pagamentos_mensalidade_valor")),
        sa.ForeignKeyConstraint(
            ["restaurante_id"],
            ["restaurantes.id"],
            name=op.f("pagamentos_mensalidade_restaurante_restaurante_id_fkey"),
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pagamentos_mensalidade_restaurante_pkey")),
    )
    op.create_index(op.f("idx_pag_mensalidade_status"), "pagamentos_mensalidade_restaurante", ["status_mensalidade"], unique=False)
    op.create_index(op.f("idx_pag_mensalidade_restaurante_id"), "pagamentos_mensalidade_restaurante", ["restaurante_id"], unique=False)

    op.create_table(
        "pedidos",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("cliente_id", sa.BIGINT(), nullable=False),
        sa.Column("restaurante_id", sa.BIGINT(), nullable=False),
        sa.Column("endereco_entrega_id", sa.BIGINT(), nullable=False),
        sa.Column(
            "status",
            status_pedido_enum,
            server_default=sa.text("'PENDENTE'::status_pedido_enum"),
            nullable=False,
        ),
        sa.Column("forma_pagamento", forma_pagamento_enum, nullable=False),
        sa.Column("observacoes", sa.TEXT(), nullable=True),
        sa.Column("valor_subtotal", sa.NUMERIC(precision=10, scale=2), nullable=False),
        sa.Column("valor_frete", sa.NUMERIC(precision=10, scale=2), server_default=sa.text("0"), nullable=False),
        sa.Column("valor_total", sa.NUMERIC(precision=10, scale=2), nullable=False),
        sa.Column(
            "criado_em",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column("confirmado_em", postgresql.TIMESTAMP(), nullable=True),
        sa.Column("entregue_em", postgresql.TIMESTAMP(), nullable=True),
        sa.Column("cancelado_em", postgresql.TIMESTAMP(), nullable=True),
        sa.CheckConstraint("valor_frete >= 0::numeric", name=op.f("chk_pedidos_valor_frete")),
        sa.CheckConstraint("valor_subtotal >= 0::numeric", name=op.f("chk_pedidos_valor_subtotal")),
        sa.CheckConstraint("valor_total = (valor_subtotal + valor_frete)", name=op.f("chk_pedidos_total_consistente")),
        sa.CheckConstraint("valor_total >= 0::numeric", name=op.f("chk_pedidos_valor_total")),
        sa.ForeignKeyConstraint(["cliente_id"], ["clientes.id"], name=op.f("pedidos_cliente_id_fkey"), ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["endereco_entrega_id"], ["enderecos.id"], name=op.f("pedidos_endereco_entrega_id_fkey"), ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["restaurante_id"], ["restaurantes.id"], name=op.f("pedidos_restaurante_id_fkey"), ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id", name=op.f("pedidos_pkey")),
    )
    op.create_index(op.f("idx_pedidos_status"), "pedidos", ["status"], unique=False)
    op.create_index(op.f("idx_pedidos_restaurante_status_criado_em"), "pedidos", ["restaurante_id", "status", "criado_em"], unique=False)
    op.create_index(op.f("idx_pedidos_restaurante_id"), "pedidos", ["restaurante_id"], unique=False)
    op.create_index(op.f("idx_pedidos_criado_em"), "pedidos", ["criado_em"], unique=False)
    op.create_index(op.f("idx_pedidos_cliente_status_criado_em"), "pedidos", ["cliente_id", "status", "criado_em"], unique=False)
    op.create_index(op.f("idx_pedidos_cliente_id"), "pedidos", ["cliente_id"], unique=False)

    op.create_table(
        "chats",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("pedido_id", sa.BIGINT(), nullable=False),
        sa.Column(
            "status_chat",
            status_chat_enum,
            server_default=sa.text("'ABERTO'::status_chat_enum"),
            nullable=False,
        ),
        sa.Column(
            "criado_em",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column("fechado_em", postgresql.TIMESTAMP(), nullable=True),
        sa.ForeignKeyConstraint(["pedido_id"], ["pedidos.id"], name=op.f("chats_pedido_id_fkey"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("chats_pkey")),
        sa.UniqueConstraint("pedido_id", name=op.f("chats_pedido_id_key"), postgresql_nulls_not_distinct=False),
    )

    op.create_table(
        "avaliacoes",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("pedido_id", sa.BIGINT(), nullable=False),
        sa.Column("cliente_id", sa.BIGINT(), nullable=False),
        sa.Column("restaurante_id", sa.BIGINT(), nullable=False),
        sa.Column("nota", sa.NUMERIC(precision=2, scale=1), nullable=False),
        sa.Column("comentario", sa.TEXT(), nullable=True),
        sa.Column(
            "criado_em",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.CheckConstraint("nota >= 1::numeric AND nota <= 5::numeric", name=op.f("chk_avaliacoes_nota")),
        sa.ForeignKeyConstraint(["cliente_id"], ["clientes.id"], name=op.f("avaliacoes_cliente_id_fkey"), ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["pedido_id"], ["pedidos.id"], name=op.f("avaliacoes_pedido_id_fkey"), ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["restaurante_id"], ["restaurantes.id"], name=op.f("avaliacoes_restaurante_id_fkey"), ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id", name=op.f("avaliacoes_pkey")),
        sa.UniqueConstraint("pedido_id", name=op.f("avaliacoes_pedido_id_key"), postgresql_nulls_not_distinct=False),
    )
    op.create_index(op.f("idx_avaliacoes_restaurante_id"), "avaliacoes", ["restaurante_id"], unique=False)
    op.create_index(op.f("idx_avaliacoes_cliente_id"), "avaliacoes", ["cliente_id"], unique=False)

    op.create_table(
        "cartoes",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("cliente_id", sa.BIGINT(), nullable=False),
        sa.Column("nome_titular", sa.VARCHAR(length=150), nullable=False),
        sa.Column("ultimos_quatro_digitos", sa.CHAR(length=4), nullable=False),
        sa.Column("bandeira", sa.VARCHAR(length=30), nullable=False),
        sa.Column("token_gateway", sa.VARCHAR(length=255), nullable=True),
        sa.Column("padrao", sa.BOOLEAN(), server_default=sa.text("false"), nullable=False),
        sa.Column(
            "criado_em",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.CheckConstraint("ultimos_quatro_digitos ~ '^[0-9]{4}$'::text", name=op.f("chk_cartoes_ultimos_4")),
        sa.ForeignKeyConstraint(["cliente_id"], ["clientes.id"], name=op.f("cartoes_cliente_id_fkey"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("cartoes_pkey")),
    )
    op.create_index(op.f("idx_cartoes_cliente_id"), "cartoes", ["cliente_id"], unique=False)

    op.create_table(
        "itens_pedido",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("pedido_id", sa.BIGINT(), nullable=False),
        sa.Column("item_cardapio_id", sa.BIGINT(), nullable=True),
        sa.Column("nome_item_snapshot", sa.VARCHAR(length=150), nullable=False),
        sa.Column("descricao_item_snapshot", sa.TEXT(), nullable=True),
        sa.Column("preco_unitario_snapshot", sa.NUMERIC(precision=10, scale=2), nullable=False),
        sa.Column("quantidade", sa.INTEGER(), nullable=False),
        sa.Column("observacao_item", sa.TEXT(), nullable=True),
        sa.Column("valor_total_item", sa.NUMERIC(precision=10, scale=2), nullable=False),
        sa.CheckConstraint("preco_unitario_snapshot >= 0::numeric", name=op.f("chk_itens_pedido_preco_unitario")),
        sa.CheckConstraint("quantidade > 0", name=op.f("chk_itens_pedido_quantidade")),
        sa.CheckConstraint(
            "valor_total_item = (preco_unitario_snapshot * quantidade::numeric)",
            name=op.f("chk_itens_pedido_total_consistente"),
        ),
        sa.CheckConstraint("valor_total_item >= 0::numeric", name=op.f("chk_itens_pedido_valor_total")),
        sa.ForeignKeyConstraint(
            ["item_cardapio_id"],
            ["itens_cardapio.id"],
            name=op.f("itens_pedido_item_cardapio_id_fkey"),
            ondelete="SET NULL",
        ),
        sa.ForeignKeyConstraint(["pedido_id"], ["pedidos.id"], name=op.f("itens_pedido_pedido_id_fkey"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("itens_pedido_pkey")),
    )
    op.create_index(op.f("idx_itens_pedido_pedido_id"), "itens_pedido", ["pedido_id"], unique=False)

    op.create_table(
        "pagamentos_pedido",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("pedido_id", sa.BIGINT(), nullable=False),
        sa.Column(
            "status_pagamento",
            status_pagamento_enum,
            server_default=sa.text("'PENDENTE'::status_pagamento_pedido_enum"),
            nullable=False,
        ),
        sa.Column("forma_pagamento", forma_pagamento_enum, nullable=False),
        sa.Column("valor", sa.NUMERIC(precision=10, scale=2), nullable=False),
        sa.Column("transacao_externa_id", sa.VARCHAR(length=255), nullable=True),
        sa.Column("pago_em", postgresql.TIMESTAMP(), nullable=True),
        sa.Column(
            "criado_em",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.CheckConstraint("valor >= 0::numeric", name=op.f("chk_pagamentos_pedido_valor")),
        sa.ForeignKeyConstraint(["pedido_id"], ["pedidos.id"], name=op.f("pagamentos_pedido_pedido_id_fkey"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("pagamentos_pedido_pkey")),
        sa.UniqueConstraint("pedido_id", name=op.f("pagamentos_pedido_pedido_id_key"), postgresql_nulls_not_distinct=False),
    )
    op.create_index(op.f("idx_pagamentos_pedido_status"), "pagamentos_pedido", ["status_pagamento"], unique=False)

    op.create_table(
        "mensagens",
        sa.Column("id", sa.BIGINT(), autoincrement=True, nullable=False),
        sa.Column("chat_id", sa.BIGINT(), nullable=False),
        sa.Column("remetente", remetente_mensagem_enum, nullable=False),
        sa.Column("conteudo", sa.TEXT(), nullable=False),
        sa.Column(
            "criado_em",
            postgresql.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.CheckConstraint("length(TRIM(BOTH FROM conteudo)) > 0", name=op.f("chk_mensagens_conteudo")),
        sa.ForeignKeyConstraint(["chat_id"], ["chats.id"], name=op.f("mensagens_chat_id_fkey"), ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name=op.f("mensagens_pkey")),
    )
    op.create_index(op.f("idx_mensagens_criado_em"), "mensagens", ["criado_em"], unique=False)
    op.create_index(op.f("idx_mensagens_chat_id"), "mensagens", ["chat_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("idx_mensagens_chat_id"), table_name="mensagens")
    op.drop_index(op.f("idx_mensagens_criado_em"), table_name="mensagens")
    op.drop_table("mensagens")

    op.drop_index(op.f("idx_pagamentos_pedido_status"), table_name="pagamentos_pedido")
    op.drop_table("pagamentos_pedido")

    op.drop_index(op.f("idx_itens_pedido_pedido_id"), table_name="itens_pedido")
    op.drop_table("itens_pedido")

    op.drop_index(op.f("idx_cartoes_cliente_id"), table_name="cartoes")
    op.drop_table("cartoes")

    op.drop_index(op.f("idx_avaliacoes_cliente_id"), table_name="avaliacoes")
    op.drop_index(op.f("idx_avaliacoes_restaurante_id"), table_name="avaliacoes")
    op.drop_table("avaliacoes")

    op.drop_table("chats")

    op.drop_index(op.f("idx_pedidos_cliente_id"), table_name="pedidos")
    op.drop_index(op.f("idx_pedidos_cliente_status_criado_em"), table_name="pedidos")
    op.drop_index(op.f("idx_pedidos_criado_em"), table_name="pedidos")
    op.drop_index(op.f("idx_pedidos_restaurante_id"), table_name="pedidos")
    op.drop_index(op.f("idx_pedidos_restaurante_status_criado_em"), table_name="pedidos")
    op.drop_index(op.f("idx_pedidos_status"), table_name="pedidos")
    op.drop_table("pedidos")

    op.drop_index(op.f("idx_pag_mensalidade_restaurante_id"), table_name="pagamentos_mensalidade_restaurante")
    op.drop_index(op.f("idx_pag_mensalidade_status"), table_name="pagamentos_mensalidade_restaurante")
    op.drop_table("pagamentos_mensalidade_restaurante")

    op.drop_index(op.f("idx_itens_restaurante_id"), table_name="itens_cardapio")
    op.drop_index(op.f("idx_itens_status_item"), table_name="itens_cardapio")
    op.drop_table("itens_cardapio")

    op.drop_index(op.f("idx_horarios_restaurante_id"), table_name="horarios_atendimento")
    op.drop_table("horarios_atendimento")

    op.drop_index(op.f("idx_restaurantes_status"), table_name="restaurantes")
    op.drop_table("restaurantes")

    op.drop_index(op.f("idx_solicitacoes_gestor_id"), table_name="solicitacoes_adesao_restaurante")
    op.drop_index(op.f("idx_solicitacoes_status"), table_name="solicitacoes_adesao_restaurante")
    op.drop_index(op.f("uq_solicitacao_em_analise_por_gestor"), table_name="solicitacoes_adesao_restaurante")
    op.drop_table("solicitacoes_adesao_restaurante")

    op.drop_index(op.f("idx_enderecos_cliente_id"), table_name="enderecos")
    op.drop_table("enderecos")

    op.drop_table("gestores")
    op.drop_table("clientes")
    op.drop_table("admins")

    op.drop_index(op.f("ix_usuarios_tipo_usuario"), table_name="usuarios")
    op.drop_index(op.f("ix_usuarios_email"), table_name="usuarios")
    op.drop_table("usuarios")

    bind = op.get_bind()
    for enum_name in (
        "status_pedido_enum",
        "remetente_mensagem_enum",
        "status_pagamento_pedido_enum",
        "forma_pagamento_enum",
        "dia_semana_enum",
        "status_solicitacao_adesao_enum",
        "status_restaurante_enum",
        "status_chat_enum",
        "status_mensalidade_restaurante_enum",
        "status_item_enum",
        "tamanho_item_enum",
        "status_usuario_enum",
        "tipo_usuario_enum",
    ):
        postgresql.ENUM(name=enum_name).drop(bind, checkfirst=True)
