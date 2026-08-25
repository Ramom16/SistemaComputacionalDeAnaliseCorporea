import React, { createContext, useState, useContext } from 'react';
import { api, calcularMetabolismo } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dadosCorporais, setDadosCorporais] = useState([
    {
      idDados: 1,
      peso_kg: 78.5,
      altura_cm: 175,
      genero: 'masculino',
      idade: 28,
      nivel_atividade: 'moderado',
      imc: 25.63,
      classificacaoImc: 'Sobrepeso',
      tmb: 1752,
      ndc: 2715,
      data_registro: new Date().toISOString(),
    },
  ]);

  async function login(email, senha) {
    setLoading(true);
    try {
      const response = await api.login(email, senha);
      if (response && response.usuario) {
        setUser(response.usuario);
        setToken(response.token || 'mock-jwt-token');
        return { success: true };
      }
      return { success: false, error: 'Credenciais inválidas' };
    } catch (error) {
      return { success: false, error: error.message || 'Erro ao realizar login' };
    } finally {
      setLoading(false);
    }
  }

  async function register(dados) {
    setLoading(true);
    try {
      const response = await api.register(dados);
      if (response) {
        // Auto-login ou login mock com os dados fornecidos
        const newUser = {
          id: Date.now(),
          nome: dados.nome,
          email: dados.email,
          data_nascimento: dados.dataNascimento,
          genero: dados.genero || 'masculino',
        };
        setUser(newUser);
        setToken('mock-jwt-token');
        return { success: true };
      }
      return { success: false, error: 'Falha no cadastro' };
    } catch (error) {
      return { success: false, error: error.message || 'Erro ao realizar cadastro' };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  async function adicionarAvaliacao(novaAvaliacao) {
    setLoading(true);
    try {
      const calculados = calcularMetabolismo({
        peso: novaAvaliacao.peso_kg,
        altura: novaAvaliacao.altura_cm,
        idade: novaAvaliacao.idade,
        genero: novaAvaliacao.genero,
        nivelAtividade: novaAvaliacao.nivel_atividade,
      });

      const registro = {
        idDados: Date.now(),
        ...novaAvaliacao,
        ...calculados,
        data_registro: new Date().toISOString(),
      };

      await api.salvarDadosCorporais(registro);

      setDadosCorporais((prev) => [registro, ...prev]);
      return { success: true, registro };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  const ultimaAvaliacao = dadosCorporais.length > 0 ? dadosCorporais[0] : null;

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        token,
        loading,
        dadosCorporais,
        ultimaAvaliacao,
        login,
        register,
        logout,
        adicionarAvaliacao,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
