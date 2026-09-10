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
  Modal,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login, loading, solicitarRecuperacao, reenviarEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [statusErro, setStatusErro] = useState(null);

  // Estados de Modais
  const [modalRecuperacao, setModalRecuperacao] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState('');
  const [loadingRecuperacao, setLoadingRecuperacao] = useState(false);

  const [loadingReenvio, setLoadingReenvio] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos para prosseguir.');
      return;
    }

    setErro('');
    setStatusErro(null);

    const res = await login(email.trim(), senha);

    if (!res.success) {
      setErro(res.error || 'Credenciais inválidas. Tente novamente.');
      setStatusErro(res.status);
    }
  }

  function handleDemoLogin() {
    setEmail('atleta@ironfit.com');
    setSenha('123456');
    setErro('');
    setStatusErro(null);
    login('atleta@ironfit.com', '123456');
  }

  async function handleEnviarRecuperacao() {
    if (!emailRecuperacao.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail para receber o link de recuperação.');
      return;
    }

    setLoadingRecuperacao(true);
    const res = await solicitarRecuperacao(emailRecuperacao.trim());
    setLoadingRecuperacao(false);

    if (res.success) {
      setModalRecuperacao(false);
      setEmailRecuperacao('');
      Alert.alert('E-mail enviado', res.message || 'Verifique sua caixa de entrada.');
    } else {
      Alert.alert('Erro', res.error || 'Não foi possível solicitar a recuperação.');
    }
  }

  async function handleReenviarAtivacao() {
    const alvo = email.trim();
    if (!alvo) {
      Alert.alert('Atenção', 'Digite seu e-mail no campo de login primeiro.');
      return;
    }

    setLoadingReenvio(true);
    const res = await reenviarEmail(alvo);
    setLoadingReenvio(false);

    if (res.success) {
      Alert.alert('Sucesso', res.message || 'Link de ativação reenviado para seu e-mail.');
    } else {
      Alert.alert('Erro', res.error || 'Não foi possível reenviar o link.');
    }
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
                {/* Botão de reenvio caso o e-mail não esteja verificado */}
                {statusErro === 403 && (
                  <Pressable
                    style={styles.reenviarBtn}
                    onPress={handleReenviarAtivacao}
                    disabled={loadingReenvio}
                  >
                    {loadingReenvio ? (
                      <ActivityIndicator size="small" color="#FFD400" />
                    ) : (
                      <Text style={styles.reenviarBtnText}>📧 Reenviar e-mail de ativação</Text>
                    )}
                  </Pressable>
                )}
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
              onPress={() => {
                setEmailRecuperacao(email.trim());
                setModalRecuperacao(true);
              }}
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

      {/* Modal de Recuperação de Senha */}
      <Modal
        visible={modalRecuperacao}
        transparent
        animationType="fade"
        onRequestClose={() => setModalRecuperacao(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>RECUPERAR SENHA</Text>
            <Text style={styles.modalSub}>
              Digite seu e-mail cadastrado. Enviaremos um link para você redefinir sua senha.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="seu.email@exemplo.com"
              placeholderTextColor="#666666"
              value={emailRecuperacao}
              onChangeText={setEmailRecuperacao}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setModalRecuperacao(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.modalSubmitBtn}
                onPress={handleEnviarRecuperacao}
                disabled={loadingRecuperacao}
              >
                {loadingRecuperacao ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.modalSubmitText}>Enviar Link</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  reenviarBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 212, 0, 0.15)',
    borderWidth: 1,
    borderColor: '#FFD400',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reenviarBtnText: {
    color: '#FFD400',
    fontSize: 12,
    fontWeight: '800',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    color: '#FFD400',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  modalSub: {
    color: '#AAAAAA',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '700',
  },
  modalSubmitBtn: {
    backgroundColor: '#FFD400',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalSubmitText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900',
  },
});