<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createPost, deletePost, getAdminPost, publishPost, unpublishPost, updatePost, type AdminPostDetail, type CreatePostPayload } from '../../api/admin';
import { adminErrorMessage } from '../../utils/admin-errors';
import { formatDate } from '../../utils/date';
import AdminPostForm from '../../components/admin/AdminPostForm.vue';
import StatusBadge from '../../components/admin/StatusBadge.vue';
const route = useRoute(), router = useRouter();
const id = computed(() => typeof route.params.id === 'string' ? route.params.id : '');
const post = ref<AdminPostDetail | null>(null), loading = ref(false), busy = ref(false), error = ref(''), feedback = ref(''), dirty = ref(false);
watch(id, async (value, _old, onCleanup) => {
  const controller = new AbortController(); onCleanup(() => controller.abort());
  post.value = null; dirty.value = false; error.value = ''; feedback.value = ''; loading.value = !!value;
  if (!value) return;
  try { const data = await getAdminPost(value, controller.signal); if (!controller.signal.aborted) post.value = data; }
  catch (e) { if (!controller.signal.aborted) error.value = adminErrorMessage(e); }
  finally { if (!controller.signal.aborted) loading.value = false; }
}, { immediate: true });
async function save(payload: CreatePostPayload) {
  if (busy.value) return;
  busy.value = true; error.value = ''; feedback.value = '';
  try {
    if (id.value) { post.value = await updatePost(id.value, payload); dirty.value = false; feedback.value = 'Post salvo.'; }
    else { const created = await createPost(payload); await router.replace({ name: 'admin-edit', params: { id: created.id } }); feedback.value = 'Rascunho criado.'; }
  } catch (e) { error.value = adminErrorMessage(e); }
  finally { busy.value = false; }
}
async function publish() {
  if (!post.value || busy.value || dirty.value) return;
  busy.value = true; error.value = ''; feedback.value = '';
  try { post.value = await (post.value.status === 'DRAFT' ? publishPost(post.value.id) : unpublishPost(post.value.id)); feedback.value = post.value.status === 'PUBLISHED' ? 'Post publicado.' : 'Post despublicado.'; }
  catch (e) { error.value = adminErrorMessage(e); }
  finally { busy.value = false; }
}
async function remove() {
  if (!post.value || busy.value || !window.confirm('Excluir o post “' + post.value.title + '”? Esta ação não pode ser desfeita.')) return;
  busy.value = true; error.value = '';
  try { await deletePost(post.value.id); await router.replace({ name: 'admin-posts' }); }
  catch (e) { error.value = adminErrorMessage(e); }
  finally { busy.value = false; }
}
</script>
<template>
  <section>
    <RouterLink class="back-link" :to="{ name: 'admin-posts' }">← Voltar para posts</RouterLink>
    <h1>{{ id ? 'Editar post' : 'Novo post' }}</h1>
    <p v-if="loading" class="state" role="status">Carregando post…</p>
    <p v-if="error" class="admin-error" role="alert">{{ error }}</p>
    <p v-if="feedback" class="admin-success" role="status">{{ feedback }}</p>
    <template v-if="!loading && (!id || post)">
      <div v-if="post" class="admin-post-meta"><StatusBadge :status="post.status" /><div class="admin-dates"><span>Criado: {{ formatDate(post.createdAt) }}</span><span>Atualizado: {{ formatDate(post.updatedAt) }}</span><span v-if="post.publishedAt">Publicado: {{ formatDate(post.publishedAt) }}</span></div></div>
      <p v-else class="admin-muted">O post será criado como rascunho.</p>
      <AdminPostForm :key="id || 'new'" :initial="post" :busy="busy" @save="save" @dirty="dirty = $event" />
      <div v-if="post" class="admin-editor-actions"><p v-if="dirty" class="admin-muted">Salve as alterações antes de mudar a publicação.</p><div class="admin-actions"><button :disabled="busy || dirty" @click="publish">{{ post.status === 'DRAFT' ? 'Publicar' : 'Despublicar' }}</button><button :disabled="busy" class="danger-button" @click="remove">Excluir</button></div></div>
    </template>
  </section>
</template>
