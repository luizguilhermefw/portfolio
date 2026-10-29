import { createRouter, createWebHistory } from 'vue-router';
import BlogPage from './pages/BlogPage.vue';
import ArticlePage from './pages/ArticlePage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';
import { watch } from 'vue';
import { useAdminSession } from './composables/useAdminSession';
export const router = createRouter({
  history: createWebHistory('/blog'),
  routes: [
    {
      path: '/admin/login', name: 'admin-login',
      component: () => import('./pages/admin/LoginPage.vue'),
      meta: { adminPage: true, title: 'Login' },
    },
    {
      path: '/admin', component: () => import('./components/admin/AdminShell.vue'),
      meta: { adminPage: true, requiresAuth: true },
      children: [
        { path: '', name: 'admin', component: () => import('./pages/admin/DashboardPage.vue'), meta: { title: 'Administração' } },
        { path: 'posts', name: 'admin-posts', component: () => import('./pages/admin/PostsPage.vue'), meta: { title: 'Posts' } },
        { path: 'posts/novo', name: 'admin-new', component: () => import('./pages/admin/PostEditorPage.vue'), meta: { title: 'Novo post' } },
        { path: 'posts/:id/editar', name: 'admin-edit', component: () => import('./pages/admin/PostEditorPage.vue'), meta: { title: 'Editar post' } },
      ],
    },
    { path: '/', name: 'blog', component: BlogPage },
    { path: '/artigo/:slug', name: 'article', component: ArticlePage },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
  ],
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
});

const session = useAdminSession();
let checkingSession = false;
router.beforeEach(async (to) => {
  if (!to.meta.adminPage) return true;
  // Keep a failed logout visible even if its server-side cookie remains valid.
  if (to.name === 'admin-login' && to.query.logout === 'incomplete') return true;
  const hadSession = session.authenticated.value;
  checkingSession = true;
  try {
    const admin = await session.loadSession();
    if (to.meta.requiresAuth && !admin) {
      return { name: 'admin-login', query: hadSession ? { reason: 'expired' } : {} };
    }
    if (to.name === 'admin-login' && admin) return { name: 'admin' };
  } catch {
    if (to.name !== 'admin-login' || to.query.reason !== 'unavailable') {
      return { name: 'admin-login', query: { reason: 'unavailable' } };
    }
  } finally { checkingSession = false; }
  return true;
});

// An API action can expire a session while already inside a protected page.
watch(session.authenticated, (authenticated) => {
  if (!authenticated && !checkingSession && !session.loading.value && router.currentRoute.value.meta.requiresAuth) {
    void router.replace({ name: 'admin-login', query: { reason: 'expired' } });
  }
}, { flush: 'sync' });

router.afterEach((to, _from, failure) => {
  if (failure) return;
  let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"][data-blog-admin]');
  if (to.meta.adminPage) {
    document.title = String(to.meta.title) + ' | Blog Admin | LFWeb Studio';
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      robots.dataset.blogAdmin = '';
      document.head.append(robots);
    }
    robots.content = 'noindex, nofollow';
  } else { robots?.remove(); }
});
