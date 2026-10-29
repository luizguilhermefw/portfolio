<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { deletePost, getAdminPosts, publishPost, unpublishPost, type AdminPostSummary, type PaginatedAdminPosts, type PostStatus } from '../../api/admin';
import { adminErrorMessage } from '../../utils/admin-errors';
import { formatDate } from '../../utils/date';
import StatusBadge from '../../components/admin/StatusBadge.vue';
const route = useRoute(), router = useRouter();
const page = computed(() => { const n = Number(route.query.page ?? 1); return Number.isInteger(n) && n >= 1 && n <= 100000 ? n : 1; });
const search = ref(''), status = ref(''), result = ref<PaginatedAdminPosts | null>(null);
const loading = ref(false), busy = ref(false), error = ref(''), feedback = ref(''), reload = ref(0);
const query = computed(() => ({
  page: page.value,
  search: typeof route.query.search === 'string' ? route.query.search.slice(0, 200) : '',
  status: route.query.status === 'DRAFT' || route.query.status === 'PUBLISHED' ? route.query.status as PostStatus : undefined,
}));
watch([query, reload], async ([q], _old, onCleanup) => {
  const controller = new AbortController(); onCleanup(() => controller.abort());
  search.value = q.search; status.value = q.status ?? '';
  loading.value = true; error.value = ''; result.value = null;
  try { const data = await getAdminPosts(q, controller.signal); if (!controller.signal.aborted) result.value = data; }
  catch (e) { if (!controller.signal.aborted) error.value = adminErrorMessage(e); }
  finally { if (!controller.signal.aborted) loading.value = false; }
}, { immediate: true });
function filter() { void router.push({ name: 'admin-posts', query: { ...(search.value.trim() ? { search: search.value.trim() } : {}), ...(status.value ? { status: status.value } : {}) } }); }
function pageQuery(n: number) { return { ...route.query, page: String(n) }; }
async function action(post: AdminPostSummary, remove = false) {
  if (busy.value || (remove && !window.confirm('Excluir o post “' + post.title + '”? Esta ação não pode ser desfeita.'))) return;
  busy.value = true; error.value = ''; feedback.value = '';
  try {
    if (remove) await deletePost(post.id);
    else if (post.status === 'DRAFT') await publishPost(post.id);
    else await unpublishPost(post.id);
    feedback.value = remove ? 'Post excluído.' : post.status === 'DRAFT' ? 'Post publicado.' : 'Post despublicado.';
    reload.value++;
  } catch (e) { error.value = adminErrorMessage(e); }
  finally { busy.value = false; }
}
</script>
<template>
  <section>
    <div class="admin-heading"><h1>Posts</h1><RouterLink class="button" :to="{ name: 'admin-new' }">Novo post</RouterLink></div>
    <form class="admin-filters" @submit.prevent="filter">
      <div class="admin-field"><label for="post-search">Buscar posts</label><input id="post-search" v-model="search" type="search" maxlength="200"></div>
      <div class="admin-field"><label for="post-status">Status</label><select id="post-status" v-model="status"><option value="">Todos</option><option value="DRAFT">Rascunhos</option><option value="PUBLISHED">Publicados</option></select></div>
      <button type="submit">Filtrar</button>
    </form>
    <p v-if="feedback" class="admin-success" role="status">{{ feedback }}</p>
    <p v-if="error" class="admin-error" role="alert">{{ error }} <button v-if="!result" @click="reload++">Tentar novamente</button></p>
    <p v-if="loading" role="status">Carregando posts…</p>
    <template v-else-if="result">
      <p v-if="!result.items.length" class="state">Nenhum post encontrado.</p>
      <div v-else class="admin-posts">
        <article v-for="post in result.items" :key="post.id" class="admin-post-row">
          <div><StatusBadge :status="post.status" /><h2><RouterLink :to="{ name: 'admin-edit', params: { id: post.id } }">{{ post.title }}</RouterLink></h2><p class="admin-muted">{{ post.slug }}</p><p v-if="post.category" class="admin-muted">{{ post.category.name }}</p><div class="admin-dates"><span>Publicado: {{ formatDate(post.publishedAt) || '—' }}</span><span>Atualizado: {{ formatDate(post.updatedAt) }}</span></div></div>
          <div class="admin-actions"><RouterLink class="button" :to="{ name: 'admin-edit', params: { id: post.id } }">Editar</RouterLink><button :disabled="busy" @click="action(post)">{{ post.status === 'DRAFT' ? 'Publicar' : 'Despublicar' }}</button><button :disabled="busy" class="danger-button" @click="action(post, true)">Excluir</button></div>
        </article>
      </div>
      <nav v-if="result.totalPages > 1 || page > 1" class="pagination" aria-label="Paginação administrativa">
        <RouterLink v-if="page > 1" class="button" :to="{ query: pageQuery(page - 1) }">Anterior</RouterLink><button v-else disabled>Anterior</button>
        <span>Página {{ page }}</span>
        <RouterLink v-if="page < result.totalPages" class="button" :to="{ query: pageQuery(page + 1) }">Próxima</RouterLink><button v-else disabled>Próxima</button>
      </nav>
    </template>
  </section>
</template>
