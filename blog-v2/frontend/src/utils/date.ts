export function formatDate(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}
