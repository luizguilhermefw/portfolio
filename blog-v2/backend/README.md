# Blog V2 — backend

Fundação isolada NestJS 11 + TypeScript + Prisma 7 + MySQL, ainda fora de produção. O portfólio e o blog PHP não são modificados. Arquitetura: [documento](../../docs/blog-v2-architecture.md).

## Desenvolvimento

Requer Node 22.14+ e npm. Execute tudo neste diretório:

```sh
npm install
# Copie .env.example para .env e configure DATABASE_URL e PORT.
npm run prisma:validate
npm run prisma:generate
npm run dev
```

O runtime e `prisma.config.ts` leem `.env` local usando Node; variáveis do ambiente têm precedência. Nunca versionar credenciais. A URL da CLI fica em `prisma.config.ts`, não no schema. Prisma, client e @prisma/adapter-mariadb estão alinhados em 7.10.1; o driver mariadb 3.5.4 atende MySQL/MariaDB. O banco oficial do Blog V2 passa a ser MySQL; o documento de arquitetura anterior descreve a decisão histórica PostgreSQL, substituída por esta etapa.

O backend usa ESM (`type: module`, TypeScript NodeNext e imports locais com `.js`). O generator `prisma-client` gera TypeScript em `src/generated/prisma`, ignorado pelo Git e compilado junto com o backend. Execute generate antes do primeiro build/type-check. Não há geração automática no install do Prisma 7.

Nenhuma migration, banco ou seed foi criado. Configurar a URL não cria tabelas: endpoints de dados exigem MySQL com schema provisionado em uma futura etapa aprovada. Não executar migrations no MySQL legado.

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

Paginação retorna `{ items, page, limit, total, totalPages }`. Defaults: page=1, limit=10; limit máximo 100 e page máximo 100000. Admin ordena por updatedAt/id desc. Busca em título/conteúdo, exigindo collation _ci no MySQL para preservar case-insensitivity. Consulta de itens/total usa snapshot RepeatableRead. Rascunhos nunca passam pelo filtro público, mesmo com publishedAt histórico.

Criação exige title, slug e contentHtml. Slug explícito: 1–200 caracteres, letras minúsculas ASCII, números e hífens entre segmentos; unicidade garantida pelo banco (409 em conflito). Não há geração automática nem histórico de redirects nesta fase: alterar slug publicado pode quebrar links, portanto revisar antes de mudar. Campos opcionais: excerpt, categoryId, imageUrl, metaDescription. categoryId deve existir; null permite limpar campos opcionais no PATCH. imageUrl aceita apenas URL HTTP/HTTPS absoluta. Campos arbitrários, status, IDs/datas legadas no body são rejeitados com 400. Status muda apenas pelos endpoints próprios.

Publish verifica os campos obrigatórios e define a primeira publishedAt por escrita condicional; chamadas repetidas não a substituem. Isso NÃO equivale a sanitização HTML. Erros Prisma são convertidos em respostas genéricas 400 (referência), 404 (ausente), 409 (unicidade) ou 500, sem SQL/stack/hashes no JSON.

## Sessão e primeiro administrador

Token opaco de 32 bytes aleatórios; somente SHA-256 do token fica em AdminSession. Cookie `blog_session`, HttpOnly, SameSite=Lax, Path=/api/blog/v1, Secure quando NODE_ENV=production; expiração alinhada ao banco. TTL absoluto de sete dias por padrão, configurável por SESSION_TTL_DAYS (inteiro 1–30), sem renovação deslizante. Login bem-sucedido substitui a sessão anterior do mesmo admin apresentada no cookie. Senhas Argon2id (64 MiB, três iterações, paralelismo 1); usuário/senha inválidos recebem o mesmo 401.

Guard valida cookie e expiresAt no servidor em todos os endpoints admin, me e logout. Logout usa deleteMany, tolerando revogação concorrente; nova chamada com sessão já revogada/ausente retorna 401 pelo guard. O cliente pode tratar esse 401 como já desconectado. Sessões expiradas não autenticam e poderão ser removidas por manutenção futura; nenhum job foi adicionado. Nunca colocar sessão no localStorage.

Depois de configurar um MySQL de desenvolvimento/teste e aplicar a migration aprovada, execute explicitamente em terminal confiável:

```sh
npm run admin:create -- seu-username
```

O CLI pede senha e confirmação sem eco (12–1024 caracteres), não aceita senha via argv/env/arquivo, recusa execução não interativa e não sobrescreve usuário existente. Username aceita letras ASCII, números, ponto, hífen e underscore (1–100). Não há admin/senha padrão, cadastro público ou provisionamento no startup. O CLI não foi executado nesta etapa.

## Banco e primeira migration

Não havia .env, DATABASE_URL ou diretório migrations configurado nesta adaptação. Nenhuma migration foi criada/executada; nenhum comando migrate, db push ou db pull foi executado. Não criar tabelas, admin ou conectar à Hostinger nesta etapa.

Antes da futura conexão, obter do painel autorizado o host MySQL remoto, porta (normalmente 3306), banco, usuário e senha. Copiar .env.example para .env local ignorado pelo Git e substituir os placeholders da DATABASE_URL. Fazer URL encoding individual do usuário/senha, especialmente caracteres como @, :, /, #, %, ? e &; não codificar a URL inteira. Nunca publicar a URL, senha ou logs de conexão.

DATABASE_URL é a única fonte de credenciais, tanto para CLI (prisma.config.ts preservado) quanto para runtime. PrismaMariaDb 7.10.1 aceita string e normaliza mysql:// para o driver MariaDB; a assinatura e implementação instaladas foram inspecionadas. Runtime acrescenta timezone=+00:00 via URLSearchParams para DATETIME em UTC, sem imprimir credenciais. Confirmar também timezone UTC do servidor/conexão CLI antes de usar defaults de data. Sem URL, construir o provider não conecta: o health permanece independente do banco.

Confirmar na Hostinger: acesso remoto/IP permitido, versão MySQL, engine InnoDB, charset utf8mb4, limites de conexão e política TLS/certificados. Parâmetros TLS do driver e da CLI podem diferir; não presumir equivalência dos parâmetros de URL nem desabilitar validação de certificado. Configuração remota não foi verificada.

O banco PHP e suas tabelas permanecem independentes. Não reutilizar ou mapear tabelas antigas automaticamente. Preferir banco lógico exclusivo para V2; se for necessário compartilhar a instância/banco, aprovar primeiro nomes, permissões, colisões, backup/restore e plano de isolamento. Só planejar a primeira migration após revisão e autorização separada.

### Compatibilidade do schema

- Admin, AdminSession, Category, Post e PostStatus preservados. Enum DRAFT/PUBLISHED é suportado pelo conector MySQL.
- UUIDs continuam gerados pelo Prisma, armazenados em CHAR(36); FKs usam o mesmo tipo.
- DateTime passa de timestamptz(3) para DATETIME(3), que não armazena timezone. UTC passa a ser convenção explícita; nenhuma data real foi convertida.
- Slugs únicos usam VARCHAR(200), compatível com o limite do DTO de Post. Username permanece VARCHAR(191) padrão (DTO limita a 100); tokenHash usa CHAR(64). A collation influencia igualdade/unicidade de strings, inclusive username: revisar esse efeito antes de conectar.
- legacyId Int? @unique continua permitindo múltiplos NULL e impedindo IDs não nulos duplicados.
- contentHtml usa LONGTEXT: TEXT do MySQL tem limite menor que TEXT do PostgreSQL e não comportaria todo o limite atual de 200 mil caracteres do DTO. Campos textuais não indexados também usam LONGTEXT para evitar truncamento pelo VARCHAR(191) padrão; limites de API não foram alterados.
- Relações opcionais, Cascade de sessões e SetNull da categoria preservados. Índices de expiração e status/publishedAt/createdAt/id permanecem válidos no schema.
- Busca usa contains sem mode, indisponível no client MySQL. É obrigatório configurar collation utf8mb4 case-insensitive (_ci) nas colunas pesquisadas para preservar a busca atual. Sensibilidade a acentos depende da collation escolhida e deve ser testada.
- Constraints, collation, timezone, índices e limites de pacote do servidor ainda precisam de teste integrado em MySQL isolado. Validação Prisma não certifica a configuração da Hostinger.

Referências: [Prisma MySQL/MariaDB](https://docs.prisma.io/docs/v7/prisma-orm/quickstart/mysql), [case sensitivity](https://docs.prisma.io/docs/orm/v6/prisma-client/queries/case-sensitivity).
.
