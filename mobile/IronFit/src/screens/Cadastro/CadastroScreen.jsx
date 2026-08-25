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
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function CadastroScreen({ navigation }) {
  const { register, loading } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [genero, setGenero] = useState('masculino');
  const [erro, setErro] = useState('');

  async function handleCadastro() {
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas digitadas não coincidem.');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setErro('');
    const res = await register({
      nome: nome.trim(),
      email: email.trim(),
      senha,
      dataNascimento,
      genero,
    });

    if (res.success) {
      // Cadastro efetuado com sucesso!
    } else {
      setErro(res.error || 'Erro ao realizar o cadastro. Tente novamente.');
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

          {/* Form */}
          <View style={styles.content}>
            <Text style={styles.title}>CRIE SUA CONTA</Text>
            <Text style={styles.subtitle}>
              Preencha os dados abaixo para iniciar seu acompanhamento corporamento.
            </Text>

            {erro ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{erro}</Text>
              </View>
            ) : null}

            {/* Nome Completo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NOME COMPLETO *</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                placeholderTextColor="#666666"
                value={nome}
                onChangeText={(txt) => { setNome(txt); setErro(''); }}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-MAIL *</Text>
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

            {/* Data de Nascimento */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DATA DE NASCIMENTO (DD/MM/AAAA)</Text>
              <TextInput
                style={styles.input}
                placeholder="15/05/1998"
                placeholderTextColor="#666666"
                value={dataNascimento}
                onChangeText={setDataNascimento}
                keyboardType="numeric"
              />
            </View>

            {/* Gênero */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>GÊNERO</Text>
              <View style={styles.genderContainer}>
                <Pressable
                  style={[styles.genderOption, genero === 'masculino' && styles.genderActive]}
                  onPress={() => setGenero('masculino')}
                >
                  <Text style={[styles.genderText, genero === 'masculino' && styles.genderActiveText]}>
                    Masculino
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.genderOption, genero === 'feminino' && styles.genderActive]}
                  onPress={() => setGenero('feminino')}
                >
                  <Text style={[styles.genderText, genero === 'feminino' && styles.genderActiveText]}>
                    Feminino
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>SENHA *</Text>
              <TextInput
                style={styles.input}
                placeholder="•••••••• (mínimo 6 caracteres)"
                placeholderTextColor="#666666"
                value={senha}
                onChangeText={(txt) => { setSenha(txt); setErro(''); }}
                secureTextEntry
              />
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRMAR SENHA *</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#666666"
                value={confirmarSenha}
                onChangeText={(txt) => { setConfirmarSenha(txt); setErro(''); }}
                secureTextEntry
              />
            </View>

            {/* Botão Finalizar */}
            <Pressable
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={handleCadastro}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.primaryButtonText}>CRIAR MINHA CONTA</Text>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Já possui uma conta? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>Fazer Login</Text>
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
    marginBottom: 30,
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
    marginBottom: 24,
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
    marginBottom: 18,
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
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  genderActive: {
    borderColor: '#FFD400',
    backgroundColor: 'rgba(255, 212, 0, 0.1)',
  },
  genderText: {
    color: '#A5A5A5',
    fontSize: 14,
    fontWeight: '700',
  },
  genderActiveText: {
    color: '#FFD400',
  },
  primaryButton: {
    backgroundColor: '#FFD400',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#A5A5A5',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#FFD400',
    fontSize: 14,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});