<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminSession } from '../../composables/useAdminSession';
import { adminErrorMessage } from '../../utils/admin-errors';
const route = useRoute(), router = useRouter(), session = useAdminSession();
const username = ref(''), password = ref(''), error = ref(''), busy = ref(false);
async function submit() {
  if (busy.value) return;
  busy.value = true; error.value = '';
  try { await session.login({ username: username.value.trim(), password: password.value }); await router.replace({ name: 'admin' }); }
  catch (e) { error.value = adminErrorMessage(e, true); }
  finally { password.value = ''; busy.value = false; }
}
</script>
<template>
  <section class="admin-login admin-area" aria-labelledby="login-title">
    <p class="eyebrow">BLOG V2 / ADMINISTRAÇÃO</p>
    <h1 id="login-title">Entrar no blog</h1>
    <p class="admin-muted">Acesso restrito à administração.</p>
    <p v-if="route.query.logout === 'incomplete'" role="alert">Não foi possível confirmar o encerramento no servidor. Tente novamente quando a conexão estiver disponível.</p>
    <p v-if="route.query.reason === 'unavailable'" role="alert">Não foi possível verificar sua sessão. Tente novamente.</p>
    <p v-if="route.query.reason === 'expired'" role="status">Sua sessão expirou. Entre novamente.</p>
    <form class="admin-form" @submit.prevent="submit">
      <label for="username">Usuário</label>
      <input id="username" v-model="username" name="username" autocomplete="username" required maxlength="100" pattern="[a-zA-Z0-9._\-]+" :disabled="busy">
      <label for="password">Senha</label>
      <input id="password" v-model="password" name="password" type="password" autocomplete="current-password" required :disabled="busy">
      <p v-if="error" class="admin-error" role="alert">{{ error }}</p>
      <button type="submit" :disabled="busy">{{ busy ? 'Entrando…' : 'Entrar' }}</button>
    </form>
    <RouterLink class="back-link" :to="{ name: 'blog' }">← Voltar para o blog</RouterLink>
  </section>
</template>
