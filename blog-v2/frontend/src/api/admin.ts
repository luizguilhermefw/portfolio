import type { PostSummary } from './blog';
import { AdminApiError } from '../utils/admin-errors';

export interface AdminIdentity { id: string; username: string }
export type PostStatus = 'DRAFT' | 'PUBLISHED';
export interface AdminPostSummary extends PostSummary {
  status: PostStatus; createdAt: string; updatedAt: string;
}
export interface AdminPostDetail extends Omit<AdminPostSummary, 'category'> {
  contentHtml: string; categoryId: string | null; legacyId: number | null;
  legacyCategory: string | null;
}
export interface LoginPayload { username: string; password: string }
export interface CreatePostPayload {
  title: string; slug: string; contentHtml: string;
  excerpt: string | null; imageUrl: string | null;
  metaDescription: string | null; categoryId: string | null;
}
export type UpdatePostPayload = Partial<CreatePostPayload>;
export interface PaginatedAdminPosts {
  items: AdminPostSummary[]; page: number; limit: number; total: number; totalPages: number;
}
export interface AdminPostQuery { page: number; search?: string; status?: PostStatus }
let unauthorizedHandler: () => void = () => {};
export function onUnauthorized(handler: () => void): void { unauthorizedHandler = handler; }

async function request<T>(path: string, method = 'GET', body?: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch('/api/blog/v1' + path, {
    method, credentials: 'include', signal,
    headers: { Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (response.status === 401) unauthorizedHandler();
  if (!response.ok) throw new AdminApiError(response.status);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
export const loginAdmin = (payload: LoginPayload) => request<AdminIdentity>('/auth/login', 'POST', payload);
export const getAdminIdentity = () => request<AdminIdentity>('/auth/me');
export const logoutAdmin = () => request<{ status: string }>('/auth/logout', 'POST');
export function getAdminPosts(query: AdminPostQuery, signal?: AbortSignal): Promise<PaginatedAdminPosts> {
  const params = new URLSearchParams({ page: String(query.page), limit: '10' });
  if (query.search) params.set('search', query.search);
  if (query.status) params.set('status', query.status);
  return request('/admin/posts?' + params, 'GET', undefined, signal);
}
export const getAdminPost = (id: string, signal?: AbortSignal) => request<AdminPostDetail>('/admin/posts/' + encodeURIComponent(id), 'GET', undefined, signal);
export const createPost = (payload: CreatePostPayload) => request<AdminPostDetail>('/admin/posts', 'POST', payload);
export const updatePost = (id: string, payload: UpdatePostPayload) => request<AdminPostDetail>('/admin/posts/' + encodeURIComponent(id), 'PATCH', payload);
export const publishPost = (id: string) => request<AdminPostDetail>('/admin/posts/' + encodeURIComponent(id) + '/publish', 'POST');
export const unpublishPost = (id: string) => request<AdminPostDetail>('/admin/posts/' + encodeURIComponent(id) + '/unpublish', 'POST');
export const deletePost = (id: string) => request<void>('/admin/posts/' + encodeURIComponent(id), 'DELETE');
