import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function PerfilScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert('Sair da Conta', 'Deseja realmente encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

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
            <Text style={styles.tagText}>Gênero: {user?.genero || 'Masculino'}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Nascimento: {user?.data_nascimento || '15/05/1998'}</Text>
          </View>
        </View>
      </View>

      {/* Seções de Configuração */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>CONFIGURAÇÕES DA CONTA</Text>
      </View>

      <View style={styles.optionsGroup}>
        <Pressable style={styles.optionItem} onPress={() => Alert.alert('Perfil', 'Recurso de alteração de senha em breve.')}>
          <Text style={styles.optionIcon}>🔒</Text>
          <Text style={styles.optionText}>Alterar Senha</Text>
          <Text style={styles.optionArrow}>→</Text>
        </Pressable>

        <View style={styles.optionDivider} />

        <Pressable style={styles.optionItem} onPress={() => Alert.alert('Notificações', 'Lembretes de treino estão ativados.')}>
          <Text style={styles.optionIcon}>🔔</Text>
          <Text style={styles.optionText}>Lembretes de Treino</Text>
          <Text style={styles.optionArrow}>→</Text>
        </Pressable>

        <View style={styles.optionDivider} />

        <Pressable style={styles.optionItem} onPress={() => Alert.alert('Sobre', 'IronFit App v1.0.0 (Sistema de Análise Corpórea).')}>
          <Text style={styles.optionIcon}>ℹ️</Text>
          <Text style={styles.optionText}>Sobre o Sistema IronFit</Text>
          <Text style={styles.optionArrow}>→</Text>
        </Pressable>
      </View>

      {/* Botão de Logout */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>SAIR DA CONTA</Text>
      </Pressable>
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
});
