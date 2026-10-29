export interface Category { id: string; name: string; slug: string }
export interface PostSummary {
  id: string; title: string; slug: string; excerpt: string | null;
  imageUrl: string | null; publishedAt: string | null;
  metaDescription: string | null; category: Category | null;
}
export interface PostDetail extends PostSummary { contentHtml: string }
export interface PaginatedPosts { items: PostSummary[]; page: number; limit: number; total: number; totalPages: number }
export class ApiError extends Error {
  constructor(public readonly status: number) { super('Não foi possível carregar o conteúdo.'); }
}
const base = (import.meta.env.VITE_BLOG_API_BASE_URL || '/api/blog/v1').replace(/\/$/, '');
async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(base + path, { signal, credentials: 'omit', headers: { Accept: 'application/json' } });
  if (!response.ok) throw new ApiError(response.status);
  return response.json() as Promise<T>;
}
export function getPosts(page = 1, limit = 9, signal?: AbortSignal): Promise<PaginatedPosts> {
  return request('/posts?' + new URLSearchParams({ page: String(page), limit: String(limit) }), signal);
}
export function getPostBySlug(slug: string, signal?: AbortSignal): Promise<PostDetail> {
  return request('/posts/' + encodeURIComponent(slug), signal);
}
