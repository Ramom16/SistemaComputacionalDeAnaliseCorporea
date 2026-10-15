const CHAVE_TOKEN = 'token';
const CHAVE_USUARIO = 'usuario';

export function getToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIO)) || {};
  } catch {
    return {};
  }
}

export function isAdmin() {
  return getUsuario().role === 'ADMIN';
}

export function salvarSessao({ token, usuario }) {
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
}
