<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminSession } from '../../composables/useAdminSession';
const router = useRouter();
const session = useAdminSession();
const leaving = ref(false);
async function signOut() {
  leaving.value = true;
  let failed = false;
  try { await session.logout(); } catch { failed = true; }
  finally { leaving.value = false; await router.replace({ name: 'admin-login', query: failed ? { logout: 'incomplete' } : {} }); }
}
</script>
<template>
  <div class="admin-area">
    <header class="admin-bar">
      <div><p class="eyebrow">BLOG V2 / ADMINISTRAÇÃO</p><p v-if="session.admin.value" class="admin-identity">{{ session.admin.value.username }}</p></div>
      <nav aria-label="Administração">
        <RouterLink :to="{ name: 'admin' }">Início</RouterLink>
        <RouterLink :to="{ name: 'admin-posts' }">Posts</RouterLink>
        <RouterLink :to="{ name: 'admin-new' }">Novo post</RouterLink>
        <RouterLink :to="{ name: 'blog' }">Ver blog público</RouterLink>
        <button type="button" :disabled="leaving" @click="signOut">{{ leaving ? 'Saindo…' : 'Logout' }}</button>
      </nav>
    </header>
    <RouterView />
  </div>
</template>
