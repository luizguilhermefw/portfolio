<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ApiError, getPostBySlug, type PostDetail } from '../api/blog';
import { formatDate } from '../utils/date';
import { setSeo } from '../utils/seo';
const route = useRoute();
const post = ref<PostDetail | null>(null), loading = ref(true), missing = ref(false), error = ref(false), coverFailed = ref(false), retry = ref(0);
watch([() => route.params.slug, retry], async ([slug], _old, onCleanup) => {
  const controller = new AbortController(); onCleanup(() => controller.abort());
  loading.value = true; missing.value = false; error.value = false; post.value = null; coverFailed.value = false; setSeo('Artigo');
  try { const result = await getPostBySlug(String(slug), controller.signal); if (!controller.signal.aborted) { post.value = result; setSeo(result.title, result.metaDescription || result.excerpt || undefined); } }
  catch (e) { if (!controller.signal.aborted) { missing.value = e instanceof ApiError && e.status === 404; error.value = !missing.value; setSeo(missing.value ? 'Artigo não encontrado' : 'Artigo'); } }
  finally { if (!controller.signal.aborted) loading.value = false; }
}, { immediate: true });
</script>
<template>
  <div class="article-page">
<RouterLink class="back-link" :to="{ name: 'blog' }">← Voltar para o blog</RouterLink>
  <p v-if="loading" class="state" role="status">Carregando artigo…</p>
  <div v-else-if="missing" class="state">
<h1>Artigo não encontrado.</h1>
<p>Explore outros conteúdos no blog.</p>
</div>
  <div v-else-if="error" class="state" role="alert">
<h1>Não foi possível carregar o artigo agora.</h1>
<button @click="retry++">Tentar novamente</button>
</div>
  <article v-else-if="post">
<header class="article-header">
<p class="eyebrow">LFWEB STUDIO / ARTIGO</p>
<div class="metadata article-metadata">
<span v-if="post.category">{{ post.category.name }}</span>
<span v-if="post.category && formatDate(post.publishedAt)" class="metadata-separator" aria-hidden="true">/</span>
<time v-if="formatDate(post.publishedAt)" :datetime="post.publishedAt ?? undefined">{{ formatDate(post.publishedAt) }}</time>
</div>
<h1>{{ post.title }}</h1>
<p v-if="post.excerpt" class="article-lead">{{ post.excerpt }}</p>
</header>
<img v-if="post.imageUrl && !coverFailed" class="article-cover" :src="post.imageUrl" :alt="'Capa do artigo: ' + post.title" @error="coverFailed = true">
<div v-else class="article-cover article-cover--fallback image-fallback" aria-hidden="true">
  <span>LF / JOURNAL</span>
  <span class="fallback-orbit"></span>
</div>
  <!-- SECURITY TODO: contentHtml deverá estar sanitizado no backend antes de produção pública. -->
  <div class="prose" v-html="post.contentHtml">
</div>
<section class="article-ending" aria-labelledby="continue-title">
  <h2 id="continue-title">Continue explorando</h2>
  <nav aria-label="Continue explorando">
    <RouterLink :to="{ name: 'blog' }">Voltar para o blog <span aria-hidden="true">↗</span></RouterLink>
    <a href="/">Conhecer o portfólio <span aria-hidden="true">↗</span></a>
  </nav>
</section>
</article>
</div>
</template>
