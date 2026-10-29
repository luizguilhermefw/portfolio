# Blog V2 — frontend público

Projeto independente: Vue 3, TypeScript, Vite e Vue Router, sem workspace na raiz. Fetch nativo para as páginas públicas e a administração.

## Desenvolvimento

```sh
npm install
# Copie .env.example para .env, se precisar ajustar a API.
npm run dev
npm run type-check
npm test
npm run build
npm run preview
```

Acesse o endereço informado pelo Vite com /blog. Backend deve estar rodando separadamente em http://localhost:3001, com banco configurado. A administração exige uma conta existente; não cria admins.

## API e CORS

VITE_BLOG_API_BASE_URL define a base pública da API. Padrão: /api/blog/v1. Em desenvolvimento o Vite encaminha esse caminho para http://localhost:3001. O backend atual não habilita CORS: usar a URL absoluta diretamente entre origens diferentes exigiria uma política CORS específica. Nenhum CORS/backend foi alterado. A variável é pública e nunca deve conter senha/token. Reinicie o Vite após alterá-la.

O proxy é exclusivo do servidor de desenvolvimento; preview/produção exigem API na mesma origem ou uma URL configurada com CORS apropriado.

## Rotas

- /blog (query page para paginação, limit 9)
- /blog/artigo/:slug
- /blog/admin/login
- /blog/admin
- /blog/admin/posts
- /blog/admin/posts/novo
- /blog/admin/posts/:id/editar
- Página não encontrada dentro do escopo /blog

O Router usa base /blog. Links ao portfólio são links HTML comuns para /. O build tem base /blog/; o futuro servidor deverá servir assets e fallback SPA somente nesse prefixo. Não foi alterada nenhuma rota, regra .htaccess ou implantação do legado.

## Segurança e SEO antes de produção

As rotas administrativas verificam /auth/me e usam o AdminShell. Requisições admin são relativas a /api/blog/v1 com credentials: include. O navegador administra o cookie HttpOnly; nenhum token é lido ou armazenado pelo frontend. Somente a identidade fica em memória. O guard é conveniência de navegação: autorização continua sendo responsabilidade do backend. Erros 401 limpam a identidade e levam ao login; falhas de infraestrutura recebem mensagem genérica. O logout limpa o estado local mesmo em falha e avisa quando não foi possível confirmar a revogação no servidor.

Admin recebe título próprio e robots noindex,nofollow; o meta específico é removido ao voltar ao público. Isso não substitui autenticação. Antes do cutover, validar HTTPS/cookies de produção, política de origem/CSRF, limites de login e sanitização de HTML. Não há upload, editor rich text ou gestão de usuários/categorias. O UUID de categoria é opcional.

Os testes usam node:test e o TypeScript existente, com mocks de fetch: slug, mensagens de erro, payload editável, 401 e resposta 204. Não acessam o banco.

contentHtml é renderizado com v-html somente na página do artigo. **Pendente obrigatório: sanitizar HTML no backend antes de produção pública.** O frontend não implementa sanitização improvisada. Conteúdo deve ser confiável nesta etapa de desenvolvimento.

Título e meta description são atualizados no navegador. Uma SPA não resolve completamente indexação e social previews; avaliar pre-render/SSG conforme a arquitetura do Blog V2, incluindo metadados por artigo. Não há Nuxt/SSR nesta etapa.

Datas usam pt-BR e UTC, sem horário. Cards têm fallback CSS local para capa ausente ou indisponível. Estados de carregamento, erro, vazio e 404 não mostram detalhes internos da API. Requisições obsoletas são canceladas ao navegar.

Layout: uma coluna em mobile, duas a partir de 768px e três a partir de 1024px; artigo limitado a 800px. Sem lint configurado.
