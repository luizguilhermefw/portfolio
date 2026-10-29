export function setSeo(title: string, description = 'Artigos sobre desenvolvimento, integrações e produtos digitais.'): void {
  document.title = title + ' | LFWeb Studio';
  let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.append(meta); }
  meta.content = description;
}
