<script setup lang="ts">
import { nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
watch(() => route.fullPath, async () => { await nextTick(); document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true }); });
</script>
<template>
  <a class="skip-link" href="#main-content">Pular para o conteúdo</a>
  <header class="site-header container">
<a class="brand" href="/">LFWeb<span> Studio</span>
</a>
<nav aria-label="Navegação principal">
<a href="/">Portfólio</a>
<RouterLink :to="{ name: 'blog' }">Blog</RouterLink>
</nav>
</header>
  <main id="main-content" class="container main" tabindex="-1">
<RouterView />
</main>
  <footer class="site-footer container">
<span>LFWeb Studio</span>
<p>Desenvolvimento, integrações e produtos digitais.</p>
<a href="/">Voltar ao portfólio ↗</a>
</footer>
</template>
