# Agents Guide

Este arquivo orienta agentes e colaboradores automáticos sobre como trabalhar neste projeto.

## Objetivo do projeto

O backend **Delifit** atende uma aplicação de entrega de comidas fitness. A base foi desenhada com:

* Python
* FastAPI
* SQLAlchemy
* Alembic
* Pydantic
* pydantic-settings
* PostgreSQL local
* Clean Architecture


## Fonte da verdade do banco

O schema do banco vem do arquivo SQL:

```text
delifit_schema_remodelado_portugues.sql
```

Esse arquivo é a fonte da verdade do modelo de dados.

Regras importantes:

* Mantenha nomes de tabelas, colunas, constraints e enums em português.
* Use `snake_case` no banco de dados.
* Não invente colunas.
* Não altere o modelo sem necessidade clara.
* Ao criar models SQLAlchemy, respeite os nomes reais do PostgreSQL.
* Quando o banco usar nomes físicos diferentes dos nomes de domínio, mapeie o atributo do ORM para a coluna real sem mudar o contrato da API.
* Para mudanças estruturais no banco, crie ou atualize migrations do Alembic.
* Migrations não devem conter comandos destrutivos como `DROP TABLE`, `DROP TYPE` ou limpeza de dados, salvo pedido explícito.

## Estrutura de pastas

Use a separação de responsabilidades abaixo como referência principal:

* `app/core`: configuração, banco, segurança e exceções
* `app/domain`: entidades, enums e contratos do domínio
* `app/application`: casos de uso e DTOs
* `app/infrastructure`: modelos ORM, repositórios concretos e integrações técnicas
* `app/presentation`: rotas HTTP, schemas Pydantic e camada de API
* `app/shared`: dependências compartilhadas
* `alembic`: migrações do banco
* `tests`: testes unitários e de integração

## Regras de trabalho

* Preserve a Clean Architecture.
* Não coloque regras de negócio em rotas, models ORM ou arquivos de configuração.
* Mantenha o domínio independente de FastAPI, SQLAlchemy e Alembic.
* Routers não devem acessar SQLAlchemy diretamente.
* Routers devem chamar casos de uso.
* Casos de uso devem depender de contratos do domínio, não de detalhes da infraestrutura.
* Não retorne `senha_hash` em respostas da API.
* Para mudanças na API, mantenha compatibilidade sempre que possível.

Prefira adicionar novos fluxos começando por:

1. Entidade de domínio
2. Enum ou value object, quando necessário
3. Contrato de repositório
4. DTOs
5. Use cases
6. Model ORM
7. Implementação concreta do repositório
8. Schemas Pydantic
9. Rota HTTP
10. Testes

## Padrões já adotados

* Entidades de domínio usam `dataclass`, quando fizer sentido.
* DTOs usam Pydantic.
* Persistência usa SQLAlchemy 2.x.
* A API é exposta em `/api/v1`.
* O banco usa PostgreSQL local.
* O `DATABASE_URL` vem do arquivo `.env`.
* A entidade inicial do projeto é `Usuario`.
* A tabela inicial usada como referência é `usuarios`.

## Padrões de usuário

A tabela `usuarios` possui:

* `id`
* `email`
* `senha_hash`
* `tipo_usuario`
* `status`
* `data_cadastro`
* `ultimo_login_em`

Enums relacionados:

* `TipoUsuarioEnum`: `CLIENTE`, `GESTOR`, `ADMIN`
* `StatusUsuarioEnum`: `ATIVO`, `INATIVO`, `BLOQUEADO`

A entrada de criação de usuário deve receber apenas:

* `email`
* `senha`
* `tipo_usuario`

Não aceite do cliente:

* `senha_hash`
* `status`
* `data_cadastro`
* `ultimo_login_em`

A senha recebida deve ser transformada em hash antes de ser persistida.

Pontos importantes do schema remodelado:

* `usuarios` continua sendo a tabela-base de autenticação e identidade.
* `clientes`, `gestores` e `admins` referenciam `usuarios` via `usuario_id`.
* `restaurantes` agora dependem de `gestores` e `enderecos`.
* `solicitacoes_adesao_restaurante` guarda o fluxo de aprovação antes da criação do restaurante.
* Em tabelas como `itens_cardapio` e `pedidos`, preserve os campos de data exatamente como estão no SQL.

## Boas práticas

* Use nomes descritivos em português quando o contexto do domínio pedir.
* Mantenha os arquivos pequenos e coesos.
* Evite duplicação.
* Evite acoplamento direto entre aplicação e infraestrutura.
* Valide entradas com schemas ou DTOs antes de chegar ao domínio.
* Sempre trate o caso de recurso não encontrado com resposta adequada na camada HTTP.
* Use tipagem clara.
* Evite lógica de negócio dentro de models ORM.
* Evite lógica de negócio dentro de routers.
* Antes de adicionar dependências, verifique se elas realmente fazem parte do fluxo atual.

## Banco de dados

O banco local atual é PostgreSQL.

O `DATABASE_URL` vem do arquivo `.env`.

Exemplo:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/delifit
```

Sempre que houver mudança estrutural no banco, gere uma migration nova.

Comandos úteis:

```bash
alembic revision --autogenerate -m "descricao_da_mudanca"
alembic upgrade head
alembic history
```

Antes de aplicar uma migration, revise o arquivo gerado.

## Execução local

Trabalhe a partir da pasta do backend:

```bash
cd Back
```

Criar ambiente virtual:

```bash
python3 -m venv .venv
```

Ativar ambiente:

```bash
source .venv/bin/activate
```

Instalar dependências:

```bash
pip install -e ".[dev]"
```

Criar arquivo de ambiente:

```bash
cp .env.example .env
```

Rodar migrações:

```bash
alembic upgrade head
```

Subir serviço:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Comandos úteis

Rodar API:

```bash
uvicorn app.main:app --reload
```

Rodar migrations:

```bash
alembic upgrade head
```

Ver histórico do Alembic:

```bash
alembic history
```

Rodar testes:

```bash
pytest
```

Rodar lint:

```bash
ruff check .
```

Formatar código:

```bash
ruff format .
```

## Testes

Testes unitários devem ficar em:

```text
tests/unit
```

Testes de integração devem ficar em:

```text
tests/integration
```

Para mudanças relevantes, prefira adicionar teste junto do código.

Orientações:

* Teste casos de uso com repositórios fake ou mocks.
* Evite depender do banco em testes unitários.
* Use testes de integração para validar banco, API e repositórios reais.
* Testes que importam settings devem definir variáveis de ambiente antes de importar a aplicação.

## Qualidade de código

Antes de finalizar uma mudança, quando as dependências estiverem instaladas, rode:

```bash
ruff check .
pytest
```

Quando alterar formatação de código, rode:

```bash
ruff format .
```

Não versione caches ou artefatos gerados, como:

* `.env`
* `.venv`
* `__pycache__`
* `.pytest_cache`
* `.ruff_cache`
* `.mypy_cache`
* `*.egg-info`

## Ao evoluir o projeto

Para novas funcionalidades:

1. Crie ou ajuste entidades e contratos no domínio.
2. Crie DTOs e casos de uso na aplicação.
3. Implemente repositórios ou integrações na infraestrutura.
4. Exponha schemas e rotas na apresentação.
5. Adicione testes proporcionais ao risco da mudança.

Preserve a separação entre camadas mesmo em funcionalidades pequenas.

## Cuidados importantes

* Não alterar a estrutura base sem necessidade.
* Não versionar `.env`, `.venv` ou artefatos de build.
* Não retornar dados sensíveis em respostas da API.
* Não persistir senha em texto puro.
* Não alterar nomes de tabelas, colunas ou enums sem revisar o schema SQL.
* Se uma mudança afetar o banco, confirme a migration antes de seguir.
* Se houver dúvida sobre o modelo de dados, consulte primeiro `delifit_schema_portugues.sql`.
