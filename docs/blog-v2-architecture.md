# Blog V2 — auditoria e plano de migração

Data: 24/10/2026. Branch: `feature/blog-v2-foundation`.
Status: proposta para revisão; nenhuma migração ou mudança de produção autorizada nesta etapa.

## 1. Estado atual e limites da auditoria

O Sintaxe Criativa funciona separadamente da home Vue/Vite: páginas HTML consultam endpoints PHP, que usam `mysqli` e um banco compatível com MySQL. O administrador usa páginas PHP e sessão. A indicação de que está funcionando em produção vem do responsável pelo projeto; esta auditoria é estática, não um teste do servidor de produção.

Foram inspecionados os HTML, PHP, três scripts e dois estilos solicitados, `.htaccess`, configurações do portfólio e diretórios de mídia. Não foi encontrado dump SQL/schema versionado. Tipos, comprimentos, defaults, índices, constraints, engine, versão do servidor e fuso do banco NÃO estão confirmados. Não se acessou o banco nem se leu o conteúdo secreto de `db_config.php`.

Dependências: PHP com mysqli (alguns endpoints usam `get_result`), configuração privada `db_config.php`, sessões PHP, diretório gravável `uploads/`, Apache/rewrite para URLs sem extensão, Google Fonts/Fira Code, Font Awesome via CDN, Analytics e favicons/webmanifest. `src/data/projects.ts` aponta para `/blog`. O build Vite da home não valida PHP nem empacota automaticamente uma aplicação PHP completa.

Fundação desta rodada: somente este documento. Criar aplicativos vazios agora não reduz os riscos de dados, SEO ou hospedagem ainda pendentes.

## 2. Funcionalidades atuais

- `blog.html` + `script_blog.js`: listagem decrescente por data, resumo de 150 caracteres do conteúdo bruto, capa opcional, busca por título/conteúdo, filtro por categoria, cinco posts recentes, contador/toggle de curtidas. Sem paginação.
- A listagem consulta `check_admin.php`; quando autenticado, mostra editar/excluir. A autorização efetiva também existe nos endpoints de escrita.
- `post_individual.html?id=ID` + `script_post_individual.js`: busca por ID, título atualizado no navegador, data, capa, HTML do artigo e retorno ao blog. Autor Luiz é texto fixo, não relação no banco. O elemento de categoria do cabeçalho não é preenchido; o endpoint individual não retorna categoria. Não há interação de curtida implementada nessa página, apesar de CSS relacionado.
- `admin.php`: formulário de criação com título, conteúdo em textarea HTML, URL de capa ou upload; upload inline separado permite copiar/inserir uma tag `img`. Não é um editor rich text.
- `edit_post.php`: edita título, conteúdo e capa; não contém o uploader inline presente na criação. Gestão/remoção é feita pela listagem pública autenticada, não por dashboard independente.
- Categorias são lidas pelo backend, mas os formulários e INSERT/UPDATE atuais não as administram. Não há evidência de tags, rascunhos, agendamento, comentários ou compartilhamento dedicado.
- Scripts implementam canvas de constelação e botão de topo. Estilos usam tema escuro/ciano, cards/sidebar e empilhamento até 768px; admin tem CSS próprio. Preservar leitura e identidade, não copiar automaticamente todas as regras legadas.

## 3. Endpoints PHP atuais

| Arquivo | Entrada/acesso | Operação e resposta |
| --- | --- | --- |
| `login.php` | GET formulário; POST username/password | Busca `admins`, verifica `password_verify`, grava sessão e redireciona para admin |
| `logout.php` | Acesso por link, sem restrição de método | Limpa/destrói sessão, redireciona ao login |
| `check_admin.php` | Público, sessão opcional | JSON `isAdmin`, eventualmente `adminUsername` |
| `admin.php` | Sessão admin | Tela de criação e mensagens flash |
| `edit_post.php` | Sessão admin, GET id | Tela de edição; consulta título/conteúdo/capa |
| `get_posts.php` | GET category/search opcionais | Array com id, title, content, image_url, created_at, category, likes_count |
| `get_sidebar_data.php` | Público | Categorias com contagem e cinco recentes (id/title) |
| `get_single_post.php` | GET id | id, title, content, image_url, created_at; objeto de erro se inválido/ausente |
| `save_post.php` | Admin, POST multipart | INSERT title/content/image_url; redirect e mensagem de sessão |
| `update_post.php` | Admin, POST multipart com post_id | UPDATE title/content/image_url; redirect |
| `delete_post.php` | Admin, POST post_id | DELETE post; tenta apagar capa local; JSON success/error |
| `like_post.php` | Público, POST post_id | Toggle em post_likes por REMOTE_ADDR; JSON success/action/likes_count |
| `upload_inline_image.php` | Admin, arquivo inline_image | Salva arquivo e responde success/filePath; não restringe método explicitamente |

IDs são convertidos para inteiro em diversos endpoints. Consultas de dados usam prepared statements. Erros HTTP não são uniformes: vários erros respondem 200 com JSON; alguns retornam detalhes internos. Essa API não deve ser substituída enquanto o frontend legado depender dela.

## 4. Modelo legado inferido

| Tabela | Campos comprovados por consultas | Relações e incertezas |
| --- | --- | --- |
| `admins` | id, username, password_hash | Sem relação de autoria observada; algoritmo do hash não confirmado |
| `posts` | id, title, content, image_url, created_at, category | Categoria textual; capa pode ser URL externa ou caminho relativo; default da data não demonstrado |
| `post_likes` | id, post_id, ip_address | Relação lógica com posts; FK/cascade e unicidade por IP não comprovadas |

`likes_count` é COUNT calculado, não coluna demonstrada. Não há tabela de mídia comprovada; referências de imagens também existem dentro do HTML. Não inferir User público, comentários, tags ou múltiplos autores.

A — necessário para migrar: posts e todos os campos acima, identidade legada, categorias textuais, bytes/referências de imagens, datas e curtidas. Administrador precisa de acesso equivalente, não necessariamente reutilização automática da senha.

B — melhorias V2 propostas: slug único, excerpt limpo, status rascunho/publicado, datas de atualização/publicação, SEO, catálogo de mídia e categorias normalizadas. Tags ficam para uma fase posterior mediante necessidade editorial; não criar Tag só por convenção.

## 5. Limitações e riscos encontrados

| Evidência | Risco/impacto | Tratamento planejado |
| --- | --- | --- |
| save/update usam `strip_tags` com tags permitidas; artigo usa `innerHTML` | Atributos/event handlers e protocolos perigosos não são sanitizados; risco de XSS persistente | Sanitizador HTML mantido, allowlist de atributos/protocolos, revisão da importação |
| escapeHTML dos scripts usa text node e depois interpolação em atributos | Não substitui escaping contextual de aspas/URLs | Bindings Vue para atributos e validação de URLs |
| Escritas autenticadas sem token CSRF observado | Requisições indevidas com sessão; depende também dos cookies reais | CSRF + validação de origem + cookies seguros |
| Login sem regeneração de sessão/rate limit observados | Fixação/tentativas repetidas; configuração do servidor desconhecida | Renovação do ID, expiração e limitação no novo login |
| Upload verifica extensão e 2 MiB, não conteúdo real | Arquivo inválido disfarçado de imagem | MIME por assinatura, decodificação, limites de pixels e serving seguro |
| DELETE apaga capa por prefixo uploads/ | Prefixo não é confinamento canônico; mídia compartilhada pode ser removida; inline não é gerenciada | IDs de mídia, resolução segura e referências antes de apagar |
| UPDATE não remove capa antiga; upload ocorre antes da validação final | Arquivos órfãos | Estado temporário e coleta posterior controlada |
| Toggle por IP com SELECT seguido de INSERT | Concorrência, NAT/IP compartilhado, privacidade; unicidade não confirmada | Transação/constraint e política de identidade explicitamente aprovada |
| Erros PHP expõem detalhes do banco | Divulgação de infraestrutura | Erros públicos genéricos e logs privados |
| Conteúdo completo em listagem sem limite | Payload crescente e resumos contendo marcação | Paginação e excerpt textual |
| Títulos são escapados ao salvar e novamente ao renderizar | Entidades visíveis/double encoding | Normalização controlada e fixtures com acentos/entidades |
| Artigos carregados por JS, título genérico no HTML inicial | Compartilhamento/SEO dependem de renderização JS | HTML pré-renderizado por artigo |

Também há animação contínua sem tratamento de reduced-motion observado, busca sem label explícito e sidebar saltando para h4. São critérios da futura interface, não correções nesta rodada. Nenhuma exploração ativa foi executada. Não afirmar comprometimento do ambiente.

## 6. Arquitetura proposta

Estrutura futura, NÃO criada agora:

```text
blog-v2/
  frontend/       Vue 3 + TypeScript + Vue Router; público e admin
  backend/        NestJS + Prisma + PostgreSQL; REST
```

Package/lock/config/build separados da raiz; não introduzir workspaces ou dependências no portfólio sem necessidade. Backend modular monolítico, sem microserviços. Banco PostgreSQL separado do MySQL legado. Preview isolado e não indexável durante a migração. Não compartilhar sessão PHP com a nova API.

## 7. Frontend e editor

Rotas públicas propostas: `/blog`, `/blog/artigo/:slug`; filtros e página na query. Admin: `/blog/admin/login`, listagem, novo, edição e preview autenticado. Vue Router só no novo app. Composables/API client tipado e estado local inicialmente; Pinia apenas se surgir estado compartilhado suficiente para justificá-lo.

Público: categorias, busca, paginação, recentes, capa/alt, leitura responsiva, copiar link e compartilhamento nativo com fallback. Admin: dashboard simples de gestão, CRUD, rascunho/publicação, preview, categorias e mídia. Tags planejadas como evolução opcional, não requisito de migração.

Editor: Markdown facilita código e manutenção, mas converter o HTML legado automaticamente arrisca perda de formatação. Rich text facilita imagens e escrita, mas exige dependência, schema e testes de round-trip. HTML puro preserva o formato atual, porém é menos amigável e não elimina XSS.

Recomendação: HTML sanitizado como formato de publicação/importação, rich text simples para autoria na fase admin, após testar compatibilidade com amostras reais. Blocos de código e imagens com alt devem ser suportados. Não converter todo o acervo para Markdown. Manter original em backup privado; HTML não suportado exige revisão, nunca descarte silencioso. Preview usa a mesma sanitização/renderização pública. Nenhum editor instalado agora.

Aceite futuro: 320/375/768/1024/1440px, teclado/foco, labels, um h1 por página, hierarquia coerente, imagens proporcionais, código longo com scroll local, reduced-motion, estados loading/erro/vazio. Não esconder overflow para mascarar defeitos.

## 8. Backend proposto

Módulos Auth, Posts, Categories, Media e Prisma; Likes preservado por módulo simples. Controllers REST, DTOs de entrada e saída explícitos, regras em services, persistência Prisma. Guard admin no servidor; guard de rota frontend é apenas UX. Busca inicial parametrizada por título/conteúdo textual, ordenação estável por publishedAt/id e paginação limitada; full-text PostgreSQL só se volume justificar.

Não expor hashes/sessões/original não sanitizado/IPs em DTOs. Somente posts publicados no público, recentes, sitemap e contagens. Rascunho nunca acessível via slug público. Erros 400/401/403/404/409/413/415/429/500 coerentes. Testes unitários e integração para autenticação, filtros, publicação, sanitização, mídia e migração antes do cutover.

## 9. Modelo Prisma proposto

Modelo lógico para futura tradução/validação em `schema.prisma`, não schema real nem migration executável. PostgreSQL; IDs novos UUID, `legacyId` único nullable para importação idempotente.

| Model | Campos propostos | Restrições |
| --- | --- | --- |
| Admin | id UUID, legacyId Int?, username String, passwordHash String, createdAt DateTime | username único; sem cadastro público/roles |
| Post | id UUID, legacyId Int?, title String, slug String, contentHtml String/Text, excerpt String?, legacyCategory String?, categoryId UUID?, imageUrl String?, coverMediaId UUID?, createdAt DateTime, updatedAt DateTime?, publishedAt DateTime?, status enum DRAFT/PUBLISHED, metaDescription String? | slug e legacyId únicos; índice status/publishedAt/id |
| PostLike | id UUID, legacyId Int?, postId UUID, visitorKey String | FK Post; unique(postId, visitorKey) após auditar duplicatas legadas |
| Category | id UUID, name String, slug String | slug único; Post N:1 opcional; não mesclar nomes automaticamente |
| Media | id UUID, storageKey String, originalPath String?, mime String, bytes BigInt, width Int?, height Int?, alt String?, createdAt DateTime | storageKey único; data de mídia legada não deve ser inventada |
| AdminSession | id UUID, tokenHash String, adminId UUID, expiresAt DateTime | hash único, FK Admin, índice expiração |

Category/Media são melhorias justificadas por funcionalidades existentes, não tabelas legadas confirmadas. AdminSession decorre da escolha de sessão abaixo. Não precisa de User genérico ou Tag neste início. Relação de capa: Post N:1 Media opcional; inline começa por referências HTML com inventário antes de exclusão, não cria relação falsa já existente. `imageUrl` preserva capas externas e caminhos antigos até o mapeamento.

Datas de post devem ser importadas com fuso confirmado; updatedAt pode permanecer nulo quando desconhecido. createdAt de Media significa cadastro no V2, não criação histórica do arquivo. Rascunho é default dos posts novos; importados existentes serão publicados após revisão. Não atribuir autoria histórica por FK sem evidência.

Curtidas: preferir visitorKey HMAC do IP normalizado com segredo privado para manter a semântica inicial sem expor IP bruto. Isso ainda é dado pseudonimizado, não anonimização. Confirmar proxy/fonte do IP e política de retenção; mudança de IP/NAT continua sendo limitação. Se houver duplicatas legadas, bloquear importação até decidir preservação por agregado/registro histórico, sem deduplicação silenciosa que reduza contagem.

## 10. REST proposto

Prefixo ilustrativo `/api/blog/v1`; separado dos endpoints PHP atuais.

| Método/caminho | Acesso | Finalidade |
| --- | --- | --- |
| GET /posts?search=&category=&page=&limit= | Público | Resumos publicados, total/página; limite máximo validado |
| GET /posts/:slug | Público | Artigo publicado, metadados e contagem |
| GET /recent-posts | Público | Últimos cinco publicados |
| GET /categories | Público | Categorias e contagens publicadas |
| POST /posts/:id/like | Público limitado | Toggle compatível inicialmente, transacional; retornar estado real |
| POST /auth/login | Público limitado | Credenciais, cookie de sessão e contexto CSRF |
| GET /auth/me | Admin | Estado da sessão |
| POST /auth/logout | Admin + CSRF | Revogação e limpeza de cookie |
| GET/POST /admin/posts | Admin | Gestão/criação de rascunho |
| GET/PATCH/DELETE /admin/posts/:id | Admin | Ler/editar/excluir com confirmação |
| POST /admin/posts/:id/publish | Admin | Validar e publicar |
| POST /admin/posts/:id/unpublish | Admin | Retirar do público e invalidar páginas/cache |
| GET /admin/posts/:id/preview | Admin | Preview privado, no-store/noindex |
| POST/PATCH/DELETE /admin/categories[/:id] | Admin | Taxonomia; impedir remoção em uso ou reatribuir explicitamente |
| POST /media | Admin | Upload multipart validado |
| GET /admin/media | Admin | Inventário paginado |
| DELETE /admin/media/:id | Admin | Só sem referências confirmadas |

Exclusão de artigo não apaga automaticamente arquivos compartilhados. Tags/endpoints associados ficam fora do primeiro contrato. APIs legadas continuam operando com PHP até migração dos consumidores.

## 11. Autenticação

Legado: sessão com admin_logged_in/admin_id/admin_username; password_verify sobre admins.password_hash. Não se confirmou configuração de cookie no servidor.

Recomendação V2: sessão opaca persistida no PostgreSQL, cookie HttpOnly/Secure/SameSite e escopo restrito, expiração ociosa/absoluta e renovação no login. Adequada a um administrador no browser, com logout/revogação simples. JWT é viável, mas refresh/revogação acrescentariam complexidade sem benefício comprovado; não guardar credencial em localStorage. A OWASP recomenda controles explícitos de ciclo de vida e proteção de sessão: [Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

Hash Argon2id com parâmetros aferidos no host e biblioteca mantida; confirmar recomendação/parâmetros na implementação. Provisionamento único fora do público, sem senha em seed versionado. Recriar senha com procedimento privado é preferível a assumir compatibilidade do hash PHP desconhecido. Guard server-side em toda escrita, CSRF em requisições autenticadas, limitação por IP/conta com erros genéricos; não bloquear permanentemente a única conta. Sem OAuth ou RBAC nesta fase.

## 12. Upload/media

Inventário local: `images_blog/avatarLuiz.png` e cinco PNGs `postimg_*` em uploads. A ausência de arquivos inline locais não prova ausência em produção ou no conteúdo remoto. Fazer inventário real antes de migrar.

Atual: jpg/jpeg/png/gif até 2 MiB, nomes uniqid, capa enviada prevalece sobre URL; inline responde caminho relativo. V2 mantém limite inicial, com validação de assinatura/MIME e decodificação, limite de pixels e bytes no proxy e aplicação. Não confiar em extensão ou Content-Type do cliente. Recusar SVG/HTML/executáveis no primeiro ciclo. Arquivo temporário em quarentena, nome UUID gerado no servidor, extensão derivada do tipo validado. Orientação EXIF/privacidade e GIF animado exigem testes, sem conversão destrutiva automática.

Storage local em volume persistente fora da árvore executável/releases; serving com tipo correto, nosniff e sem execução. API retorna ID/URL/alt/dimensões. Interface StorageAdapter prepara futura troca por object storage, não implementado agora. Não baixar URLs externas arbitrárias no backend (risco SSRF). Originais e backups preservados; limpeza só após checar capa e HTML de todos os posts. Orientação: [OWASP File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

## 13. SEO e renderização

SPA Vue pura funciona bem no admin, mas não é a recomendação para os artigos: HTML inicial vazio depende de JS para conteúdo/metadados e pode prejudicar previews de compartilhamento. SSR/SSG entregam HTML inicial; SSR exige runtime/cache, SSG exige regenerar páginas ao publicar. A documentação Vue apresenta essas diferenças: [SSR/SSG](https://vuejs.org/guide/scaling-up/ssr) e [formas de usar Vue](https://vuejs.org/guide/extras/ways-of-using-vue).

Recomendação preliminar: Vue 3/TS com pré-renderização SSG das páginas públicas e SPA admin. Depende de confirmar volume/frequência de publicação e capacidade de build acionado pelo backend. Se a operação exigir atualização imediata sem rebuild, avaliar SSR Vue. Nuxt é alternativa a apresentar para aprovação, NÃO decisão automática nem dependência adicionada. Provar renderização/roteamento em spike antes de escolher ferramenta.

Cada artigo deve entregar no HTML inicial: title, description, canonical absoluto, OG title/description/image/url/type e Article JSON-LD com dados verdadeiros (headline, autor, datas conhecidas, imagem). Serializar JSON-LD com segurança. Slugs persistentes; mudança exige redirect. Sitemap apenas com URLs canônicas publicadas; robots deve apontá-lo. Admin/preview autenticados e noindex; robots não substitui autenticação. Busca interna noindex; política de categorias/paginação aprovada para evitar duplicação. Página inexistente responde 404 real, não fallback 200 da SPA. Validar HTML sem JS, rich results e previews sociais antes do cutover; SEO não é garantia de ranking.

## 14. Migração de dados

1. Obter dump autorizado com DDL, contagens, timezone/charset e inventário completo de uploads/inline/URLs externas; backup criptografado fora do Git e teste de restauração.
2. Inspecionar nulls, entidades HTML, categorias, duplicatas/órfãos de likes, IDs e caminhos. Não usar API de listagem como único backup: ela não contém todos os dados administrativos/curtidas.
3. Importador offline idempotente por legacyId em staging; nunca escrever no MySQL original. Manifesto ID antigo → UUID → slug e caminho antigo → mídia, com checksums.
4. Preservar título/conteúdo original no backup. Produzir HTML sanitizado e relatório de diferenças para aprovação; não descartar informação silenciosamente. Testar nl2br/pre/code, acentos e double encoding antes de normalizar.
5. Copiar bytes de capa/inline preservando nomes inicialmente. Reescrever referências relativas somente com mapa completo; `uploads/x` em uma URL aninhada muda de resolução. Preferir caminho absoluto validado ou URL de mídia mapeada; manter aliases antigos.
6. Converter datas com fuso confirmado; não assumir UTC. Criar slugs estáveis com sufixo legado em colisões; não regenerá-los em cada edição. Categorias sem valor continuam sem valor.
7. Migrar curtidas com reconciliação por post e política de privacidade aprovada. Não transportar IPs em arquivos públicos. Relatar registros incompatíveis; nenhuma perda silenciosa.
8. Comparar contagens, campos, datas, somas de likes, checksums e renderização de todos os artigos/amostra representativa, incluindo imagens e links internos.
9. Para corte, congelar brevemente escritas legadas (incluindo likes), fazer exportação final e reconciliar. Sem dual-write improvisado. Backup e rollback testados; depois de novas escritas no V2, rollback exige exportar/reconciliar essas escritas, não apenas trocar roteamento.

Nenhum dump, credencial, arquivo de produção ou migração foi criado/executado nesta etapa.

## 15. Compatibilidade de URLs

`.htaccess` atual resolve internamente extensões HTML/PHP quando o arquivo correspondente existe; não contém roteamento Vue do blog. `/blog` e `/blog.html` chegam à listagem; scripts geram `blog.html?search=...`, `?category=...` e `post_individual.html?id=...`. `/post_individual?id=...` também pode resolver pela regra atual. Login/admin têm versões com/sem extensão.

No cutover, manter `/blog` canônico. Redirecionar `/blog.html` preservando filtros reconhecidos; mapear ambas as formas de post individual por ID para `/blog/artigo/:slug` via 301 no servidor, em um salto. IDs desconhecidos: 404/410 conforme registro, não redirect genérico ao blog. Preservar UTF-8 e query de categoria/busca; mudanças de categoria exigem mapa. Slugs alterados precisam de histórico de redirects aprovado.

Compatibilidade das imagens deve continuar independentemente dos redirects de artigos. PHP APIs e login antigo não recebem redirect cego para HTML: manter durante coexistência e retirar consumidores explicitamente. Staging usa host separado protegido para não competir com produção. Não alterar `.htaccess` até aprovação da infraestrutura, mapa e testes de URLs.

## 16. Deploy

Hospedagem PHP atual não comprova suporte a processos Node persistentes. Nest exige runtime Node compatível, processo supervisionado, HTTPS/reverse proxy, PostgreSQL, secrets, logs, backups e volume persistente para mídia. Versões/planos/custos devem ser confirmados antes de contratar; não foi auditada a conta de hospedagem.

Opções: VPS dá controle de proxy/volume, mas exige manutenção, patching e restauração; plataforma Node gerenciada (por exemplo Railway) reduz operação, mas requer validar persistência, limites, região, custos e backups. Object storage pode simplificar escala depois. Nunca depender do filesystem efêmero de um deploy para uploads.

Preferência: público em `https://<dominio>/blog`, API/admin via proxy de mesma origem para simplificar cookies/CORS; exige roteamento suportado pelo host. Alternativa `https://api.<dominio>` mantém deploy separado, mas exige allowlist CORS/credentials e cookies cuidadosamente configurados. Subdomínio dedicado do blog simplifica infraestrutura se proxy não existir, porém muda URLs e exige estratégia SEO adicional. Os domínios são exemplos, não confirmação de propriedade/configuração.

Builds separados; publicar o V2 nunca deve sobrescrever a raiz do portfólio, PHP ou uploads. Migrações PostgreSQL versionadas e revisadas, executadas por etapa controlada, não em cada request. Health check, logs sem segredos, alertas de falha e restore validado antes do corte.

## 17. Segurança e testes de aceite

DTOs com allowlist, limites de tamanho, IDs/enum/paginação validados e campos inesperados rejeitados. Prisma com operações parametrizadas; SQL raw concatenado continua perigoso, ORM não elimina todos os riscos. Privilégios mínimos no banco. CORS restrito não é autenticação. TLS, headers de segurança e CSP ajustada aos recursos realmente usados; erros públicos sem SQL/stack/paths.

HTML: validar entrada não equivale a sanitizar. Usar biblioteca mantida, allowlist de tags/atributos/protocolos, remover handlers/scripts/iframes não autorizados e estilos perigosos. Bloquear javascript: e URLs não aprovadas; renderizar texto via bindings e HTML apenas pelo caminho sanitizado. A política deve ser aplicada no save/import e defensivamente antes da publicação de conteúdo histórico. Referência: [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

Testes obrigatórios futuros: acesso anônimo às escritas, CSRF, sessão expirada/revogada, senha incorreta/rate limit, XSS em atributos/URLs/código, uploads com extensão falsa e excesso de pixels/bytes, path traversal, IDs inexistentes, concorrência de likes, mídia compartilhada, rascunho fora do sitemap/API, redirects e rollback. Não realizar ataques no blog de produção para esta auditoria.

## 18. Etapas, decisões pendentes e aceite

| Fase | Entrega pequena | Gate para avançar |
| --- | --- | --- |
| 1 — arquitetura/infra | Este documento; depois spike SSG/SSR e staging isolado | Aprovar renderização, host, auth, schema real e orçamento |
| 2 — backend/banco | Nest/Prisma/PostgreSQL, auth, posts, categorias, likes, media | Testes de segurança/contrato e restore |
| 3 — público | Vue/TS/Router, listagem/artigo/busca/paginação | HTML inicial/SEO, acessibilidade e mobile |
| 4 — admin | Login, gestão, editor, preview, draft/publicação | Nenhum rascunho público; round-trip de conteúdo |
| 5 — migração | Importador dry-run e reconciliação em staging | Conteúdo/mídia/datas/likes conferidos |
| 6 — SEO/redirects | Mapa completo de URLs, sitemap/metadados | Sem links perdidos, loops ou soft 404 |
| 7 — cutover | Backup, freeze, delta final e mudança aprovada | Smoke tests, monitoramento e rollback pronto |
| 8 — legado | Desativação só após janela de observação definida | Aprovação explícita; backups e redirects preservados |

Pendências: dump/DDL e fuso reais; quantidade/frequência de posts; inventário de produção; algoritmo de senha; política de likes/IP; capacidade de proxy/Node/storage; editor e estratégia SSG/SSR. Tags não bloqueiam migração. Nenhuma dependência ou diretório de aplicativo foi adicionado. O legado permanece produção até autorização de corte e não será removido automaticamente.
