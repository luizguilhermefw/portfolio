# Blog V2 — backend

Fundação isolada NestJS 11 + TypeScript + Prisma 7 + PostgreSQL, ainda fora de produção. O portfólio e o blog PHP não são modificados. Arquitetura: [documento](../../docs/blog-v2-architecture.md).

## Desenvolvimento

Requer Node 22.14+ e npm. Execute tudo neste diretório:

```sh
npm install
# Copie .env.example para .env e configure DATABASE_URL e PORT.
npm run prisma:validate
npm run prisma:generate
npm run dev
```

O runtime e `prisma.config.ts` leem `.env` local usando Node; variáveis do ambiente têm precedência. Nunca versionar credenciais. A URL da CLI fica em `prisma.config.ts`, não no schema. Prisma, client e adapter-pg estão alinhados em 7.10.1; PostgreSQL usa o driver pg.

O backend usa ESM (`type: module`, TypeScript NodeNext e imports locais com `.js`). O generator `prisma-client` gera TypeScript em `src/generated/prisma`, ignorado pelo Git e compilado junto com o backend. Execute generate antes do primeiro build/type-check. Não há geração automática no install do Prisma 7.

Nenhuma migration, banco ou seed foi criado. Configurar a URL não cria tabelas: endpoints de dados exigem PostgreSQL com schema provisionado em uma futura etapa aprovada. Não executar migrations no MySQL legado.

## Endpoints

- `GET /api/blog/v1/health`: `{ "status": "ok" }`, liveness sem conexão com banco; não é readiness.
- `GET /api/blog/v1/posts`: resumos publicados, filtros search/category (slug), page/limit; publishedAt desc (nulls por último), id desc; nunca inclui contentHtml.
- `GET /api/blog/v1/posts/:slug`: detalhe publicado com contentHtml; inexistente ou DRAFT retorna 404.
- `GET /api/blog/v1/categories`: id/name/slug ordenados por nome e id.

Todos os caminhos abaixo também usam o prefixo `/api/blog/v1`:

| Método | Caminho | Acesso |
| --- | --- | --- |
| POST | /auth/login | username/password; retorna somente id/username e cookie |
| GET | /auth/me | Sessão; retorna somente id/username |
| POST | /auth/logout | Sessão; revoga e limpa cookie |
| GET | /admin/posts | Sessão; filtros status/search/page/limit |
| GET | /admin/posts/:id | Sessão; detalhe por UUID |
| POST | /admin/posts | Sessão; cria DRAFT |
| PATCH | /admin/posts/:id | Sessão; atualização parcial |
| DELETE | /admin/posts/:id | Sessão; 204, não remove mídia |
| POST | /admin/posts/:id/publish | Sessão; publica, preservando primeira publishedAt |
| POST | /admin/posts/:id/unpublish | Sessão; volta a DRAFT, preservando publishedAt |

Paginação retorna `{ items, page, limit, total, totalPages }`. Defaults: page=1, limit=10; limit máximo 100 e page máximo 100000. Admin ordena por updatedAt/id desc. Busca case-insensitive em título/conteúdo. Consulta de itens/total usa snapshot RepeatableRead. Rascunhos nunca passam pelo filtro público, mesmo com publishedAt histórico.

Criação exige title, slug e contentHtml. Slug explícito: 1–200 caracteres, letras minúsculas ASCII, números e hífens entre segmentos; unicidade garantida pelo banco (409 em conflito). Não há geração automática nem histórico de redirects nesta fase: alterar slug publicado pode quebrar links, portanto revisar antes de mudar. Campos opcionais: excerpt, categoryId, imageUrl, metaDescription. categoryId deve existir; null permite limpar campos opcionais no PATCH. imageUrl aceita apenas URL HTTP/HTTPS absoluta. Campos arbitrários, status, IDs/datas legadas no body são rejeitados com 400. Status muda apenas pelos endpoints próprios.

Publish verifica os campos obrigatórios e define a primeira publishedAt por escrita condicional; chamadas repetidas não a substituem. Isso NÃO equivale a sanitização HTML. Erros Prisma são convertidos em respostas genéricas 400 (referência), 404 (ausente), 409 (unicidade) ou 500, sem SQL/stack/hashes no JSON.

## Sessão e primeiro administrador

Token opaco de 32 bytes aleatórios; somente SHA-256 do token fica em AdminSession. Cookie `blog_session`, HttpOnly, SameSite=Lax, Path=/api/blog/v1, Secure quando NODE_ENV=production; expiração alinhada ao banco. TTL absoluto de sete dias por padrão, configurável por SESSION_TTL_DAYS (inteiro 1–30), sem renovação deslizante. Login bem-sucedido substitui a sessão anterior do mesmo admin apresentada no cookie. Senhas Argon2id (64 MiB, três iterações, paralelismo 1); usuário/senha inválidos recebem o mesmo 401.

Guard valida cookie e expiresAt no servidor em todos os endpoints admin, me e logout. Logout usa deleteMany, tolerando revogação concorrente; nova chamada com sessão já revogada/ausente retorna 401 pelo guard. O cliente pode tratar esse 401 como já desconectado. Sessões expiradas não autenticam e poderão ser removidas por manutenção futura; nenhum job foi adicionado. Nunca colocar sessão no localStorage.

Depois de configurar um PostgreSQL de desenvolvimento/teste e aplicar a migration aprovada, execute explicitamente em terminal confiável:

```sh
npm run admin:create -- seu-username
```

O CLI pede senha e confirmação sem eco (12–1024 caracteres), não aceita senha via argv/env/arquivo, recusa execução não interativa e não sobrescreve usuário existente. Username aceita letras ASCII, números, ponto, hífen e underscore (1–100). Não há admin/senha padrão, cadastro público ou provisionamento no startup. O CLI não foi executado nesta etapa.

## Banco e primeira migration

Não havia DATABASE_URL nem PostgreSQL de teste configurado durante esta implementação; nenhuma migration foi executada ou criada. Quando houver um banco PostgreSQL local/teste dedicado e confirmado (nunca o MySQL legado), configure a URL privada e execute manualmente `npx prisma migrate dev --name init`. Esse comando pode precisar de shadow database: valide as permissões e o destino antes de executá-lo. Revise o SQL gerado e teste restore antes de aprovar qualquer deploy. Não usar db push em produção.

Porta padrão 3001. Prisma conecta sob demanda na primeira consulta e desconecta no encerramento do Nest; health funciona mesmo sem DATABASE_URL. Não há mock ou fallback de dados. Sem banco, endpoints de dados não estão operacionais.

## Scripts e limites

`dev` usa watch; `start` compila/inicia via Nest; `build` gera dist; `start:prod` executa dist/main.js; `type-check` valida TS; `prisma:validate` valida schema; `prisma:generate` gera o client local. Build/type-check pressupõem client gerado e não consultam banco.

Para validate/generate sem banco, pode-se definir DATABASE_URL fictícia apenas no ambiente do processo; esses comandos não conectam ao banco. Não persistir essa URL em .env.

`npm test` compila e executa os testes node:test com Prisma simulado, sem banco e sem seed. Cobrem senha/token, login/guard/cookies/logout, validação, rascunho, publicação, paginação/filtro público e erros. Testes reais de integração PostgreSQL (constraints, transações, concorrência e persistência) continuam pendentes. updatedAt obrigatório segue esta etapa; a futura importação deverá documentar a política para datas históricas desconhecidas.

## Bloqueadores antes de produção

Não ativar o admin nem publicar conteúdo real em produção nesta etapa. **CSRF é obrigatório antes de ativar o admin em produção**, pois a autenticação usa cookie. SameSite=Lax não substitui essa proteção. Ainda faltam rate limiting (especialmente login), sanitização robusta de HTML, CSP/headers, upload seguro quando implementado e testes com PostgreSQL real. contentHtml é armazenado e retornado sem sanitização: não inserir conteúdo não confiável no DOM. CORS cross-origin/credentials não foi habilitado. Não há frontend, upload, likes, tags, OAuth ou migração do MySQL.

Nest permanece em 11.2.8. O override exato de Multer 2.5.0 corrige a dependência transitiva 2.4.0 sem subir Nest para v12. Não há endpoint de upload nesta etapa; a futura implementação de uploads ainda exige testes multipart e limites próprios. Não usar audit fix --force para atualizar esta fundação.

Validação em 24/10/2026: npm audit sem vulnerabilidades reportadas; deepmerge-ts 8.0.2 via @prisma/config 7.10.1. Validate/generate, type-check/build e health sem DATABASE_URL aprovados. Isso não substitui testes de integração com PostgreSQL provisionado, ainda não realizados.
