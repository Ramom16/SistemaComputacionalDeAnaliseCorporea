import { Platform } from 'react-native';

// CONFIGURAÇÃO DE REDE DA API IRONFIT
export const MANUAL_API_URL = ''; 

function getBaseUrl() {
  if (MANUAL_API_URL && MANUAL_API_URL.trim() !== '') {
    return MANUAL_API_URL.trim().replace(/\/+$/, '');
  }

  if (Platform.OS === 'android') {
    return 'http://localhost:3000';
  }

  return 'http://localhost:3000';
}

export const API_BASE_URL = getBaseUrl();

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || data.error || 'Erro na requisição');
    error.status = response.status;
    throw error;
  }
  return data;
}

export function calcularMetabolismo({ peso, altura, idade, genero, nivelAtividade }) {
  const p = parseFloat(peso) || 0;
  const a = parseFloat(altura) || 0;
  const i = parseInt(idade, 10) || 0;
  if (!p || !a || !i) return null;

  const imcVal = p / ((a / 100) * (a / 100));
  const imc = imcVal.toFixed(1);

  let classificacaoImc = '';
  if (imcVal < 18.5)
    classificacaoImc = 'Abaixo do Peso';
  else if (imcVal < 25)
    classificacaoImc = 'Peso Normal';
  else if (imcVal < 30)
    classificacaoImc = 'Sobrepeso';
  else
    classificacaoImc = 'Obesidade';

  let tmbVal = 10 * p + 6.25 * a - 5 * i;
  const genLower = String(genero || '').toLowerCase();
  tmbVal = genLower === 'feminino' ? tmbVal - 161 : tmbVal + 5;
  const tmb = Math.round(tmbVal);

  const fatores = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    intenso: 1.725,
    muitointenso: 1.9,
    muito_intenso: 1.9,
  };

  const nivKey = String(nivelAtividade || '').toLowerCase().replace('_', '');
  const fator = fatores[nivKey] || 1.2;
  const ndc = Math.round(tmbVal * fator);
  return { imc: parseFloat(imc), tmb, ndc, classificacaoImc };
}

export const api = {
  login: (email, senha) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) }),

  register: (dados) => request('/auth/register', { method: 'POST', body: JSON.stringify(dados) }),

  getMe: () => request('/auth/me'),

  alterarSenha: (senhaAtual, novaSenha) => request('/auth/alterar-senha', { method: 'POST', body: JSON.stringify({ senhaAtual, novaSenha }) }),

  solicitarRecuperacaoSenha: (email) => request('/auth/recuperar-senha', { method: 'POST', body: JSON.stringify({ email }) }),

  reenviarEmailVerificacao: (email) => request('/auth/reenviar-verificacao', { method: 'POST', body: JSON.stringify({ email }) }),

  getDadosCorporais: (idUsuario) => request(`/avaliacao/historico/${String(idUsuario)}`),

  salvarDadosCorporais: (dados) => request('/avaliacao', { method: 'POST', body: JSON.stringify(dados) }),

  getTreinos: () => request('/treinos'),

  getHistorico: (idUsuario) => request(`/avaliacao/historico/${String(idUsuario)}`),

  getEstatisticas: (idUsuario) => request(`/estatisticas/${String(idUsuario)}`),
};