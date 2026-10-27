import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://sistemacomputacionaldeanalisecorporea.onrender.com',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Sessão expirada/inválida: limpa o token e devolve o utilizador ao login.
 * Ignora as rotas de autenticação, onde 401 significa "credenciais erradas"
 * e deve ser mostrado na própria página.
 */
const ROTAS_AUTH = ['/auth/login', '/auth/register'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';

    if (status === 401 && !ROTAS_AUTH.some((rota) => url.includes(rota))) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

/**
 * O backend responde com a coleção direto ou embrulhada em `{ data }`,
 * dependendo do controller. Normaliza os dois formatos.
 */
export function unwrap(response) {
  const body = response?.data;
  return body?.data ?? body ?? [];
}

/**
 * Os controllers usam `erro`, `error` e `message` de forma inconsistente.
 * Lê os três e cai no fallback informado.
 */
export function getApiError(error, fallback = 'Erro inesperado. Tente novamente.') {
  return error?.response?.data?.erro
    || error?.response?.data?.error
    || error?.response?.data?.message
    || error?.message
    || fallback;
}

export default api;
