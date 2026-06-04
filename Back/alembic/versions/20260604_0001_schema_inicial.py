"""Schema inicial do banco Delifit.

Revision ID: 20260604_0001
Revises:
Create Date: 2026-06-04 00:01:00
"""

from collections.abc import Sequence

from alembic import op

revision: str = "20260604_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TYPE tipo_usuario_enum AS ENUM (
            'CLIENTE',
            'RESTAURANTE',
            'ENTREGADOR',
            'ADMIN'
        )
        """
    )
    op.execute(
        """
        CREATE TYPE status_usuario_enum AS ENUM (
            'ATIVO',
            'INATIVO',
            'BANIDO'
        )
        """
    )
    op.execute(
        """
        CREATE TYPE status_entregador_enum AS ENUM (
            'DISPONIVEL',
            'INDISPONIVEL',
            'EM_ENTREGA',
            'INATIVO'
        )
        """
    )
    op.execute(
        """
        CREATE TYPE tamanho_item_enum AS ENUM (
            'PEQUENO',
            'MEDIO',
            'GRANDE'
        )
        """
    )
    op.execute(
        """
        CREATE TYPE status_mensalidade_enum AS ENUM (
            'PAGA',
            'PENDENTE',
            'ATRASADA',
            'CANCELADA'
        )
        """
    )
    op.execute(
        """
        CREATE TYPE forma_pagamento_enum AS ENUM (
            'PIX',
            'CARTAO',
            'DINHEIRO'
        )
        """
    )
    op.execute(
        """
        CREATE TYPE status_pagamento_enum AS ENUM (
            'PENDENTE',
            'PAGO',
            'FALHOU',
            'ESTORNADO',
            'CANCELADO'
        )
        """
    )
    op.execute(
        """
        CREATE TYPE status_pedido_enum AS ENUM (
            'PENDENTE',
            'CONFIRMADO',
            'EM_PREPARO',
            'PRONTO',
            'SAIU_PARA_ENTREGA',
            'ENTREGUE',
            'CANCELADO'
        )
        """
    )
    op.execute(
        """
        CREATE TYPE status_chat_enum AS ENUM (
            'ABERTO',
            'FECHADO'
        )
        """
    )
    op.execute(
        """
        CREATE TYPE tipo_remetente_mensagem_enum AS ENUM (
            'CLIENTE',
            'RESTAURANTE',
            'ENTREGADOR',
            'ADMIN'
        )
        """
    )

    op.execute(
        """
        CREATE TABLE usuarios (
            id BIGSERIAL PRIMARY KEY,
            email VARCHAR(150) NOT NULL UNIQUE,
            senha_hash VARCHAR(255) NOT NULL,
            tipo_usuario tipo_usuario_enum NOT NULL,
            status status_usuario_enum NOT NULL DEFAULT 'ATIVO',
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            atualizado_em TIMESTAMP,
            CONSTRAINT usuarios_email_nao_vazio CHECK (length(trim(email)) > 0),
            CONSTRAINT usuarios_senha_hash_nao_vazia CHECK (length(trim(senha_hash)) > 0)
        )
        """
    )
    op.execute(
        """
        CREATE TABLE clientes (
            id BIGSERIAL PRIMARY KEY,
            usuario_id BIGINT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
            nome_completo VARCHAR(120) NOT NULL,
            telefone VARCHAR(20) NOT NULL,
            cpf CHAR(11) NOT NULL UNIQUE,
            data_nascimento DATE NOT NULL,
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            atualizado_em TIMESTAMP,
            CONSTRAINT clientes_nome_completo_nao_vazio CHECK (length(trim(nome_completo)) > 0),
            CONSTRAINT clientes_telefone_nao_vazio CHECK (length(trim(telefone)) > 0),
            CONSTRAINT clientes_cpf_apenas_digitos CHECK (cpf ~ '^[0-9]{11}$')
        )
        """
    )
    op.execute(
        """
        CREATE TABLE restaurantes (
            id BIGSERIAL PRIMARY KEY,
            usuario_dono_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
            nome_fantasia VARCHAR(120) NOT NULL,
            razao_social VARCHAR(150) NOT NULL,
            cnpj CHAR(14) NOT NULL UNIQUE,
            telefone VARCHAR(20) NOT NULL,
            validado BOOLEAN NOT NULL DEFAULT FALSE,
            logo_url VARCHAR(255),
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            atualizado_em TIMESTAMP,
            CONSTRAINT restaurantes_nome_fantasia_nao_vazio CHECK (length(trim(nome_fantasia)) > 0),
            CONSTRAINT restaurantes_razao_social_nao_vazia CHECK (length(trim(razao_social)) > 0),
            CONSTRAINT restaurantes_telefone_nao_vazio CHECK (length(trim(telefone)) > 0),
            CONSTRAINT restaurantes_cnpj_apenas_digitos CHECK (cnpj ~ '^[0-9]{14}$')
        )
        """
    )
    op.execute(
        """
        CREATE TABLE entregadores (
            id BIGSERIAL PRIMARY KEY,
            usuario_id BIGINT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
            nome_completo VARCHAR(120) NOT NULL,
            telefone VARCHAR(20) NOT NULL,
            cpf CHAR(11) NOT NULL UNIQUE,
            tipo_veiculo VARCHAR(50),
            status status_entregador_enum NOT NULL DEFAULT 'INDISPONIVEL',
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            atualizado_em TIMESTAMP,
            CONSTRAINT entregadores_nome_completo_nao_vazio CHECK (length(trim(nome_completo)) > 0),
            CONSTRAINT entregadores_telefone_nao_vazio CHECK (length(trim(telefone)) > 0),
            CONSTRAINT entregadores_cpf_apenas_digitos CHECK (cpf ~ '^[0-9]{11}$')
        )
        """
    )
    op.execute(
        """
        CREATE TABLE enderecos (
            id BIGSERIAL PRIMARY KEY,
            cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
            rua VARCHAR(120) NOT NULL,
            numero VARCHAR(20) NOT NULL,
            complemento VARCHAR(100),
            bairro VARCHAR(80) NOT NULL,
            cep CHAR(8) NOT NULL,
            cidade VARCHAR(100) NOT NULL,
            estado VARCHAR(50) NOT NULL,
            apelido VARCHAR(40) NOT NULL,
            ponto_referencia VARCHAR(150),
            principal BOOLEAN NOT NULL DEFAULT FALSE,
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            atualizado_em TIMESTAMP,
            CONSTRAINT enderecos_rua_nao_vazia CHECK (length(trim(rua)) > 0),
            CONSTRAINT enderecos_numero_nao_vazio CHECK (length(trim(numero)) > 0),
            CONSTRAINT enderecos_bairro_nao_vazio CHECK (length(trim(bairro)) > 0),
            CONSTRAINT enderecos_cep_apenas_digitos CHECK (cep ~ '^[0-9]{8}$'),
            CONSTRAINT enderecos_cidade_nao_vazia CHECK (length(trim(cidade)) > 0),
            CONSTRAINT enderecos_estado_nao_vazio CHECK (length(trim(estado)) > 0),
            CONSTRAINT enderecos_apelido_nao_vazio CHECK (length(trim(apelido)) > 0)
        )
        """
    )
    op.execute(
        """
        CREATE TABLE cartoes (
            id BIGSERIAL PRIMARY KEY,
            cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
            nome_impresso VARCHAR(80) NOT NULL,
            ultimos_digitos CHAR(4) NOT NULL,
            token_gateway VARCHAR(255) NOT NULL,
            mes_expiracao SMALLINT NOT NULL,
            ano_expiracao SMALLINT NOT NULL,
            cpf_titular CHAR(11) NOT NULL,
            principal BOOLEAN NOT NULL DEFAULT FALSE,
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            atualizado_em TIMESTAMP,
            CONSTRAINT cartoes_nome_impresso_nao_vazio CHECK (length(trim(nome_impresso)) > 0),
            CONSTRAINT cartoes_ultimos_digitos_check CHECK (ultimos_digitos ~ '^[0-9]{4}$'),
            CONSTRAINT cartoes_token_gateway_nao_vazio CHECK (length(trim(token_gateway)) > 0),
            CONSTRAINT cartoes_mes_expiracao_check CHECK (mes_expiracao BETWEEN 1 AND 12),
            CONSTRAINT cartoes_ano_expiracao_check CHECK (ano_expiracao >= 2024),
            CONSTRAINT cartoes_cpf_titular_apenas_digitos CHECK (cpf_titular ~ '^[0-9]{11}$')
        )
        """
    )
    op.execute(
        """
        CREATE TABLE itens_cardapio (
            id BIGSERIAL PRIMARY KEY,
            restaurante_id BIGINT NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
            nome VARCHAR(80) NOT NULL,
            descricao VARCHAR(300),
            calorias NUMERIC(8,2) NOT NULL DEFAULT 0,
            carboidratos NUMERIC(8,2) NOT NULL DEFAULT 0,
            gordura NUMERIC(8,2) NOT NULL DEFAULT 0,
            proteina NUMERIC(8,2) NOT NULL DEFAULT 0,
            restricao_alimentar VARCHAR(80),
            preco NUMERIC(10,2) NOT NULL,
            tamanho tamanho_item_enum,
            volume VARCHAR(20),
            foto_url VARCHAR(255),
            disponivel BOOLEAN NOT NULL DEFAULT TRUE,
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            atualizado_em TIMESTAMP,
            CONSTRAINT itens_cardapio_nome_nao_vazio CHECK (length(trim(nome)) > 0),
            CONSTRAINT itens_cardapio_calorias_nao_negativas CHECK (calorias >= 0),
            CONSTRAINT itens_cardapio_carboidratos_nao_negativos CHECK (carboidratos >= 0),
            CONSTRAINT itens_cardapio_gordura_nao_negativa CHECK (gordura >= 0),
            CONSTRAINT itens_cardapio_proteina_nao_negativa CHECK (proteina >= 0),
            CONSTRAINT itens_cardapio_preco_positivo CHECK (preco > 0)
        )
        """
    )
    op.execute(
        """
        CREATE TABLE horarios_atendimento (
            id BIGSERIAL PRIMARY KEY,
            restaurante_id BIGINT NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
            dia_semana SMALLINT NOT NULL,
            abre_as TIME NOT NULL,
            fecha_as TIME NOT NULL,
            fechado BOOLEAN NOT NULL DEFAULT FALSE,
            CONSTRAINT horarios_atendimento_dia_semana_check CHECK (dia_semana BETWEEN 1 AND 7),
            CONSTRAINT horarios_atendimento_horario_check CHECK (fecha_as > abre_as),
            CONSTRAINT horarios_atendimento_unico_dia_por_restaurante
                UNIQUE (restaurante_id, dia_semana)
        )
        """
    )
    op.execute(
        """
        CREATE TABLE pagamentos_mensalidade_restaurante (
            id BIGSERIAL PRIMARY KEY,
            restaurante_id BIGINT NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
            valor NUMERIC(10,2) NOT NULL,
            pago_em TIMESTAMP,
            vencimento_em TIMESTAMP NOT NULL,
            status status_mensalidade_enum NOT NULL DEFAULT 'PENDENTE',
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            atualizado_em TIMESTAMP,
            CONSTRAINT pagamentos_mensalidade_valor_positivo CHECK (valor > 0)
        )
        """
    )
    op.execute(
        """
        CREATE TABLE pedidos (
            id BIGSERIAL PRIMARY KEY,
            cliente_id BIGINT NOT NULL REFERENCES clientes(id),
            restaurante_id BIGINT NOT NULL REFERENCES restaurantes(id),
            endereco_id BIGINT NOT NULL REFERENCES enderecos(id),
            entregador_id BIGINT REFERENCES entregadores(id),
            status status_pedido_enum NOT NULL DEFAULT 'PENDENTE',
            subtotal NUMERIC(10,2) NOT NULL,
            taxa_entrega NUMERIC(10,2) NOT NULL DEFAULT 0,
            valor_total NUMERIC(10,2) NOT NULL,
            observacao_cliente VARCHAR(200),
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            confirmado_em TIMESTAMP,
            entregue_em TIMESTAMP,
            cancelado_em TIMESTAMP,
            atualizado_em TIMESTAMP,
            CONSTRAINT pedidos_subtotal_nao_negativo CHECK (subtotal >= 0),
            CONSTRAINT pedidos_taxa_entrega_nao_negativa CHECK (taxa_entrega >= 0),
            CONSTRAINT pedidos_valor_total_nao_negativo CHECK (valor_total >= 0),
            CONSTRAINT pedidos_valor_total_consistente CHECK (valor_total = subtotal + taxa_entrega)
        )
        """
    )
    op.execute(
        """
        CREATE TABLE itens_pedido (
            id BIGSERIAL PRIMARY KEY,
            pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
            item_cardapio_id BIGINT NOT NULL REFERENCES itens_cardapio(id),
            quantidade INTEGER NOT NULL,
            preco_unitario NUMERIC(10,2) NOT NULL,
            nome_item_snapshot VARCHAR(80) NOT NULL,
            observacoes VARCHAR(200),
            CONSTRAINT itens_pedido_quantidade_positiva CHECK (quantidade > 0),
            CONSTRAINT itens_pedido_preco_unitario_nao_negativo CHECK (preco_unitario >= 0),
            CONSTRAINT itens_pedido_nome_item_snapshot_nao_vazio
                CHECK (length(trim(nome_item_snapshot)) > 0)
        )
        """
    )
    op.execute(
        """
        CREATE TABLE pagamentos_pedido (
            id BIGSERIAL PRIMARY KEY,
            pedido_id BIGINT NOT NULL UNIQUE REFERENCES pedidos(id) ON DELETE CASCADE,
            cartao_id BIGINT REFERENCES cartoes(id),
            forma_pagamento forma_pagamento_enum NOT NULL,
            status status_pagamento_enum NOT NULL DEFAULT 'PENDENTE',
            valor NUMERIC(10,2) NOT NULL,
            transacao_gateway_id VARCHAR(255),
            pago_em TIMESTAMP,
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            atualizado_em TIMESTAMP,
            CONSTRAINT pagamentos_pedido_valor_positivo CHECK (valor > 0),
            CONSTRAINT pagamentos_pedido_cartao_obrigatorio_para_cartao CHECK (
                forma_pagamento <> 'CARTAO' OR cartao_id IS NOT NULL
            )
        )
        """
    )
    op.execute(
        """
        CREATE TABLE avaliacoes (
            id BIGSERIAL PRIMARY KEY,
            cliente_id BIGINT NOT NULL REFERENCES clientes(id),
            pedido_id BIGINT NOT NULL UNIQUE REFERENCES pedidos(id),
            nota NUMERIC(2,1) NOT NULL,
            descricao VARCHAR(300),
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            atualizado_em TIMESTAMP,
            CONSTRAINT avaliacoes_nota_intervalo CHECK (nota >= 1 AND nota <= 5)
        )
        """
    )
    op.execute(
        """
        CREATE TABLE chats (
            id BIGSERIAL PRIMARY KEY,
            pedido_id BIGINT NOT NULL UNIQUE REFERENCES pedidos(id) ON DELETE CASCADE,
            status status_chat_enum NOT NULL DEFAULT 'ABERTO',
            criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            fechado_em TIMESTAMP,
            atualizado_em TIMESTAMP
        )
        """
    )
    op.execute(
        """
        CREATE TABLE mensagens (
            id BIGSERIAL PRIMARY KEY,
            chat_id BIGINT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
            tipo_remetente tipo_remetente_mensagem_enum NOT NULL,
            usuario_remetente_id BIGINT NOT NULL REFERENCES usuarios(id),
            texto VARCHAR(500) NOT NULL,
            lida BOOLEAN NOT NULL DEFAULT FALSE,
            enviada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT mensagens_texto_nao_vazio CHECK (length(trim(texto)) > 0)
        )
        """
    )

    for statement in (
        "CREATE INDEX idx_usuarios_email ON usuarios(email)",
        "CREATE INDEX idx_usuarios_tipo_usuario ON usuarios(tipo_usuario)",
        "CREATE INDEX idx_clientes_usuario_id ON clientes(usuario_id)",
        "CREATE INDEX idx_restaurantes_usuario_dono_id ON restaurantes(usuario_dono_id)",
        "CREATE INDEX idx_entregadores_usuario_id ON entregadores(usuario_id)",
        "CREATE INDEX idx_enderecos_cliente_id ON enderecos(cliente_id)",
        "CREATE INDEX idx_cartoes_cliente_id ON cartoes(cliente_id)",
        "CREATE INDEX idx_itens_cardapio_restaurante_id ON itens_cardapio(restaurante_id)",
        "CREATE INDEX idx_itens_cardapio_disponivel ON itens_cardapio(disponivel)",
        "CREATE INDEX idx_horarios_atendimento_restaurante_id ON horarios_atendimento(restaurante_id)",
        "CREATE INDEX idx_pagamentos_mensalidade_restaurante_id "
        "ON pagamentos_mensalidade_restaurante(restaurante_id)",
        "CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id)",
        "CREATE INDEX idx_pedidos_restaurante_id ON pedidos(restaurante_id)",
        "CREATE INDEX idx_pedidos_entregador_id ON pedidos(entregador_id)",
        "CREATE INDEX idx_pedidos_status ON pedidos(status)",
        "CREATE INDEX idx_itens_pedido_pedido_id ON itens_pedido(pedido_id)",
        "CREATE INDEX idx_itens_pedido_item_cardapio_id ON itens_pedido(item_cardapio_id)",
        "CREATE INDEX idx_pagamentos_pedido_pedido_id ON pagamentos_pedido(pedido_id)",
        "CREATE INDEX idx_avaliacoes_cliente_id ON avaliacoes(cliente_id)",
        "CREATE INDEX idx_chats_pedido_id ON chats(pedido_id)",
        "CREATE INDEX idx_mensagens_chat_id ON mensagens(chat_id)",
        "CREATE INDEX idx_mensagens_usuario_remetente_id ON mensagens(usuario_remetente_id)",
    ):
        op.execute(statement)

    for statement in (
        "COMMENT ON TABLE usuarios IS 'Dados base de autenticacao e tipo de usuario.'",
        "COMMENT ON TABLE clientes IS 'Perfil de cliente vinculado a usuarios.'",
        "COMMENT ON TABLE restaurantes IS "
        "'Perfil de restaurante. Um usuario dono pode possuir varios restaurantes.'",
        "COMMENT ON TABLE entregadores IS 'Perfil de entregador vinculado a usuarios.'",
        "COMMENT ON TABLE pagamentos_mensalidade_restaurante IS "
        "'Registros de mensalidade/assinatura dos restaurantes.'",
        "COMMENT ON TABLE pagamentos_pedido IS "
        "'Registros de pagamento dos pedidos dos clientes.'",
        "COMMENT ON TABLE itens_pedido IS "
        "'Itens dentro de um pedido. Mantem historico de preco unitario e nome do item.'",
    ):
        op.execute(statement)


def downgrade() -> None:
    # Esta migration inicial evita comandos destrutivos por decisao do projeto.
    pass
