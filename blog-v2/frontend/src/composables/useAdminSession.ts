import { computed, readonly, ref } from 'vue';
import { getAdminIdentity, loginAdmin, logoutAdmin, onUnauthorized, type AdminIdentity, type LoginPayload } from '../api/admin';
import { AdminApiError } from '../utils/admin-errors';

const admin = ref<AdminIdentity | null>(null);
const loading = ref(false);
let pending: Promise<AdminIdentity | null> | null = null;
function clear(): void { admin.value = null; }
onUnauthorized(clear);

async function loadSession(): Promise<AdminIdentity | null> {
  if (pending) return pending;
  loading.value = true;
  pending = (async () => {
    try { admin.value = await getAdminIdentity(); return admin.value; }
    catch (error) { clear(); if (error instanceof AdminApiError && error.status === 401) return null; throw error; }
    finally { loading.value = false; pending = null; }
  })();
  return pending;
}
async function login(payload: LoginPayload): Promise<void> {
  loading.value = true;
  try { admin.value = await loginAdmin(payload); }
  finally { loading.value = false; }
}
async function logout(): Promise<void> {
  loading.value = true;
  try { await logoutAdmin(); }
  catch (error) { if (!(error instanceof AdminApiError && error.status === 401)) throw error; }
  finally { clear(); loading.value = false; }
}
export function useAdminSession() {
  return { admin: readonly(admin), loading: readonly(loading), authenticated: computed(() => admin.value !== null), loadSession, login, logout, clear };
}
