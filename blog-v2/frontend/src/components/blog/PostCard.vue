<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PostSummary } from '../../api/blog';
import { formatDate } from '../../utils/date';
const props = defineProps<{ post: PostSummary }>();
const failed = ref(false);
watch(() => props.post.imageUrl, () => { failed.value = false; });
</script>
<template>
  <article class="post-card">
    <div class="post-card__visual">
<img v-if="post.imageUrl && !failed" :src="post.imageUrl" :alt="'Capa do artigo: ' + post.title" loading="lazy" @error="failed = true">
<div v-else class="image-fallback" aria-hidden="true">
<span>LF / JOURNAL</span>
<span class="fallback-orbit">
</span>
</div>
</div>
    <div class="post-card__body">
<div class="metadata">
<span v-if="post.category">{{ post.category.name }}</span>
<time v-if="formatDate(post.publishedAt)" :datetime="post.publishedAt ?? undefined">{{ formatDate(post.publishedAt) }}</time>
</div>
<h3>
<RouterLink :to="{ name: 'article', params: { slug: post.slug } }">{{ post.title }}</RouterLink>
</h3>
<p v-if="post.excerpt">{{ post.excerpt }}</p>
<RouterLink class="read-link" :to="{ name: 'article', params: { slug: post.slug } }" :aria-label="'Ler artigo: ' + post.title">Ler artigo <span aria-hidden="true">↗</span>
</RouterLink>
</div>
  </article>
</template>
