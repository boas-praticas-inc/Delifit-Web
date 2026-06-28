# Delifit Backend

Backend do Delifit, um sistema academico de entrega de comidas fitness. Esta base usa FastAPI, PostgreSQL, SQLAlchemy, Alembic e uma organizacao inspirada em Clean Architecture.

## Stack

- Python 3.11+
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Pydantic e pydantic-settings
- Uvicorn
- passlib com bcrypt
- pytest
- ruff

## Estrutura

```text
Back/
|-- app/
|   |-- main.py
|   |-- core/
|   |-- domain/
|   |-- application/
|   |-- infrastructure/
|   |-- presentation/
|   `-- shared/
|-- alembic/
|-- tests/
|-- .env.example
|-- alembic.ini
|-- pyproject.toml
`-- README.md
```

A API fica em `presentation`, os casos de uso em `application`, entidades e contratos em `domain`, e detalhes externos como SQLAlchemy em `infrastructure`. As rotas chamam casos de uso, nao acessam banco diretamente.

## Ambiente local

Entre na pasta do backend:

```bash
cd Back
```

Crie e ative o ambiente virtual:

```bash
python -m venv .venv
source .venv/bin/activate
.\.venv\Scripts\activate
```

Instale as dependencias:

```bash
pip install -e ".[dev]"
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Ajuste o `DATABASE_URL` conforme usuario, senha, host, porta e nome do banco local:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/delifit
APP_NAME=Delifit API
APP_ENV=development
DEBUG=true
SECRET_KEY=change-me
ACCESS_TOKEN_EXPIRE_MINUTES=60
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_BUCKET=delifit
```

## Infra local com MinIO

O backend agora possui um `docker-compose.yml` proprio para subir apenas a infraestrutura local do MinIO.

Suba os containers a partir da pasta `Back`:

```bash
docker compose up -d
```

Servicos expostos:

- API do MinIO: `http://localhost:9000`
- Painel do MinIO: `http://localhost:9001`

Credenciais padrao do painel:

- usuario: `minioadmin`
- senha: `minioadmin123`

O bucket `delifit` e criado automaticamente pelo container `minio-init` e recebe permissao de leitura publica no ambiente local para facilitar testes.

Para verificar os containers:

```bash
docker compose ps
```

Para acompanhar logs:

```bash
docker compose logs -f minio
```

Para derrubar a infraestrutura:

```bash
docker compose down
```

Depois de subir o ambiente, voce pode abrir o painel, enviar um arquivo manualmente para o bucket `delifit` e testa-lo no navegador por uma URL como:

```text
http://localhost:9000/delifit/nome-do-arquivo.jpg
```

## Banco PostgreSQL

O desenvolvedor precisa ter PostgreSQL instalado localmente. Crie o banco:

```bash
createdb delifit
```

Execute as migrations:

```bash
alembic upgrade head
```

O arquivo `delifit_schema_portugues.sql` foi usado como fonte da verdade. A migration inicial `alembic/versions/20260604_0001_schema_inicial.py` reproduz os ENUMs, tabelas, constraints, indices e comentarios do schema, sem executar os comandos `DROP` existentes no script original.

## Rodando a API

```bash
uvicorn app.main:app --reload
```

Por padrao, a API sobe em:

```text
http://127.0.0.1:8000
```

Documentacao interativa:

```text
http://127.0.0.1:8000/docs
```

## Endpoints iniciais

Health check:

```bash
curl http://127.0.0.1:8000/health
```

Resposta:

```json
{
  "status": "ok",
  "app": "Delifit API"
}
```

Criar usuario:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/usuarios \
  -H "Content-Type: application/json" \
  -d '{"email":"cliente@delifit.com","senha":"senha-segura","tipo_usuario":"CLIENTE"}'
```

Listar usuarios:

```bash
curl http://127.0.0.1:8000/api/v1/usuarios
```

Buscar usuario por ID:

```bash
curl http://127.0.0.1:8000/api/v1/usuarios/1
```

As respostas de usuario nunca retornam `senha_hash`.

## Testes e qualidade

Rodar testes:

```bash
pytest
```

Rodar Ruff:

```bash
ruff check .
```

## Proximos passos sugeridos

- Criar models SQLAlchemy para as demais tabelas.
- Implementar autenticacao e JWT.
- Adicionar use cases de perfis de cliente, restaurante e entregador.
- Criar testes de integracao com banco local de teste.
