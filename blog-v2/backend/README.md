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
- `GET /api/blog/v1/posts`: resumos publicados, publishedAt desc (nulls por último), createdAt/id desc como desempate; sem HTML bruto, campos administrativos ou paginação nesta fase.
- `GET /api/blog/v1/categories`: id/name/slug ordenados por nome e id.

Porta padrão 3001. Prisma conecta sob demanda na primeira consulta e desconecta no encerramento do Nest; health funciona mesmo sem DATABASE_URL. Não há mock ou fallback de dados. Sem banco, endpoints de dados não estão operacionais.

## Scripts e limites

`dev` usa watch; `start` compila/inicia via Nest; `build` gera dist; `start:prod` executa dist/main.js; `type-check` valida TS; `prisma:validate` valida schema; `prisma:generate` gera o client local. Build/type-check pressupõem client gerado e não consultam banco.

Para validate/generate sem banco, pode-se definir DATABASE_URL fictícia apenas no ambiente do processo; esses comandos não conectam ao banco. Não persistir essa URL em .env.

Auth, cookies, CSRF, rate limiting, uploads, sanitização, paginação e frontend ficam para etapas futuras. Não expor esta fundação como produção. Admin/AdminSession são somente modelos; não há endpoints administrativos. updatedAt obrigatório segue esta etapa; a futura importação deverá documentar a política para datas históricas desconhecidas.

Nest permanece em 11.2.8. O override exato de Multer 2.5.0 corrige a dependência transitiva 2.4.0 sem subir Nest para v12. Não há endpoint de upload nesta etapa; a futura implementação de uploads ainda exige testes multipart e limites próprios. Não usar audit fix --force para atualizar esta fundação.

Validação em 24/10/2026: npm audit sem vulnerabilidades reportadas; deepmerge-ts 8.0.2 via @prisma/config 7.10.1. Validate/generate, type-check/build e health sem DATABASE_URL aprovados. Isso não substitui testes de integração com PostgreSQL provisionado, ainda não realizados.
