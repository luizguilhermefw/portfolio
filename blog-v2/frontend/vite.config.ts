import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  base: '/blog/',
  plugins: [vue()],
  server: { proxy: { '/api/blog/v1': { target: 'http://localhost:3001', changeOrigin: true } } },
});
