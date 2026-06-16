# Agents Guide

Este arquivo orienta agentes e colaboradores automáticos sobre como trabalhar no frontend deste projeto.

## Objetivo Do Projeto

O frontend web **Delifit** atende uma aplicação acadêmica de delivery de comidas fitness. O projeto hoje concentra fluxos para:

* Autenticação e cadastro inicial
* Painel administrativo
* Clientes
* Restaurantes
* Solicitações de adesão
* Criação de usuários
* Telas auxiliares por perfil

A stack ativa é:

* React 18
* TypeScript
* Vite
* React Router DOM
* Axios
* React Hook Form
* Zod
* Tailwind CSS
* ESLint
* Prettier

## Fonte Da Verdade Da API

A API consumida pelo frontend vem do backend em:

```text
Back/
```

Regras importantes:

* Não invente endpoints, payloads ou status de resposta.
* Consulte o backend antes de assumir método HTTP, URL, campos aceitos ou formato de erro.
* Use `src/lib/api.ts` para chamadas HTTP.
* Use `VITE_API_URL` para configurar a URL base da API.
* No desenvolvimento, o Vite encaminha `/api` para `http://127.0.0.1:8000`.
* O frontend não deve enviar campos sensíveis ou controlados pelo backend, como `senha_hash`, `status`, `criado_em` ou `atualizado_em`.
* Não assuma JWT, refresh token, sessão persistida ou proteção de rotas privadas sem contrato explícito do backend.
* Se uma mudança exigir backend, trate como alteração full stack e siga também `Back/AGENTS.md`.

## Estrutura De Pastas

Use a separação abaixo como referência principal:

* `src/app`: composição principal da aplicação e rotas
* `src/components/common`: componentes compartilhados e reutilizáveis
* `src/components/layout`: header, sidebar e layout principal
* `src/config`: variáveis e configurações de ambiente
* `src/features`: módulos por domínio da interface
* `src/lib`: cliente HTTP e utilitários técnicos
* `src/pages`: páginas gerais fora de feature específica
* `src/styles`: estilos globais
* `src/utils`: funções utilitárias

## Estado Atual Da Aplicação

Arquivos e pontos já adotados no projeto:

* Rotas em `src/app/routes.tsx`
* App raiz em `src/app/App.tsx`
* Bootstrap em `src/main.tsx`
* Layout principal em `src/components/layout/MainLayout.tsx`
* Header em `src/components/layout/Header.tsx`
* Sidebar em `src/components/layout/Sidebar.tsx`
* Cliente HTTP em `src/lib/api.ts`
* Configuração de ambiente em `src/config/env.ts`
* Estilos globais em `src/styles/globals.css`
* Query client em `src/lib/queryClient.ts` apenas como base futura, sem React Query ativo

Features existentes hoje:

* `src/features/auth`
* `src/features/dashboard`
* `src/features/usuarios`
* `src/features/clientes`
* `src/features/restaurantes`
* `src/features/solicitacoes`
* `src/features/enderecos`
* `src/features/gestores`
* `src/features/admins`
* `src/features/pedidos`
* `src/features/gestor`

## Rotas Atuais

As rotas visíveis hoje estão concentradas em `src/app/routes.tsx`:

* `/` login
* `/login` redireciona para `/`
* `/cadastro` cadastro
* `/solicitar-adesao` solicitação de adesão
* `/gestor` home do gestor
* `/dashboard` painel principal
* `/solicitacoes` lista de solicitações
* `/usuarios/novo` criação de usuário
* `/clientes` lista de clientes
* `/clientes/novo` criação de cliente
* `/clientes/:clienteId` detalhe de cliente
* `/clientes/:clienteId/editar` edição de cliente
* `/restaurantes` lista de restaurantes
* `/restaurantes/novo` criação de restaurante
* `/restaurantes/:restauranteId` detalhe de restaurante
* `/restaurantes/:restauranteId/editar` edição de restaurante
* `/home` redireciona para `/dashboard`
* `*` página 404

## Regras De Trabalho

* Preserve a organização por features.
* Não coloque regra de negócio complexa em componentes visuais.
* Não duplique chamadas HTTP dentro de páginas quando um service da feature puder concentrar a integração.
* Não acesse `axios` diretamente nas páginas; prefira services usando `src/lib/api.ts`.
* Não espalhe strings de URL da API pelos componentes.
* Não envie ao backend campos que ele não espera.
* Para mudanças em rotas, atualize `src/app/routes.tsx`.
* Para formulários, prefira React Hook Form com Zod quando houver validação relevante.
* Para estados de API, trate carregamento, erro, sucesso e vazio quando fizer sentido.
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
9. Testes, quando a infraestrutura existir ou for solicitada
10. Documentação, quando o fluxo mudar a forma de uso do projeto

## Padrões Já Adotados

* O bundler é Vite.
* A base da API vem de `VITE_API_URL`.
* O proxy de desenvolvimento do Vite encaminha `/api` para o backend local.
* A navegação principal usa `Header` e `Sidebar`.
* Componentes compartilhados incluem `Button`, `Input`, `Select`, `Textarea`, `Alert`, `Loading`, `LinkButton` e `CrudActions`.
* Classes CSS são compostas com o utilitário `cn`.
* Services, schemas, tipos e páginas devem ficar dentro da feature correspondente.
* O projeto ainda não usa React Query na camada ativa.

## Padrões De Usuário

O fluxo inicial de usuários consome a API de `usuarios`.

Campos usados na criação de usuário:

* `email`
* `senha`
* `tipo_usuario`

Tipos de usuário esperados no frontend:

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

## Boas Práticas

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

## Integração Com O Backend

O backend local roda por padrão em:

```text
http://127.0.0.1:8000
```

No frontend, use:

```env
VITE_API_URL=/api/v1
```

Com essa configuração, o Vite usa o proxy definido em `vite.config.ts`.

Endpoints já presentes no contexto atual do Front:

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

## Execução Local

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

## Comandos Úteis

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
