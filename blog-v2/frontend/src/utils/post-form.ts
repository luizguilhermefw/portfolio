export interface PostFormFields {
  title: string; slug: string; excerpt: string; contentHtml: string;
  imageUrl: string; metaDescription: string; categoryId: string;
}
export function postPayload(form: PostFormFields) {
  const optional = (value: string) => value.trim() || null;
  return {
    title: form.title.trim(), slug: form.slug.trim(), contentHtml: form.contentHtml,
    excerpt: optional(form.excerpt), imageUrl: optional(form.imageUrl),
    metaDescription: optional(form.metaDescription), categoryId: optional(form.categoryId),
  };
}
