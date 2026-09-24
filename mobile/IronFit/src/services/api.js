// Cliente de API para comunicação com o Backend do IronFit
import { API_BASE_URL } from '../config/apiConfig';

let currentAuthToken = null;

export function setAuthToken(token) {
  currentAuthToken = token;
}

export function getAuthToken() {
  return currentAuthToken;
}

// Utilitário para conversão de data (DD/MM/AAAA para YYYY-MM-DD aceito pelo backend)
export function formatarDataParaISO(dataStr) {
  if (!dataStr) return null;
  const str = String(dataStr).trim();

  // Já está no formato YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Se estiver no formato DD/MM/AAAA ou DD-MM-AAAA
  const partes = str.split(/[/.-]/);
  if (partes.length === 3) {
    if (partes[0].length === 2 && partes[2].length === 4) {
      // DD/MM/AAAA -> YYYY-MM-DD
      return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    }
  }

  // Fallback: tentar Date
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }

  return str;
}

// Normalizador de enums compatíveis com o backend Prisma
export function normalizarGeneroParaBackend(genero) {
  const g = String(genero || '').trim().toLowerCase();
  if (g.startsWith('fem')) return 'feminino';
  return 'masculino';
}

export function normalizarNivelAtividadeParaBackend(nivel) {
  const mapa = {
    sedentario: 'sedentario',
    leve: 'leve',
    moderado: 'moderado',
    intenso: 'intenso',
    muito_intenso: 'muitointenso',
    muitointenso: 'muitointenso',
  };
  const limpo = String(nivel || '').replace(/[\s_]/g, '').toLowerCase();
  return mapa[limpo] || 'moderado';
}

// Requisição HTTP centralizada com Bearer Token e timeout de 10s
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (currentAuthToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${currentAuthToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    let data = null;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      const mensagem =
        data?.erro ||
        data?.error ||
        data?.message ||
        `Erro na requisição (${response.status})`;

      const error = new Error(mensagem);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutError = new Error('Tempo limite de conexão esgotado. Verifique sua rede e o backend.');
      timeoutError.status = 408;
      throw timeoutError;
    }
    throw error;
  }
}

// Utilitário de cálculo local (Harris-Benedict e IMC) para pré-visualização instantânea na tela
export function calcularMetabolismo({ peso, altura, idade, genero, nivelAtividade }) {
  const p = parseFloat(peso);
  const a = parseFloat(altura); // em cm
  const i = parseInt(idade, 10);

  if (!p || !a || !i) return null;

  // IMC = peso / (altura_m)^2
  const alturaM = a / 100;
  const imc = parseFloat((p / (alturaM * alturaM)).toFixed(2));

  let classificacaoImc = '';
  if (imc < 18.5) classificacaoImc = 'Abaixo do peso';
  else if (imc < 24.9) classificacaoImc = 'Peso normal';
  else if (imc < 29.9) classificacaoImc = 'Sobrepeso';
  else if (imc < 34.9) classificacaoImc = 'Obesidade Grau I';
  else if (imc < 39.9) classificacaoImc = 'Obesidade Grau II';
  else classificacaoImc = 'Obesidade Grau III';

  // TMB - Equação de Harris-Benedict
  let tmb = 0;
  const isMasc = String(genero || '').toLowerCase().startsWith('masc');
  if (isMasc) {
    tmb = 88.36 + (13.4 * p) + (4.8 * a) - (5.7 * i);
  } else {
    tmb = 447.59 + (9.24 * p) + (3.1 * a) - (4.33 * i);
  }
  tmb = Math.round(tmb);

  // Fatores de Atividade para NDC
  const fatoresAtividade = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    intenso: 1.725,
    muito_intenso: 1.9,
    muitointenso: 1.9,
  };

  const chaveNivel = String(nivelAtividade || '').toLowerCase().replace(/[\s-]/g, '_');
  const fator = fatoresAtividade[chaveNivel] || 1.55;
  const ndc = Math.round(tmb * fator);

  return { imc, classificacaoImc, tmb, ndc };
}

// Fallbacks de demonstração para quando o backend estiver inacessível
const mockUser = {
  id: 'mock-user-1',
  nome: 'Usuário IronFit',
  email: 'usuario@ironfit.com',
  data_nascimento: '1995-05-15',
  genero: 'masculino',
};

const mockTreinos = [
  {
    idTreino: 1,
    nome: 'Treino A - Peito e Tríceps',
    foco: 'Hipertrofia',
    nivel: 'Intermediário',
    exercicios: [
      { idExercicio: 1, nome: 'Supino Reto com Barra', series: 4, repeticoes: '10-12', descanso: '60s', grupo: 'Peito' },
      { idExercicio: 2, nome: 'Supino Inclinado com Halteres', series: 3, repeticoes: '12', descanso: '60s', grupo: 'Peito' },
      { idExercicio: 3, nome: 'Crossover na Polia', series: 3, repeticoes: '15', descanso: '45s', grupo: 'Peito' },
      { idExercicio: 4, nome: 'Tríceps Testa com Barra W', series: 4, repeticoes: '10', descanso: '60s', grupo: 'Tríceps' },
      { idExercicio: 5, nome: 'Tríceps Pulley na Corda', series: 3, repeticoes: '12-15', descanso: '45s', grupo: 'Tríceps' },
    ],
  },
  {
    idTreino: 2,
    nome: 'Treino B - Costas e Bíceps',
    foco: 'Hipertrofia',
    nivel: 'Intermediário',
    exercicios: [
      { idExercicio: 6, nome: 'Puxada Frontal no Pulley', series: 4, repeticoes: '10-12', descanso: '60s', grupo: 'Costas' },
      { idExercicio: 7, nome: 'Remada Curvada com Barra', series: 4, repeticoes: '10', descanso: '60s', grupo: 'Costas' },
      { idExercicio: 8, nome: 'Remada Unilateral (Serrote)', series: 3, repeticoes: '12', descanso: '45s', grupo: 'Costas' },
      { idExercicio: 9, nome: 'Rosca Direta com Barra W', series: 4, repeticoes: '10', descanso: '60s', grupo: 'Bíceps' },
      { idExercicio: 10, nome: 'Rosca Martelo com Halteres', series: 3, repeticoes: '12', descanso: '45s', grupo: 'Bíceps' },
    ],
  },
  {
    idTreino: 3,
    nome: 'Treino C - Pernas e Ombros',
    foco: 'Hipertrofia',
    nivel: 'Intermediário',
    exercicios: [
      { idExercicio: 11, nome: 'Agachamento Livre com Barra', series: 4, repeticoes: '8-10', descanso: '90s', grupo: 'Pernas' },
      { idExercicio: 12, nome: 'Leg Press 45°', series: 4, repeticoes: '12', descanso: '60s', grupo: 'Pernas' },
      { idExercicio: 13, nome: 'Cadeira Extensora', series: 3, repeticoes: '15', descanso: '45s', grupo: 'Pernas' },
      { idExercicio: 14, nome: 'Desenvolvimento com Halteres', series: 4, repeticoes: '10', descanso: '60s', grupo: 'Ombros' },
      { idExercicio: 15, nome: 'Elevação Lateral', series: 4, repeticoes: '12-15', descanso: '45s', grupo: 'Ombros' },
    ],
  },
];

export const api = {
  // 1. Autenticação
  async login(email, senha) {
    try {
      const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), senha }),
      });

      if (response?.token) {
        setAuthToken(response.token);
      }

      return response;
    } catch (error) {
      console.warn('Falha no login com a API:', error.message);
      // Se for erro de status (ex: 401, 403, 429), propaga para o formulário
      if (error.status) {
        throw error;
      }
      // Se for erro de rede offline e senha demo
      if (email && senha && senha === '123456') {
        const mockResp = {
          token: 'mock-jwt-token-ironfit',
          usuario: { ...mockUser, email },
        };
        setAuthToken(mockResp.token);
        return mockResp;
      }
      throw error;
    }
  },

  async register(dados) {
    const dataNascimentoISO = formatarDataParaISO(dados.dataNascimento || dados.data_nascimento);

    const payload = {
      nome: dados.nome.trim(),
      email: dados.email.trim().toLowerCase(),
      senha: dados.senha,
      data_nascimento: dataNascimentoISO,
    };

    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async solicitarRecuperacaoSenha(email) {
    return await request('/auth/solicitar-recuperacao', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
  },

  async reenviarEmailVerificacao(email) {
    return await request('/auth/reenviar-email', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
  },

  async getMe() {
    return await request('/auth/me');
  },

  async alterarSenha(senhaAtual, novaSenha) {
    return await request('/auth/alterar-senha', {
      method: 'POST',
      body: JSON.stringify({ senhaAtual, novaSenha }),
    });
  },

  // 2. Dados Corporais
  async getDadosCorporais(usuarioId) {
    try {
      const response = await request(`/dadosCorporais/usuario/${usuarioId}`);
      return response;
    } catch (error) {
      console.warn('Não foi possível carregar dados corporais da API:', error.message);
      return null;
    }
  },

  async salvarDadosCorporais(dados, usuarioId) {
    const payload = {
      idUsuario: usuarioId ? String(usuarioId) : undefined,
      peso_kg: parseFloat(dados.peso_kg || dados.peso),
      altura_cm: parseFloat(dados.altura_cm || dados.altura),
      idade: parseInt(dados.idade, 10),
      genero: normalizarGeneroParaBackend(dados.genero),
      nivel_atividade: normalizarNivelAtividadeParaBackend(dados.nivel_atividade || dados.nivelAtividade),
    };

    try {
      // 1. Tenta POST (primeiro cadastro)
      return await request('/dadosCorporais', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (postError) {
      // 2. Se já existir registro, atualiza via PUT (mesma lógica do front Dashboard.jsx)
      const msgErro = postError.data?.erro || postError.message || '';
      if (
        postError.status === 400 &&
        (msgErro.includes('já possui dados') || msgErro.includes('existente') || usuarioId)
      ) {
        return await request(`/dadosCorporais/${usuarioId || ''}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      throw postError;
    }
  },

  // 3. Treinos
  async getTreinos() {
    try {
      const response = await request('/treinos');
      const lista = response?.data || response || [];
      if (Array.isArray(lista) && lista.length > 0) {
        return lista;
      }
      return mockTreinos;
    } catch (error) {
      console.warn('Utilizando treinos do modo offline/mock:', error.message);
      return mockTreinos;
    }
  },

  // 4. Evolução e Histórico
  async getHistorico(usuarioId) {
    try {
      return await request(`/historico/usuario/${usuarioId}`);
    } catch (error) {
      console.warn('Erro ao carregar histórico:', error.message);
      return null;
    }
  },

  async getEstatisticas(usuarioId) {
    try {
      return await request(`/evolucao/estatisticas/${usuarioId}`);
    } catch (error) {
      console.warn('Erro ao carregar estatísticas:', error.message);
      return null;
    }
  },
};
