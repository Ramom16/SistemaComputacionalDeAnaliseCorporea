import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos para prosseguir.');
      return;
    }

    if (!emailRegex.test(email)) {
      setErro('Digite um e-mail válido.');
      return;
    }

    if (senha.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    setErro('');
    const res = await login(email.trim(), senha);

    if (res.success) {
      // Login realizado com sucesso. A navegação será atualizada via AuthContext
    } else {
      setErro(res.error || 'Credenciais inválidas. Tente novamente.');
    }
  }

  function handleDemoLogin() {
    setEmail('atleta@ironfit.com');
    setSenha('123456');
    setErro('');
    login('atleta@ironfit.com', '123456');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← Voltar</Text>
            </Pressable>
            
            <Text style={styles.logo}>
              IRON<Text style={styles.logoYellow}>FIT</Text>
            </Text>
          </View>

          {/* Conteúdo do Form */}
          <View style={styles.content}>
            <Text style={styles.title}>BEM-VINDO DE VOLTA</Text>
            <Text style={styles.subtitle}>
              Acesse sua conta para visualizar seus dados e treinos.
            </Text>

            {erro ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{erro}</Text>
              </View>
            ) : null}

            {/* Input Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-MAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor="#666666"
                value={email}
                onChangeText={(txt) => { setEmail(txt); setErro(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Input Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>SENHA</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#666666"
                  value={senha}
                  onChangeText={(txt) => { setSenha(txt); setErro(''); }}
                  secureTextEntry={!mostrarSenha}
                />
                <Pressable
                  style={styles.togglePassword}
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                >
                  <Text style={styles.togglePasswordText}>
                    {mostrarSenha ? 'Ocultar' : 'Ver'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Esqueceu a Senha */}
            <Pressable
              style={styles.forgotButton}
              onPress={() => Alert.alert('Recuperação de Senha', 'Instruções enviadas para seu e-mail registrado.')}
            >
              <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
            </Pressable>

            {/* Botão Entrar */}
            <Pressable
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.primaryButtonText}>ENTRAR NA CONTA</Text>
              )}
            </Pressable>

            {/* Botão Demo / Acesso Rápido */}
            <Pressable style={styles.demoButton} onPress={handleDemoLogin}>
              <Text style={styles.demoButtonText}>⚡ Acesso Rápido (Modo Demo)</Text>
            </Pressable>
          </View>

          {/* Rodapé / Link para Cadastro */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda não possui uma conta? </Text>
            <Pressable onPress={() => navigation.navigate('Cadastro')}>
              <Text style={styles.signupText}>Cadastre-se</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#080808',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 50,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 15,
  },
  backButtonText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
  },
  logo: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logoYellow: {
    color: '#FFD400',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: '#A5A5A5',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF6666',
    fontSize: 14,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#FFD400',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  togglePassword: {
    position: 'absolute',
    right: 15,
    padding: 8,
  },
  togglePasswordText: {
    color: '#FFD400',
    fontSize: 13,
    fontWeight: '700',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 28,
  },
  forgotText: {
    color: '#A5A5A5',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  primaryButton: {
    backgroundColor: '#FFD400',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  demoButton: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
  },
  demoButtonText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#A5A5A5',
    fontSize: 14,
  },
  signupText: {
    color: '#FFD400',
    fontSize: 14,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});