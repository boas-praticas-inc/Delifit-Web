# Agents Guide

Este arquivo orienta agentes e colaboradores automáticos sobre como trabalhar no frontend deste projeto.

## Objetivo do projeto

O frontend web **Delifit** atende uma aplicação acadêmica de entrega de comidas fitness com perfis de:

* Cliente
* Restaurante
* Entregador
* Administrador

A base foi desenhada com:

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


## Fonte da verdade da API

A API consumida pelo frontend vem do backend em:

```text
Back/
```

Regras importantes:

* Não invente endpoints.
* Consulte o backend antes de assumir método HTTP, URL, payload ou resposta.
* Use `src/lib/api.ts` para chamadas HTTP.
* Use `VITE_API_URL` para configurar a URL base da API.
* Durante o desenvolvimento, o Vite redireciona `/api` para `http://127.0.0.1:8000`.
* O frontend não deve enviar campos sensíveis ou controlados pelo backend, como `senha_hash`, `status`, `criado_em` ou `atualizado_em`.
* O frontend não deve assumir JWT ou autenticação completa até que o backend exponha esse contrato de forma clara.
* Se uma mudança exigir alteração no backend, trate isso como mudança full stack e siga também as regras de `Back/AGENTS.md`.

## Estrutura de pastas

Use a separação de responsabilidades abaixo como referência principal:

* `src/app`: configuração principal da aplicação, rotas e composição inicial
* `src/assets`: imagens, ícones e recursos estáticos importados pela aplicação
* `src/components/common`: componentes compartilhados e reutilizáveis
* `src/components/layout`: componentes de layout e navegação
* `src/config`: configuração de ambiente
* `src/features`: módulos de domínio da interface, separados por funcionalidade
* `src/hooks`: hooks compartilhados
* `src/lib`: clientes, integrações e utilitários técnicos
* `src/pages`: páginas gerais que não pertencem a uma feature específica
* `src/styles`: estilos globais
* `src/types`: tipos compartilhados
* `src/utils`: funções utilitárias

## Regras de trabalho

* Preserve a organização por features.
* Não coloque regra de negócio complexa em componentes visuais.
* Não duplique chamadas HTTP dentro de páginas quando um service da feature puder concentrar a integração.
* Não acesse `axios` diretamente nas páginas; prefira services usando `src/lib/api.ts`.
* Não espalhe strings de URL da API pelos componentes.
* Não envie ao backend campos que ele não espera.
* Não invente autenticação, permissões ou tokens sem contrato real do backend.
* Para mudanças em rotas, atualize `src/app/routes.tsx`.
* Para formulários, prefira React Hook Form com Zod quando houver validação relevante.
* Para estados de API, trate carregamento, erro e sucesso quando fizer sentido.
* Para mudanças visuais, mantenha consistência com os componentes e estilos existentes.

Prefira adicionar novos fluxos começando por:

1. Tipo TypeScript da feature
2. Schema Zod, quando houver formulário ou validação
3. Service de integração com API
4. Componentes comuns necessários
5. Página da feature
6. Rota em `src/app/routes.tsx`
7. Estados de carregamento, erro e vazio
8. Ajustes de layout ou navegação
9. Testes, quando a infraestrutura de testes existir ou for solicitada
10. Documentação, quando o fluxo mudar a forma de uso do projeto

## Padrões já adotados

* A aplicação usa React 18 com TypeScript.
* O bundler é Vite.
* As rotas ficam em `src/app/routes.tsx`.
* O layout principal fica em `src/components/layout/MainLayout.tsx`.
* A navegação principal usa `Header` e `Sidebar`.
* Componentes compartilhados iniciais incluem `Button`, `Input` e `Loading`.
* Classes CSS são compostas com o utilitário `cn`.
* A configuração de ambiente fica em `src/config/env.ts`.
* O cliente HTTP fica em `src/lib/api.ts`.
* A base da API vem de `VITE_API_URL`.
* O proxy de desenvolvimento do Vite encaminha `/api` para o backend local.
* A organização principal fica em `src/features`.
* Services, schemas, tipos e páginas devem ficar dentro da feature correspondente.
* O projeto possui `src/lib/queryClient.ts` apenas como configuração futura; React Query ainda não faz parte da stack ativa.

## Padrões de usuário

O fluxo inicial de usuários consome a API de `usuarios`.

Campos usados na criação de usuário:

* `email`
* `senha`
* `tipo_usuario`

Tipos de usuário esperados:

* `CLIENTE`
* `RESTAURANTE`
* `ENTREGADOR`
* `ADMIN`

Não envie ao backend:

* `senha_hash`
* `status`
* `criado_em`
* `atualizado_em`

Orientações:

* Valide o formulário antes do envio.
* Exiba mensagens de erro vindas de `getApiErrorMessage`.
* Não mostre `senha_hash` na interface.
* Não assuma que campos opcionais existem na resposta sem tipar e tratar o caso.

## Boas práticas

* Use nomes descritivos em português quando o contexto do domínio pedir.
* Mantenha componentes pequenos e coesos.
* Evite duplicação de layout, service, schema e tipo.
* Separe dados de apresentação, validação e integração.
* Use tipagem clara e evite `any`.
* Prefira componentes compartilhados quando houver repetição real.
* Evite criar abstrações antes de necessidade clara.
* Garanta acessibilidade básica em formulários, botões e mensagens de erro.
* Use estados vazios para listas sem dados.
* Use estados de carregamento para ações assíncronas.
* Evite textos longos explicando a aplicação dentro das telas operacionais.
* Antes de adicionar dependências, verifique se elas realmente fazem parte do fluxo atual.

## Integração com o backend

O backend local roda por padrão em:

```text
http://127.0.0.1:8000
```

No frontend, use:

```env
VITE_API_URL=/api/v1
```

Com essa configuração, o Vite usa o proxy definido em `vite.config.ts`.

Endpoints preparados inicialmente:

* `GET /usuarios`
* `POST /usuarios`

Ao criar ou alterar integrações:

* Verifique o endpoint real no backend.
* Verifique o payload aceito pelo schema Pydantic.
* Verifique a resposta real da API.
* Atualize os tipos TypeScript.
* Atualize o service da feature.
* Trate erros com `getApiErrorMessage`.
* Mantenha compatibilidade com o backend sempre que possível.

## Execução local

Trabalhe a partir da pasta do frontend:

```bash
cd Front
```

Instalar dependências:

```bash
npm install
```

Criar arquivo de ambiente:

```bash
cp .env.example .env
```

Rodar aplicação:

```bash
npm run dev
```

## Comandos úteis

Rodar aplicação:

```bash
npm run dev
```

Gerar build:

```bash
npm run build
```

Rodar lint:

```bash
npm run lint
```

Formatar código:

```bash
npm run format
```

Pré-visualizar build:

```bash
npm run preview
```

## Testes

O projeto ainda não possui infraestrutura de testes frontend configurada.

Quando testes forem adicionados, prefira:

* Testes de componentes para formulários, botões e estados de interface.
* Testes de services com mock da API.
* Testes de fluxos para navegação e integração entre páginas.
* Testes que cubram carregamento, erro, sucesso e estado vazio.

Para mudanças relevantes, prefira adicionar teste junto do código quando a infraestrutura estiver disponível.

Orientações:

* Não dependa do backend real em testes unitários de frontend.
* Mocke chamadas HTTP quando testar páginas ou services.
* Valide mensagens de erro e comportamento do usuário.
* Garanta que formulários não enviem payload inválido.

## Qualidade de código

Antes de finalizar uma mudança, quando as dependências estiverem instaladas, rode:

```bash
npm run lint
npm run build
```

Quando alterar formatação de código, rode:

```bash
npm run format
```

Não versione caches ou artefatos gerados, como:

* `.env`
* `node_modules`
* `dist`
* `.vite`
* `.eslintcache`
* arquivos de log

## Ao evoluir o projeto

Para novas funcionalidades:

1. Crie ou ajuste os tipos da feature.
2. Crie ou ajuste schemas de validação.
3. Implemente services de API.
4. Crie ou ajuste páginas e componentes.
5. Atualize rotas e navegação.
6. Trate estados de carregamento, erro, sucesso e vazio.
7. Adicione testes proporcionais ao risco da mudança, se houver infraestrutura.
8. Atualize documentação quando o fluxo mudar a forma de executar ou usar a aplicação.

Preserve a separação entre features mesmo em funcionalidades pequenas.

## Cuidados importantes

* Não alterar a estrutura base sem necessidade.
* Não alterar `Back/` em tarefas exclusivamente de frontend.
* Não versionar `.env`, `node_modules`, `dist` ou caches.
* Não enviar dados sensíveis para a API.
* Não exibir dados sensíveis na interface.
* Não assumir endpoints sem consultar o backend.
* Não assumir autenticação completa sem contrato do backend.
* Não adicionar dependências sem necessidade clara.
* Se houver dúvida sobre payloads ou respostas, consulte primeiro os schemas e rotas do backend.
