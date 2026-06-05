# Prompts para o Projeto Delifit

Este arquivo reúne prompts prontos para usar com assistentes de IA durante o desenvolvimento do Delifit. Use-os como ponto de partida e ajuste o trecho entre colchetes conforme a tarefa.

## Contexto Base do Projeto

Use este contexto no início de prompts maiores:

```text
Você está trabalhando no projeto Delifit, um sistema acadêmico de entrega de comidas fitness.

O projeto é full stack:
- Backend em Back/, usando Python 3.11+, FastAPI, PostgreSQL, SQLAlchemy 2.x, Alembic, Pydantic, pytest e ruff.
- Frontend em Front/, usando React, TypeScript, Vite, React Router DOM, Axios, React Hook Form, Zod e Tailwind CSS.

Regras do backend:
- Preserve a Clean Architecture.
- Domain não deve depender de FastAPI, SQLAlchemy ou Alembic.
- Routers não devem acessar SQLAlchemy diretamente.
- Routers devem chamar casos de uso.
- Casos de uso devem depender de contratos do domínio, não de detalhes da infraestrutura.
- Regras de negócio não devem ficar em rotas, models ORM ou arquivos de configuração.
- Não retorne senha_hash em respostas da API.
- Não persista senha em texto puro.
- A API é exposta em /api/v1.
- O banco usa nomes em português e snake_case.
- Mudanças estruturais no banco devem passar por migrations do Alembic.

Regras do frontend:
- Preserve a organização por features.
- Componentes compartilhados ficam em src/components/common.
- Layouts ficam em src/components/layout.
- Services, schemas, tipos e páginas devem ficar dentro da feature correspondente.
- Use TypeScript com tipagem clara.
- Use Zod para validações de formulário quando fizer sentido.
- Use Axios a partir de src/lib/api.ts.

Antes de propor mudanças, leia os arquivos relevantes e siga os padrões já existentes.
```

## Prompt Geral para Implementar Funcionalidade

```text
Implemente a funcionalidade [descrever funcionalidade] no projeto Delifit.

Escopo esperado:
- Backend: [descrever endpoints, casos de uso, entidades, regras e persistência].
- Frontend: [descrever telas, formulários, navegação, services e validações].
- Testes: adicione ou ajuste testes proporcionais ao risco da mudança.

Regras:
- Preserve a arquitetura e os padrões existentes.
- Não invente campos de banco; consulte o schema, migrations e models atuais antes de alterar persistência.
- Não coloque regra de negócio em routers ou components.
- Mantenha os nomes do domínio em português quando o projeto já usar português.
- Ao final, informe os arquivos alterados e os comandos de verificação executados.
```

## Prompt para Backend

```text
Trabalhe apenas no backend em Back/.

Preciso implementar [descrever recurso].

Siga este fluxo, quando aplicável:
1. Entidade de domínio.
2. Enum ou value object.
3. Contrato de repositório.
4. DTOs.
5. Caso de uso.
6. Model SQLAlchemy.
7. Repositório concreto.
8. Schema Pydantic.
9. Rota HTTP em /api/v1.
10. Testes unitários e/ou de integração.

Restrições:
- Não acesse o banco diretamente em routers.
- Não retorne dados sensíveis.
- Não altere nomes de tabelas, colunas, constraints ou enums sem necessidade clara.
- Se houver mudança estrutural no banco, crie migration Alembic e explique o motivo.

Comandos de qualidade esperados, se as dependências estiverem instaladas:
- ruff check .
- pytest
```

## Prompt para Frontend

```text
Trabalhe apenas no frontend em Front/.

Preciso implementar [descrever tela, fluxo ou componente].

Siga os padrões atuais:
- React com TypeScript.
- Rotas em src/app/routes.tsx.
- Features em src/features/[modulo].
- Services usando src/lib/api.ts.
- Validação com Zod quando houver formulário.
- Componentes comuns em src/components/common.
- Layout em src/components/layout.

Requisitos de UX:
- A tela deve ser funcional, direta e adequada a um sistema operacional de delivery fitness.
- Evite landing page ou textos explicativos desnecessários dentro da aplicação.
- Garanta estados de carregamento, erro e sucesso quando o fluxo depender da API.
- Mantenha responsividade e legibilidade em desktop e mobile.

Comandos de qualidade esperados, se as dependências estiverem instaladas:
- npm run lint
- npm run build
```

## Prompt para Integração Frontend e Backend

```text
Integre o frontend e o backend para o fluxo [descrever fluxo].

Verifique:
- Endpoint real no backend.
- Método HTTP, URL e payload.
- Schema de resposta.
- Service correspondente no frontend.
- Tipos TypeScript.
- Validação com Zod, quando houver formulário.
- Tratamento de erro e carregamento.

Não invente endpoints. Se o endpoint ainda não existir, implemente no backend respeitando a Clean Architecture e depois conecte o frontend.

Ao final, descreva:
- Endpoint criado ou usado.
- Arquivos de backend alterados.
- Arquivos de frontend alterados.
- Como testar manualmente o fluxo.
```

## Prompt para Banco de Dados e Migrations

```text
Analise a necessidade de alteração no banco para [descrever mudança].

Antes de editar:
- Consulte as migrations existentes em Back/alembic/versions.
- Consulte os models SQLAlchemy atuais.
- Preserve nomes em português e snake_case.
- Não invente colunas, tabelas ou enums sem justificar.

Se a mudança for necessária:
- Crie ou ajuste a migration Alembic.
- Atualize o model SQLAlchemy correspondente.
- Atualize repositórios, DTOs, schemas e testes afetados.
- Não inclua comandos destrutivos como DROP TABLE, DROP TYPE ou limpeza de dados, salvo pedido explícito.

Explique o impacto da migration e como aplicá-la com:
alembic upgrade head
```

## Prompt para Testes

```text
Crie ou ajuste testes para [descrever comportamento].

Regras:
- Testes unitários ficam em Back/tests/unit.
- Testes de integração ficam em Back/tests/integration.
- Testes unitários não devem depender de banco real.
- Use fakes ou mocks para contratos de repositório quando testar casos de uso.
- Testes de API devem validar status code, payload e ausência de dados sensíveis.
- Se settings forem importadas, defina variáveis de ambiente antes de importar a aplicação.

Ao final, rode ou indique:
- pytest
- ruff check .
```

## Prompt para Revisão de Código

```text
Faça uma revisão de código das alterações atuais do projeto Delifit.

Priorize:
- Bugs e regressões.
- Quebras de arquitetura.
- Vazamento de dados sensíveis.
- Regras de negócio em camadas erradas.
- Incompatibilidades entre frontend e backend.
- Problemas de tipagem.
- Ausência de testes em fluxos de risco.
- Migrations incorretas ou destrutivas.

Formato da resposta:
- Liste os achados primeiro, em ordem de severidade.
- Cite arquivo e linha quando possível.
- Depois informe dúvidas, riscos residuais e comandos de teste executados.
```

## Prompt para Refatoração

```text
Refatore [arquivo, módulo ou fluxo] no projeto Delifit.

Objetivo da refatoração:
[explicar objetivo: reduzir duplicação, melhorar tipagem, separar responsabilidade, simplificar fluxo etc.]

Restrições:
- Não altere comportamento externo sem necessidade.
- Não mova arquivos sem motivo claro.
- Preserve os contratos públicos usados por outras partes do projeto.
- Mantenha a arquitetura atual.
- Ajuste testes quando a refatoração afetar comportamento observável.

Ao final, explique o que mudou e como verificar.
```

## Prompt para Autenticação

```text
Implemente ou evolua o fluxo de autenticação do Delifit.

Requisitos:
- Não persistir senha em texto puro.
- Não retornar senha_hash.
- Validar credenciais no backend.
- Gerar token apenas se o backend já possuir ou receber implementação clara para JWT.
- No frontend, armazenar e usar o token de forma consistente com o padrão escolhido.
- Proteger rotas privadas quando necessário.

Antes de implementar, verifique:
- Back/app/core/security.py
- Back/app/domain/entities/usuario.py
- Back/app/application/use_cases/usuario
- Front/src/features/auth
- Front/src/lib/api.ts
```

## Prompt para Correção de Erro

```text
Corrija o erro abaixo no projeto Delifit:

[cole o erro completo aqui]

Investigue antes de editar:
- Onde o erro acontece.
- Qual fluxo dispara o erro.
- Se é problema de backend, frontend, ambiente ou integração.
- Se já existe teste cobrindo o comportamento.

Depois:
- Faça a menor correção segura.
- Adicione teste se o erro revelar um comportamento importante sem cobertura.
- Rode os comandos de verificação cabíveis.
- Explique a causa raiz e a solução.
```

## Prompt para Documentação

```text
Atualize a documentação do Delifit para [descrever assunto].

Considere:
- Back/README.md para backend.
- Front/README.md para frontend.
- prompts.md para prompts e orientações de uso de IA.
- Back/AGENTS.md para regras de agentes no backend.

Mantenha a documentação prática:
- Como rodar.
- Como configurar.
- Como testar.
- Como a arquitetura está organizada.
- Quais decisões importantes devem ser preservadas.
```

## Checklist Antes de Finalizar Alterações

Use este checklist em prompts de implementação:

```text
Antes de finalizar:
- Verifique git status.
- Confirme que não alterou arquivos fora do escopo.
- Confirme que não versionou .env, .venv, caches ou artefatos gerados.
- Rode os testes e linters possíveis.
- Informe comandos executados e resultados.
- Informe qualquer comando que não pôde ser executado e o motivo.
```
