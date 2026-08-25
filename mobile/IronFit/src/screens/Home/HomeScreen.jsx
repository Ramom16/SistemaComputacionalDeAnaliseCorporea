import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, ultimaAvaliacao } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header com Boas-Vindas */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>BEM-VINDO,</Text>
          <Text style={styles.userName}>{user?.nome || 'Atleta'}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ATIVO</Text>
        </View>
      </View>

      {/* Card de Destaque Metabólico */}
      <View style={styles.heroCard}>
        <View style={styles.heroCardHeader}>
          <Text style={styles.heroTag}>ÚLTIMA AVALIAÇÃO CORPORAL</Text>
          <Text style={styles.heroDate}>
            {ultimaAvaliacao ? new Date(ultimaAvaliacao.data_registro).toLocaleDateString('pt-BR') : 'Hoje'}
          </Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>IMC</Text>
            <Text style={styles.metricValue}>{ultimaAvaliacao?.imc || '--'}</Text>
            <Text style={styles.metricSub}>{ultimaAvaliacao?.classificacaoImc || 'Não registrado'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>TMB</Text>
            <Text style={styles.metricValue}>{ultimaAvaliacao?.tmb || '--'}</Text>
            <Text style={styles.metricSub}>kcal/dia (Basal)</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>NDC</Text>
            <Text style={styles.metricValue}>{ultimaAvaliacao?.ndc || '--'}</Text>
            <Text style={styles.metricSub}>kcal/dia (Meta)</Text>
          </View>
        </View>
      </View>

      {/* Seção de Treino Atual */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>FICHA DE TREINO RECOMENDADA</Text>
      </View>

      <View style={styles.workoutCard}>
        <View style={styles.workoutTop}>
          <Text style={styles.workoutBadge}>TREINO A</Text>
          <Text style={styles.workoutGoal}>Foco: Hipertrofia</Text>
        </View>

        <Text style={styles.workoutTitle}>Peito & Tríceps</Text>
        <Text style={styles.workoutDesc}>5 exercícios • Duração estimada: 50 min</Text>

        <Pressable
          style={styles.workoutButton}
          onPress={() => navigation.navigate('TreinosTab')}
        >
          <Text style={styles.workoutButtonText}>ABRIR TREINO COMPLETO →</Text>
        </Pressable>
      </View>

      {/* Ações Rápidas */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>AÇÕES RÁPIDAS</Text>
      </View>

      <View style={styles.quickGrid}>
        <Pressable
          style={styles.quickCard}
          onPress={() => navigation.navigate('AvaliacaoTab')}
        >
          <Text style={styles.quickIcon}>🧮</Text>
          <Text style={styles.quickTitle}>Nova Avaliação</Text>
          <Text style={styles.quickSub}>Calcule seu IMC/TMB</Text>
        </Pressable>

        <Pressable
          style={styles.quickCard}
          onPress={() => navigation.navigate('EvolucaoTab')}
        >
          <Text style={styles.quickIcon}>📈</Text>
          <Text style={styles.quickTitle}>Ver Evolução</Text>
          <Text style={styles.quickSub}>Histórico e métricas</Text>
        </Pressable>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    color: '#FFD400',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(255, 212, 0, 0.15)',
    borderWidth: 1,
    borderColor: '#FFD400',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFD400',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 14,
    padding: 20,
    marginBottom: 28,
  },
  heroCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroTag: {
    color: '#FFD400',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroDate: {
    color: '#666666',
    fontSize: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    color: '#A5A5A5',
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginVertical: 4,
  },
  metricSub: {
    color: '#888888',
    fontSize: 10,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#262626',
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
  workoutCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 14,
    padding: 20,
    marginBottom: 28,
  },
  workoutTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutBadge: {
    backgroundColor: '#FFD400',
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  workoutGoal: {
    color: '#A5A5A5',
    fontSize: 13,
    fontWeight: '600',
  },
  workoutTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  workoutDesc: {
    color: '#888888',
    fontSize: 13,
    marginBottom: 18,
  },
  workoutButton: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#FFD400',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  workoutButtonText: {
    color: '#FFD400',
    fontSize: 13,
    fontWeight: '800',
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 14,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    padding: 16,
  },
  quickIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  quickTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  quickSub: {
    color: '#888888',
    fontSize: 12,
  },
});
