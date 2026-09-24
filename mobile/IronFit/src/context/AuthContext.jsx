import React, { createContext, useState, useEffect, useContext } from 'react';
import storage from '../utils/storage';
import {
  api,
  setAuthToken,
  calcularMetabolismo,
} from '../services/api';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const AuthContext = createContext({});

const STORAGE_KEY_TOKEN = '@ironfit:token';
const STORAGE_KEY_USER = '@ironfit:user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [dadosCorporais, setDadosCorporais] = useState([]);

  useEffect(() => {
    async function restaurarSessao() {
      try {
        const [tokenArmazenado, usuarioArmazenado] = await Promise.all([
          storage.getItem(STORAGE_KEY_TOKEN),
          storage.getItem(STORAGE_KEY_USER),
        ]);

        if (tokenArmazenado) {
          setToken(tokenArmazenado);
          setAuthToken(tokenArmazenado);

          if (usuarioArmazenado) {
            try {
              const u = JSON.parse(usuarioArmazenado);
              const usuarioFormatado = { ...u, id: String(u.id) };
              setUser(usuarioFormatado);
              carregarDadosCorporais(usuarioFormatado.id);
            } catch {
              // Ignore parse error
            }
          }

          try {
            const meResponse = await api.getMe();
            if (meResponse?.usuario) {
              const u = {
                ...meResponse.usuario,
                id: String(meResponse.usuario.id),
              };
              setUser(u);
              await storage.setItem(STORAGE_KEY_USER, JSON.stringify(u));
              carregarDadosCorporais(u.id);
            }
          } catch (meError) {
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

  async function carregarDadosCorporais(idUsuarioParam) {
    const idUsuario = idUsuarioParam ? String(idUsuarioParam) : (user?.id ? String(user.id) : null);
    if (!idUsuario) return;

    try {
      const response = await api.getDadosCorporais(idUsuario);
      if (!response) return;

      let lista = [];
      if (Array.isArray(response)) {
        lista = response.map((item) => ({
          ...item,
          idDados: String(item.idDados || item.id || generateUUID()),
          idUsuario: String(item.idUsuario || idUsuario),
        }));
      } else if (response.calculos) {
        lista = response.calculos.map((calc) => ({
          idDados: String(calc.idCalculo || calc.idDados || generateUUID()),
          idUsuario,
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
        lista = [{
          ...response.dados,
          idDados: String(response.dados.idDados || generateUUID()),
          idUsuario: String(response.dados.idUsuario || idUsuario),
        }];
      }

      if (lista.length > 0) {
        setDadosCorporais(lista);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados corporais:', err.message);
    }
  }

  async function login(email, senha) {
    setLoading(true);
    try {
      const response = await api.login(email, senha);

      if (response && response.token) {
        const usuario = response.usuario
          ? { ...response.usuario, id: String(response.usuario.id) }
          : {
              id: response.id ? String(response.id) : generateUUID(),
              email,
              nome: email.split('@')[0],
            };

        setToken(response.token);
        setUser(usuario);
        setAuthToken(response.token);

        await storage.setItem(STORAGE_KEY_TOKEN, response.token);
        await storage.setItem(STORAGE_KEY_USER, JSON.stringify(usuario));

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

  async function logout() {
    setUser(null);
    setToken(null);
    setDadosCorporais([]);
    setAuthToken(null);

    try {
      await storage.removeItem(STORAGE_KEY_TOKEN);
      await storage.removeItem(STORAGE_KEY_USER);
    } catch (e) {
      console.warn('Erro ao limpar armazenamento:', e);
    }
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

      const tempIdDados = generateUUID();
      const idUsuario = user?.id ? String(user.id) : null;

      const payload = {
        idUsuario,
        peso_kg: Number(novaAvaliacao.peso_kg),
        altura_cm: Number(novaAvaliacao.altura_cm),
        idade: Number(novaAvaliacao.idade),
        genero: novaAvaliacao.genero,
        nivel_atividade: novaAvaliacao.nivel_atividade,
      };

      try {
        const resp = await api.salvarDadosCorporais(payload);

        if (resp?.dados || resp?.idDados) {
          const dadosResp = resp.dados || resp;
          const itemAtualizado = {
            idDados: String(dadosResp.idDados || tempIdDados),
            idUsuario: String(dadosResp.idUsuario || idUsuario),
            ...dadosResp,
            ...calculados,
            data_registro: new Date().toISOString(),
          };
          setDadosCorporais((prev) => [itemAtualizado, ...prev]);
          return { success: true, registro: itemAtualizado };
        }
      } catch (apiErr) {
        console.warn('Backend indisponível para salvar avaliação, mantendo em memória:', apiErr.message);
      }

      const registroLocal = {
        idDados: tempIdDados,
        idUsuario,
        ...payload,
        ...calculados,
        data_registro: new Date().toISOString(),
      };

      setDadosCorporais((prev) => [registroLocal, ...prev]);
      return { success: true, registro: registroLocal };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  async function alterarSenha(senhaAtual, novaSenha) {
    try {
      const response = await api.alterarSenha(senhaAtual, novaSenha);
      return { success: true, message: response?.msg || 'Senha alterada com sucesso!' };
    } catch (error) {
      return { success: false, error: error.message || 'Erro ao alterar senha.' };
    }
  }

  async function solicitarRecuperacao(email) {
    try {
      const response = await api.solicitarRecuperacaoSenha(email);
      return { success: true, message: response?.msg || 'Instruções enviadas para seu e-mail.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
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