<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { AdminPostDetail, CreatePostPayload } from '../../api/admin';
import { slugify } from '../../utils/slugify';
import { postPayload, type PostFormFields } from '../../utils/post-form';
const props = defineProps<{ initial?: AdminPostDetail | null; busy: boolean }>();
const emit = defineEmits<{ save: [payload: CreatePostPayload]; dirty: [value: boolean] }>();
const form = reactive<PostFormFields>({ title: '', slug: '', excerpt: '', contentHtml: '', imageUrl: '', metaDescription: '', categoryId: '' });
const manualSlug = ref(false);
watch(() => props.initial, (post) => {
  for (const key of Object.keys(form) as (keyof PostFormFields)[]) form[key] = post?.[key] ?? '';
  manualSlug.value = !!post;
  emit('dirty', false);
}, { immediate: true });
function change() { emit('dirty', true); }
function suggestSlug() {
  if (!form.slug && !manualSlug.value) form.slug = slugify(form.title);
}
function save() { if (!props.busy) { suggestSlug(); emit('save', postPayload(form)); } }
</script>
<template>
  <form class="admin-form" @submit.prevent="save" @input="change">
    <fieldset :disabled="busy">
      <div class="admin-form-grid">
        <div class="admin-field"><label for="post-title">Título</label><input id="post-title" v-model="form.title" required maxlength="200" @blur="suggestSlug"></div>
        <div class="admin-field"><label for="post-slug">Slug</label><input id="post-slug" v-model="form.slug" required maxlength="200" pattern="[a-z0-9]+(-[a-z0-9]+)*" aria-describedby="slug-help" @input="manualSlug = true"><small id="slug-help">Minúsculas, números e hífens. Sugerido ao sair do título se estiver vazio.</small></div>
      </div>
      <div class="admin-field"><label for="post-excerpt">Resumo</label><textarea id="post-excerpt" v-model="form.excerpt" rows="3" maxlength="1000"></textarea></div>
      <div class="admin-field"><label for="post-content">Conteúdo HTML</label><textarea id="post-content" v-model="form.contentHtml" class="html-editor" rows="16" required maxlength="200000" spellcheck="false" aria-describedby="html-notice"></textarea><small id="html-notice">Conteúdo HTML será sanitizado no backend antes da produção pública.</small></div>
      <div class="admin-form-grid">
        <div class="admin-field"><label for="post-image">URL da capa (opcional)</label><input id="post-image" v-model="form.imageUrl" type="url" maxlength="2048" placeholder="https://"></div>
        <div class="admin-field"><label for="post-category">Categoria — UUID (opcional)</label><input id="post-category" v-model="form.categoryId" pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}" placeholder="ID de uma categoria existente"></div>
      </div>
      <div class="admin-field"><label for="post-meta">Descrição para mecanismos de busca (opcional)</label><textarea id="post-meta" v-model="form.metaDescription" rows="3" maxlength="320"></textarea></div>
      <button type="submit">{{ busy ? 'Salvando…' : 'Salvar' }}</button>
    </fieldset>
  </form>
</template>
