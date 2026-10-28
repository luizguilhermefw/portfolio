import { createRouter, createWebHistory } from 'vue-router';
import BlogPage from './pages/BlogPage.vue';
import ArticlePage from './pages/ArticlePage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';
export const router = createRouter({
  history: createWebHistory('/blog'),
  routes: [
    { path: '/', name: 'blog', component: BlogPage },
    { path: '/artigo/:slug', name: 'article', component: ArticlePage },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
  ],
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
});
