# Delifit Web

Delifit Web é um projeto acadêmico full stack para uma aplicação de entrega de comidas fitness. A proposta é reunir em uma única solução os fluxos principais de clientes, restaurantes, entregadores e administradores.

Este repositório está sendo desenvolvido por estudantes como parte de um curso de Codex conduzido pelo professor [Andrés Menéndez](https://github.com/ammenendez).

## Objetivo

O objetivo do projeto é praticar o desenvolvimento de uma aplicação web completa usando ferramentas modernas de frontend e backend, com apoio do Codex durante a criação, evolução, documentação e revisão do código.

O sistema foi organizado em duas aplicações:

* `Back/`: API backend do Delifit.
* `Front/`: interface web do Delifit.

## Stack

Backend:

* Python 3.11+
* FastAPI
* PostgreSQL
* SQLAlchemy
* Alembic
* Pydantic
* pytest
* ruff

Frontend:

* React
* TypeScript
* Vite
* React Router DOM
* Axios
* React Hook Form
* Zod
* Tailwind CSS
* ESLint
* Prettier

## Estrutura do repositório

```text
Delifit-Web/
├── Back/
│   ├── app/
│   ├── alembic/
│   ├── tests/
│   ├── AGENTS.md
│   ├── README.md
│   ├── alembic.ini
│   └── pyproject.toml
├── Front/
│   ├── src/
│   ├── AGENTS.md
│   ├── README.md
│   ├── package.json
│   └── vite.config.ts
├── prompts.md
└── README.md
```

## Backend

O backend usa FastAPI com uma organização inspirada em Clean Architecture.

Camadas principais:

* `app/domain`: entidades, enums e contratos.
* `app/application`: DTOs e casos de uso.
* `app/infrastructure`: banco, models SQLAlchemy e repositórios concretos.
* `app/presentation`: schemas Pydantic e rotas HTTP.
* `app/core`: configurações, banco, segurança e exceções.

A API é exposta em:

```text
http://127.0.0.1:8000
```

Documentação interativa:

```text
http://127.0.0.1:8000/docs
```

## Frontend

O frontend usa React com TypeScript e Vite.

A organização principal fica em `src/features`, separando páginas, services, schemas e tipos por módulo.

Rotas iniciais:

* `/`
* `/login`
* `/cadastro`
* `/dashboard`
* `/usuarios`
* `/usuarios/novo`
* `/restaurantes`
* `/pedidos`

Em desenvolvimento, o Vite redireciona chamadas `/api` para o backend local em `http://127.0.0.1:8000`.

## Como rodar o backend

Entre na pasta do backend:

```bash
cd Back
```

Crie e ative o ambiente virtual:

```bash
python -m venv .venv
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -e ".[dev]"
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Configure o banco PostgreSQL no `.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/delifit
APP_NAME=Delifit API
APP_ENV=development
DEBUG=true
SECRET_KEY=change-me
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Crie o banco local:

```bash
createdb delifit
```

Execute as migrations:

```bash
alembic upgrade head
```

Suba a API:

```bash
uvicorn app.main:app --reload
```

## Como rodar o frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd Front
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

Conteúdo esperado:

```env
VITE_API_URL=/api/v1
```

Suba a aplicação:

```bash
npm run dev
```

## Comandos úteis

Backend:

```bash
cd Back
pytest
ruff check .
```

Frontend:

```bash
cd Front
npm run lint
npm run build
```

## Documentação para agentes

O projeto possui arquivos de orientação para uso com Codex e outros assistentes:

* `prompts.md`: prompts prontos para implementação, revisão, testes, documentação e integração.
* `Back/AGENTS.md`: regras para trabalhar no backend.
* `Front/AGENTS.md`: regras para trabalhar no frontend.

Esses arquivos ajudam a manter consistência arquitetural e reduzir decisões improvisadas durante o desenvolvimento.

## Cuidados importantes

* Não versionar `.env`, `.venv`, `node_modules`, `dist` ou caches.
* Não retornar ou exibir `senha_hash`.
* Não persistir senha em texto puro.
* Não inventar endpoints no frontend sem verificar o backend.
* Não alterar estrutura de banco sem migration Alembic.
* Preservar a separação entre backend e frontend.

## Status do projeto

O projeto ainda está em evolução. A base inicial já possui:

* API com health check e fluxo inicial de usuários.
* Frontend com rotas iniciais, layout, autenticação preparada, listagem e criação de usuários.
* Documentação separada para backend, frontend e uso de agentes.

Próximos passos possíveis:

* Implementar autenticação completa.
* Expandir perfis de cliente, restaurante e entregador.
* Criar fluxos de pedidos.
* Ampliar cobertura de testes.
* Evoluir a interface com base nos fluxos reais do sistema.
