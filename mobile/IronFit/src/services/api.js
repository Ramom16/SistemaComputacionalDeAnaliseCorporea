// Cliente de API para comunicação com o Backend do IronFit

const API_BASE_URL = 'http://10.0.2.2:3000/api'; // IP padrão do emulador Android / localhost

// Estado local de simulação para fallback offline/desenvolvimento
const mockUser = {
  id: 1,
  nome: 'Usuário IronFit',
  email: 'usuario@ironfit.com',
  data_nascimento: '1995-05-15',
  genero: 'masculino',
};

const mockDadosCorporais = [
  {
    idDados: 1,
    peso_kg: 78.5,
    altura_cm: 175,
    genero: 'masculino',
    idade: 28,
    nivel_atividade: 'moderado',
    imc: 25.63,
    tmb: 1752,
    ndc: 2715,
    data_registro: new Date().toISOString(),
  },
];

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

// Utilitário de cálculo local para cálculos instantâneos
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
  if (genero === 'masculino') {
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
  };

  const fator = fatoresAtividade[nivelAtividade] || 1.55;
  const ndc = Math.round(tmb * fator);

  return { imc, classificacaoImc, tmb, ndc };
}

export const api = {
  // Login
  async login(email, senha) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      console.log('Backend offline, utilizando modo fallback local');
    }
    // Fallback Mock
    if (email && senha) {
      return {
        token: 'mock-jwt-token-ironfit',
        usuario: { ...mockUser, email },
      };
    }
    throw new Error('Credenciais inválidas');
  },

  // Cadastro
  async register(dados) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.log('Backend offline, registrando via fallback local');
    }
    return {
      success: true,
      mensagem: 'Cadastro realizado com sucesso!',
      usuario: { id: Date.now(), ...dados },
    };
  },

  // Obter Dados Corporais do Usuário
  async getDadosCorporais(usuarioId) {
    try {
      const response = await fetch(`${API_BASE_URL}/dadosCorporais/usuario/${usuarioId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Fallback
    }
    return mockDadosCorporais;
  },

  // Salvar Novo Dado Corporal
  async salvarDadosCorporais(dados) {
    const calculados = calcularMetabolismo({
      peso: dados.peso_kg,
      altura: dados.altura_cm,
      idade: dados.idade,
      genero: dados.genero,
      nivelAtividade: dados.nivel_atividade,
    });

    const novoRegistro = {
      idDados: Date.now(),
      ...dados,
      ...calculados,
      data_registro: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/dadosCorporais`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoRegistro),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Fallback
    }

    mockDadosCorporais.unshift(novoRegistro);
    return novoRegistro;
  },

  // Listar Treinos
  async getTreinos() {
    try {
      const response = await fetch(`${API_BASE_URL}/treinos`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      // Fallback
    }
    return mockTreinos;
  },
};
