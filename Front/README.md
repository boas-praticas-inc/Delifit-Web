# Delifit Frontend Web

Frontend web do Delifit, um sistema academico de entrega de comidas fitness com
perfis de cliente, restaurante, entregador e administrador.

Este projeto foi criado separadamente do backend. A pasta `Back/` nao deve ser
alterada por esta aplicacao.

## Stack

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- ESLint
- Prettier

## Estrutura de pastas

```text
Front/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── config/
│   │   └── env.ts
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── pedidos/
│   │   ├── restaurantes/
│   │   └── usuarios/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts
│   │   └── queryClient.ts
│   ├── pages/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── main.tsx
└── ...
```

A organizacao principal fica em `features/`, separando paginas, services,
schemas e tipos por modulo. Componentes compartilhados ficam em
`components/common`, layouts em `components/layout` e a configuracao do Axios em
`src/lib/api.ts`.

O arquivo `src/lib/queryClient.ts` contem apenas configuracoes padrao para uma
possivel camada futura de cache. O projeto nao adiciona React Query agora para
manter a stack simples e alinhada ao escopo solicitado.

## Instalar dependencias

```bash
npm install
```

## Configurar variaveis de ambiente

Crie um arquivo `.env` na pasta `Front/` usando o exemplo:

```bash
cp .env.example .env
```

Conteudo esperado:

```env
VITE_API_URL=/api/v1
```

Em desenvolvimento, o Vite redireciona `/api` para
`http://127.0.0.1:8000`, evitando bloqueios de CORS no navegador. Em producao,
essa variavel pode receber a URL completa da API.

## Rodar o projeto

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Formatar codigo

```bash
npm run format
```

## Rotas iniciais

- `/` - pagina inicial
- `/login` - login
- `/cadastro` - cadastro
- `/dashboard` - painel principal
- `/usuarios` - listagem de usuarios
- `/usuarios/novo` - criacao de usuario
- `/restaurantes` - pagina inicial de restaurantes
- `/pedidos` - pagina inicial de pedidos
- `*` - pagina 404

## Integracao com o backend

O Axios esta configurado em `src/lib/api.ts` usando `VITE_API_URL`.
Durante o desenvolvimento, `vite.config.ts` possui um proxy que encaminha
`/api/*` para o backend local em `http://127.0.0.1:8000`.

Endpoints preparados:

- `GET /usuarios`
- `POST /usuarios`

O payload de criacao de usuario envia apenas:

- `email`
- `senha`
- `tipo_usuario`

O frontend nao envia `senha_hash`, `status`, `criado_em` ou `atualizado_em`.

## Autenticacao

A pasta `src/features/auth` ja possui paginas, schemas, tipos e service inicial.
Como o endpoint de login ainda nao foi assumido no escopo, `authService.login`
esta documentado e preparado para ser ajustado quando a rota real existir no
backend. Nenhum JWT foi inventado no frontend.
