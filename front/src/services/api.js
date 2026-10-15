import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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
