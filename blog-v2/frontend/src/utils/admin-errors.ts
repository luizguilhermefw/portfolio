export class AdminApiError extends Error {
  constructor(public readonly status: number) { super('Falha na solicitação administrativa.'); }
}
export function adminErrorMessage(error: unknown, login = false): string {
  if (error instanceof AdminApiError) {
    if (error.status === 401) return login ? 'Usuário ou senha inválidos.' : 'Sua sessão expirou. Entre novamente.';
    if (error.status === 404) return 'Post não encontrado';
    if (error.status === 409) return 'Já existe um post com este slug.';
    if (error.status === 400) return 'Confira os campos e tente novamente.';
  }
  return 'Não foi possível concluir a solicitação agora. Tente novamente.';
}
