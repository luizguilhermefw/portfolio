<script setup lang="ts">
import type { PostStatus } from '../../api/admin';
defineProps<{ status: PostStatus }>();
</script>
<template><span class="status-badge" :class="{ 'status-badge--published': status === 'PUBLISHED' }">{{ status === 'PUBLISHED' ? 'Publicado' : 'Rascunho' }}</span></template>
