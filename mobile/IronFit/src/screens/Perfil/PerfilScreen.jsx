import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function PerfilScreen() {
  const { user, logout, alterarSenha } = useAuth();

  const [modalSenha, setModalSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loadingSenha, setLoadingSenha] = useState(false);

  function handleLogout() {
    Alert.alert('Sair da Conta', 'Deseja realmente encerrar sua sessão no IronFit?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  async function handleSalvarNovaSenha() {
    if (!senhaAtual.trim() || !novaSenha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos de senha.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert('Atenção', 'A nova senha e a confirmação não coincidem.');
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert('Atenção', 'A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoadingSenha(true);
    const res = await alterarSenha(senhaAtual, novaSenha);
    setLoadingSenha(false);

    if (res.success) {
      setModalSenha(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      Alert.alert('Sucesso!', res.message || 'Senha alterada com sucesso.');
    } else {
      Alert.alert('Erro', res.error || 'Não foi possível alterar a senha.');
    }
  }

  const dataNascimentoExibida = user?.data_nascimento
    ? (user.data_nascimento.includes('T') ? new Date(user.data_nascimento).toLocaleDateString('pt-BR') : user.data_nascimento)
    : 'Não informada';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>PERFIL DO ATLETA</Text>
      <Text style={styles.subtitle}>
        Gerencie suas informações pessoais e configurações da sua conta IronFit.
      </Text>

      {/* Card de Identificação */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.nome ? user.nome.charAt(0).toUpperCase() : 'A'}
          </Text>
        </View>

        <Text style={styles.userName}>{user?.nome || 'Atleta IronFit'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'atleta@ironfit.com'}</Text>

        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>
              Gênero: {user?.genero ? user.genero.toUpperCase() : 'NÃO INFORMADO'}
            </Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Nasc: {dataNascimentoExibida}</Text>
          </View>
        </View>
      </View>

      {/* Seções de Configuração */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>CONFIGURAÇÕES DA CONTA</Text>
      </View>

      <View style={styles.optionsGroup}>
        <Pressable style={styles.optionItem} onPress={() => setModalSenha(true)}>
          <Text style={styles.optionIcon}>🔒</Text>
          <Text style={styles.optionText}>Alterar Senha</Text>
          <Text style={styles.optionArrow}>→</Text>
        </Pressable>

        <View style={styles.optionDivider} />

        <Pressable
          style={styles.optionItem}
          onPress={() => Alert.alert('Notificações', 'Lembretes de treino diários estão ativados no aplicativo.')}
        >
          <Text style={styles.optionIcon}>🔔</Text>
          <Text style={styles.optionText}>Lembretes de Treino</Text>
          <Text style={styles.optionArrow}>→</Text>
        </Pressable>

        <View style={styles.optionDivider} />

        <Pressable
          style={styles.optionItem}
          onPress={() => Alert.alert('Sobre o Sistema', 'IronFit Mobile v1.0.0\nSistema Computacional de Análise Corpórea Integrado.')}
        >
          <Text style={styles.optionIcon}>ℹ️</Text>
          <Text style={styles.optionText}>Sobre o Sistema IronFit</Text>
          <Text style={styles.optionArrow}>→</Text>
        </Pressable>
      </View>

      {/* Botão de Logout */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>SAIR DA CONTA</Text>
      </Pressable>

      {/* Modal de Alteração de Senha */}
      <Modal
        visible={modalSenha}
        transparent
        animationType="fade"
        onRequestClose={() => setModalSenha(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>ALTERAR SENHA</Text>
            <Text style={styles.modalSub}>
              Digite sua senha atual e escolha uma nova senha segura com no mínimo 6 caracteres.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SENHA ATUAL</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="••••••••"
                placeholderTextColor="#666666"
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NOVA SENHA</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#666666"
                value={novaSenha}
                onChangeText={setNovaSenha}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CONFIRMAR NOVA SENHA</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Repita a nova senha"
                placeholderTextColor="#666666"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancelBtn}
                onPress={() => setModalSenha(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={styles.modalSubmitBtn}
                onPress={handleSalvarNovaSenha}
                disabled={loadingSenha}
              >
                {loadingSenha ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <Text style={styles.modalSubmitText}>Salvar Senha</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    color: '#A5A5A5',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFD400',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: '#000000',
    fontSize: 32,
    fontWeight: '900',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  userEmail: {
    color: '#A5A5A5',
    fontSize: 14,
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#1C1C1C',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  optionsGroup: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    marginBottom: 30,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  optionArrow: {
    color: '#666666',
    fontSize: 16,
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#202020',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#FF4444',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.08)',
  },
  logoutButtonText: {
    color: '#FF4444',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
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
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: '#FFD400',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 14,
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
