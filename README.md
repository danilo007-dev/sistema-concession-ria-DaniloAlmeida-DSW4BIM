# AutoViva — Sistema para concessionária

Aplicação full stack para organizar o estoque de veículos de uma concessionária. Projeto acadêmico de Desenvolvimento Web (DSW), AV1 e AV2.

## Problema, público e solução

Concessionárias precisam manter informações de veículos e disponibilidade atualizadas. A AutoViva permite que vendedores cadastrem e gerenciem seus veículos, acompanhem itens disponíveis ou vendidos, e que administradores tenham visão geral. Cada conta de vendedor acessa apenas seus próprios registros.

**Regra de negócio:** um veículo vendido não pode voltar para disponível nem ser excluído do histórico. A validação acontece na camada de serviço da API e retorna HTTP 409. Para demonstrar: cadastre um veículo, marque como vendido e tente alterar o status para disponível ou excluí-lo.

## Tecnologias

- API: Node.js, Express 5, TypeScript, arquitetura MVC, Prisma ORM **7.10.0**, MySQL, JWT, bcryptjs e Zod.
- Interface: React 19, Vite, TypeScript, Tailwind CSS **4.3.0** e integração oficial `@tailwindcss/vite` **4.3.0**.
- Os pacotes `prisma`, `@prisma/client` e `@prisma/adapter-mariadb` estão fixados em 7.10.0. As versões de Tailwind e da integração também estão fixadas, sem `^` ou `~`.

## Estrutura

```text
apps/
  api/
    prisma/              # schema, migration e seed do administrador
    src/
      controllers/       # entrada HTTP / MVC
      middleware/        # autenticação e erros
      routes/            # rotas REST
      services/          # regras e acesso ao Prisma
      lib/               # cliente do banco e erros HTTP
  web/                   # aplicação React/Vite/Tailwind
```

## Requisitos locais

- Node.js 20 ou superior e npm.
- MySQL 8 ou serviço MySQL acessível.

## Configuração e execução

1. Na raiz, instale os pacotes: `npm install`.
2. Copie `apps/api/.env.example` para `apps/api/.env` e ajuste `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Use um segredo JWT longo e exclusivo; não o publique.
3. Crie no MySQL um banco vazio chamado `autoviva` (ou ajuste a URL no `.env`). A URL segue o formato `mysql://usuario:senha@localhost:3306/autoviva`; codifique caracteres especiais da senha para URL.
4. Aplique a migration e gere o cliente: `npm run db:deploy --workspace apps/api` e `npm run db:generate --workspace apps/api`.
5. Opcionalmente, crie/atualize o usuário administrador configurado no `.env`: `npm run db:seed --workspace apps/api`.
6. Copie `apps/web/.env.example` para `apps/web/.env`. Para desenvolvimento, `VITE_API_URL` deve apontar para `http://localhost:3333/api`.
7. Inicie API e interface juntas: `npm run dev`. API: `http://localhost:3333`; interface: `http://localhost:5173`.
8. Compilação de produção local: `npm run build`.

O cadastro público cria contas com perfil SELLER. A conta ADMIN é criada apenas pelo seed; não existe endpoint público para elevar permissões.

## Rotas principais

Todas as respostas e erros são JSON, salvo `DELETE` bem-sucedido (204).

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| GET | `/api/health` | Não | Verificação da API |
| POST | `/api/auth/register` | Não | Cadastro `{ name, email, password }` |
| POST | `/api/auth/login` | Não | Login `{ email, password }`; devolve token JWT e usuário |
| GET | `/api/auth/me` | Bearer JWT | Identidade do usuário autenticado |
| GET | `/api/vehicles?search=&status=` | Bearer JWT | Lista os veículos permitidos ao usuário |
| POST | `/api/vehicles` | Bearer JWT | Cadastra veículo |
| PATCH | `/api/vehicles/:id` | Bearer JWT | Atualiza veículo; pode marcar como `SOLD` |
| DELETE | `/api/vehicles/:id` | Bearer JWT | Exclui veículo disponível |

Envie o token retornado no login no cabeçalho `Authorization: Bearer <token>`. Campos do veículo: `make`, `model`, `year`, `price`, `mileage`, `color`, `description` (opcional) e `status` (`AVAILABLE` ou `SOLD`). O dono é associado pelo backend, nunca pelo corpo enviado. ADMIN pode consultar e administrar todos; SELLER apenas os próprios registros. Erros de validação retornam HTTP 400, sessão inválida 401, falta de acesso 404 e conflito com a regra 409.

## Roteiro curto para apresentação — AV1

1. Mostrar a estrutura MVC, `schema.prisma`, migration relacional e variáveis de ambiente.
2. Fazer cadastro/login e mostrar que a senha foi armazenada com hash; explicar o JWT.
3. Sem token, consultar `GET /api/vehicles` e demonstrar bloqueio 401.
4. Com token, cadastrar, consultar, atualizar e excluir um veículo disponível; conferir persistência no banco.
5. Marcar um veículo como vendido e demonstrar que a API bloqueia sua exclusão e a mudança para disponível (409).
6. Criar uma segunda conta e demonstrar que ela não altera o veículo da primeira. Explicar que ADMIN é preparado pelo seed.

## AV2: deploy

1. Crie um banco MySQL gerenciado (por exemplo, em um provedor que ofereça MySQL) e configure sua URL `mysql://...` na API. O Render hospeda a API; o banco pode ficar em um provedor MySQL externo.
2. Publique `apps/api` no Render usando Node; build `npm install && npm run build --workspace apps/api`, start `npm run db:deploy --workspace apps/api && npm run start --workspace apps/api`. Configure `JWT_SECRET`, `DATABASE_URL`, `FRONTEND_URL` e as variáveis do seed no painel, nunca no repositório.
3. Publique `apps/web` na Vercel com root directory `apps/web`, build `npm run build` e variável `VITE_API_URL=https://<sua-api>/api`.
4. Configure `FRONTEND_URL` com a origem publicada do frontend. Teste cadastro, login, CRUD, regra e sessão pela URL pública.
5. Atualize este README com os endereços reais da aplicação e do repositório após publicar.

> A publicação requer contas e credenciais pessoais dos provedores. Não coloque senhas, tokens ou URLs com credenciais no Git.

## Fontes e licenças de componentes

A interface foi construída para este projeto com React, Tailwind e Lucide React (ícones). Não foram copiados componentes prontos de terceiros. Referências: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide](https://lucide.dev/) e [Prisma](https://www.prisma.io/docs/). Respeite as licenças dos pacotes antes de adicionar componentes externos e registre aqui a fonte e licença de qualquer material adaptado.

## Observação acadêmica

Use o projeto como base de estudo, revise o código, teste os fluxos e esteja preparado para explicar as decisões e trechos implementados durante a apresentação individual.
