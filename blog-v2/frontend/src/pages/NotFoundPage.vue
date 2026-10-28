<script setup lang="ts">
import { setSeo } from '../utils/seo';
setSeo('Página não encontrada');
</script>
<template>
<section class="state">
<p class="eyebrow">404</p>
<h1>Página não encontrada.</h1>
<p>O conteúdo que você procura não está aqui.</p>
<RouterLink class="button" :to="{ name: 'blog' }">Explorar o blog</RouterLink>
</section>
</template>
