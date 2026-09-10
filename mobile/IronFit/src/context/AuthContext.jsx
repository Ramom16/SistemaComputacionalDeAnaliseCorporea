import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  api,
  setAuthToken,
  calcularMetabolismo,
} from '../services/api';

const AuthContext = createContext({});

const STORAGE_KEY_TOKEN = '@ironfit:token';
const STORAGE_KEY_USER = '@ironfit:user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [dadosCorporais, setDadosCorporais] = useState([]);

  // Restaura a sessão do AsyncStorage ao inicializar o app
  useEffect(() => {
    async function restaurarSessao() {
      try {
        const [tokenArmazenado, usuarioArmazenado] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_TOKEN),
          AsyncStorage.getItem(STORAGE_KEY_USER),
        ]);

        if (tokenArmazenado) {
          setToken(tokenArmazenado);
          setAuthToken(tokenArmazenado);

          if (usuarioArmazenado) {
            try {
              const u = JSON.parse(usuarioArmazenado);
              setUser(u);
              // Busca os dados corporais do usuário silenciosamente
              carregarDadosCorporais(u.id);
            } catch {
              // Ignore parse error
            }
          }

          // Valida o token com o backend para garantir que não expirou
          try {
            const meResponse = await api.getMe();
            if (meResponse?.usuario) {
              setUser(meResponse.usuario);
              await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(meResponse.usuario));
              carregarDadosCorporais(meResponse.usuario.id);
            }
          } catch (meError) {
            // Se o token estiver expirado (401/403), remove do armazenamento
            if (meError.status === 401 || meError.status === 403) {
              console.log('Sessão expirada, deslogando usuário...');
              await logout();
            }
          }
        }
      } catch (err) {
        console.warn('Erro ao restaurar sessão local:', err);
      } finally {
        setInitializing(false);
      }
    }

    restaurarSessao();
  }, []);

  // Busca dados corporais do banco de dados
  async function carregarDadosCorporais(usuarioId) {
    const id = usuarioId || user?.id;
    if (!id) return;

    try {
      const response = await api.getDadosCorporais(id);
      if (!response) return;

      // O backend pode retornar um array ou um objeto { calculos: [...] }
      let lista = [];
      if (Array.isArray(response)) {
        lista = response;
      } else if (response.calculos) {
        lista = response.calculos.map((calc, idx) => ({
          idDados: calc.idCalculo || idx + 1,
          peso_kg: response.peso_kg,
          altura_cm: response.altura_cm,
          genero: response.genero,
          idade: response.idade,
          nivel_atividade: response.nivel_atividade,
          imc: calc.imc,
          tmb: calc.tmb,
          ndc: calc.ndc,
          classificacaoImc: calc.classificacao_imc || '',
          data_registro: calc.data_calculo || new Date().toISOString(),
        }));
      } else if (response.dados) {
        lista = [response.dados];
      }

      if (lista.length > 0) {
        setDadosCorporais(lista);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados corporais:', err.message);
    }
  }

  // 1. Login
  async function login(email, senha) {
    setLoading(true);
    try {
      const response = await api.login(email, senha);

      if (response && response.token) {
        const usuario = response.usuario || {
          id: response.id || 'usr-1',
          email,
          nome: email.split('@')[0],
        };

        setToken(response.token);
        setUser(usuario);
        setAuthToken(response.token);

        await AsyncStorage.setItem(STORAGE_KEY_TOKEN, response.token);
        await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(usuario));

        // Carrega dados corporais do usuário
        carregarDadosCorporais(usuario.id);

        return { success: true };
      }

      return { success: false, error: 'Credenciais inválidas' };
    } catch (error) {
      const msg = error.message || 'Falha ao conectar com o servidor.';
      return {
        success: false,
        error: msg,
        status: error.status,
      };
    } finally {
      setLoading(false);
    }
  }

  // 2. Cadastro
  async function register(dados) {
    setLoading(true);
    try {
      const response = await api.register(dados);
      return {
        success: true,
        message: response?.msg || 'Conta criada com sucesso! Verifique seu e-mail para ativar a conta.',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao realizar cadastro.',
      };
    } finally {
      setLoading(false);
    }
  }

  // 3. Logout
  async function logout() {
    setUser(null);
    setToken(null);
    setDadosCorporais([]);
    setAuthToken(null);

    try {
      await AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.warn('Erro ao limpar armazenamento:', e);
    }
  }

  // 4. Salvar Avaliação Corporal
  async function adicionarAvaliacao(novaAvaliacao) {
    setLoading(true);
    try {
      // Cálculo local preliminar
      const calculados = calcularMetabolismo({
        peso: novaAvaliacao.peso_kg,
        altura: novaAvaliacao.altura_cm,
        idade: novaAvaliacao.idade,
        genero: novaAvaliacao.genero,
        nivelAtividade: novaAvaliacao.nivel_atividade,
      });

      const registroLocal = {
        idDados: Date.now(),
        ...novaAvaliacao,
        ...calculados,
        data_registro: new Date().toISOString(),
      };

      try {
        // Envia para o backend
        const resp = await api.salvarDadosCorporais(novaAvaliacao, user?.id);

        // Se o backend retornou os dados completos salvos
        if (resp?.dados) {
          const calculoBackend = resp.dados.calculos?.[0] || resp.dados.calculos || {};
          const itemAtualizado = {
            idDados: resp.dados.idDados || Date.now(),
            ...resp.dados,
            imc: calculoBackend.imc || calculados?.imc,
            tmb: calculoBackend.tmb || calculados?.tmb,
            ndc: calculoBackend.ndc || calculados?.ndc,
            classificacaoImc: calculados?.classificacaoImc,
            data_registro: new Date().toISOString(),
          };
          setDadosCorporais((prev) => [itemAtualizado, ...prev]);
          return { success: true, registro: itemAtualizado };
        }
      } catch (apiErr) {
        console.warn('Backend indisponível para salvar avaliação, mantendo em memória:', apiErr.message);
      }

      // Fallback em memória
      setDadosCorporais((prev) => [registroLocal, ...prev]);
      return { success: true, registro: registroLocal };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  // 5. Alterar Senha
  async function alterarSenha(senhaAtual, novaSenha) {
    try {
      const response = await api.alterarSenha(senhaAtual, novaSenha);
      return { success: true, message: response?.msg || 'Senha alterada com sucesso!' };
    } catch (error) {
      return { success: false, error: error.message || 'Erro ao alterar senha.' };
    }
  }

  // 6. Solicitar Recuperação de Senha
  async function solicitarRecuperacao(email) {
    try {
      const response = await api.solicitarRecuperacaoSenha(email);
      return { success: true, message: response?.msg || 'Instruções enviadas para seu e-mail.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 7. Reenviar Link de Verificação
  async function reenviarEmail(email) {
    try {
      const response = await api.reenviarEmailVerificacao(email);
      return { success: true, message: response?.msg || 'Novo link enviado para seu e-mail.' };
    } catch (error) {
      return { success: false, error: error.message };
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
        initializing,
        dadosCorporais,
        ultimaAvaliacao,
        login,
        register,
        logout,
        updateUser,
        adicionarAvaliacao,
        carregarDadosCorporais,
        alterarSenha,
        solicitarRecuperacao,
        reenviarEmail,
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