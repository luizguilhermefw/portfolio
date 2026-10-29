<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getPosts, type PaginatedPosts } from '../api/blog';
import PostCard from '../components/blog/PostCard.vue';
import { setSeo } from '../utils/seo';
const route = useRoute();
const page = computed(() => { const raw = route.query.page; const n = typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : 1; return Number.isSafeInteger(n) && n >= 1 && n <= 100000 ? n : 1; });
const data = ref<PaginatedPosts | null>(null);
const loading = ref(true), error = ref(false), retry = ref(0);
watch([page, retry], async ([current], _old, onCleanup) => {
  const controller = new AbortController(); onCleanup(() => controller.abort());
  loading.value = true; error.value = false; data.value = null; setSeo('Blog');
  try { const result = await getPosts(current, 9, controller.signal); if (!controller.signal.aborted) data.value = result; }
  catch { if (!controller.signal.aborted) error.value = true; }
  finally { if (!controller.signal.aborted) loading.value = false; }
}, { immediate: true });
</script>
<template>
  <section aria-labelledby="blog-title">
<div class="page-intro">
<p class="eyebrow">LFWEB STUDIO / BLOG</p>
<h1 id="blog-title">Ideias que viram<br>
<span>conhecimento.</span>
</h1>
<p class="intro-text">Desenvolvimento, integrações e produtos digitais. Um espaço para compartilhar experiências, aprendizados e novas perspectivas.</p>
</div>
    <div class="section-label">
<h2>Últimos artigos</h2>
<span>Conhecimento em construção</span>
</div>
    <p v-if="loading" class="state" role="status">Carregando artigos…</p>
    <div v-else-if="error" class="state" role="alert">
<p>Não foi possível carregar os artigos agora.</p>
<button @click="retry++">Tentar novamente</button>
</div>
    <template v-else-if="data">
<div v-if="data.items.length" class="post-grid">
<PostCard v-for="post in data.items" :key="post.id" :post="post" />
</div>
<p v-else class="state">{{ page === 1 ? 'Nenhum artigo publicado ainda.' : 'Nenhum artigo nesta página.' }}</p>
    <nav v-if="data.totalPages > 1 || page > 1" class="pagination" aria-label="Paginação dos artigos">
<RouterLink v-if="page > 1" class="button" :to="{ name: 'blog', query: { page: page - 1 } }">Anterior</RouterLink>
<button v-else disabled>Anterior</button>
<span>Página {{ page }}<template v-if="data.totalPages && page <= data.totalPages"> de {{ data.totalPages }}</template>
</span>
<RouterLink v-if="page < data.totalPages" class="button" :to="{ name: 'blog', query: { page: page + 1 } }">Próxima</RouterLink>
<button v-else disabled>Próxima</button>
</nav>
</template>
  </section>
</template>
