import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { api } from '../../services/api';

export default function TreinosScreen() {
  const [treinos, setTreinos] = useState([]);
  const [treinoAtivoIndex, setTreinoAtivoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarTreinos() {
      try {
        const data = await api.getTreinos();
        setTreinos(data || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    carregarTreinos();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFD400" />
        <Text style={styles.loadingText}>Carregando fichas de treino...</Text>
      </View>
    );
  }

  const treinoAtual = treinos[treinoAtivoIndex] || treinos[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>FICHA DE TREINOS</Text>
      <Text style={styles.subtitle}>
        Selecione uma divisão para visualizar a lista completa de exercícios e prescrições.
      </Text>

      {/* Tabs de Divisão (Treino A, B, C) */}
      <View style={styles.tabRow}>
        {treinos.map((t, idx) => (
          <Pressable
            key={t.idTreino || idx}
            style={[styles.tabItem, idx === treinoAtivoIndex && styles.tabItemActive]}
            onPress={() => setTreinoAtivoIndex(idx)}
          >
            <Text style={[styles.tabItemText, idx === treinoAtivoIndex && styles.tabItemTextActive]}>
              {`TREINO ${String.fromCharCode(65 + idx)}`}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Header do Treino Selecionado */}
      {treinoAtual && (
        <View style={styles.workoutHeader}>
          <View style={styles.workoutHeaderTop}>
            <Text style={styles.workoutName}>{treinoAtual.nome}</Text>
            <View style={styles.nivelBadge}>
              <Text style={styles.nivelBadgeText}>{treinoAtual.nivel}</Text>
            </View>
          </View>

          <Text style={styles.workoutSub}>
            Objetivo: <Text style={{ color: '#FFD400', fontWeight: '800' }}>{treinoAtual.foco}</Text> • {treinoAtual.exercicios?.length || 0} Exercícios
          </Text>
        </View>
      )}

      {/* Lista de Exercícios */}
      <View style={styles.exerciseList}>
        {treinoAtual?.exercicios?.map((ex, idx) => (
          <View key={ex.idExercicio || idx} style={styles.exerciseCard}>
            <View style={styles.exerciseNumberContainer}>
              <Text style={styles.exerciseNumber}>{String(idx + 1).padStart(2, '0')}</Text>
            </View>

            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseGroup}>{ex.grupo?.toUpperCase()}</Text>
              <Text style={styles.exerciseName}>{ex.nome}</Text>

              <View style={styles.exerciseMetricsRow}>
                <View style={styles.exMetric}>
                  <Text style={styles.exMetricVal}>{ex.series}</Text>
                  <Text style={styles.exMetricLab}>Séries</Text>
                </View>

                <View style={styles.exMetricDot} />

                <View style={styles.exMetric}>
                  <Text style={styles.exMetricVal}>{ex.repeticoes}</Text>
                  <Text style={styles.exMetricLab}>Reps</Text>
                </View>

                <View style={styles.exMetricDot} />

                <View style={styles.exMetric}>
                  <Text style={styles.exMetricVal}>{ex.descanso}</Text>
                  <Text style={styles.exMetricLab}>Descanso</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#A5A5A5',
    marginTop: 12,
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
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  tabItem: {
    flex: 1,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: '#FFD400',
    borderColor: '#FFD400',
  },
  tabItemText: {
    color: '#A5A5A5',
    fontSize: 13,
    fontWeight: '800',
  },
  tabItemTextActive: {
    color: '#000000',
  },
  workoutHeader: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    padding: 18,
    marginBottom: 24,
  },
  workoutHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  workoutName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    flex: 1,
  },
  nivelBadge: {
    backgroundColor: 'rgba(255, 212, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  nivelBadgeText: {
    color: '#FFD400',
    fontSize: 11,
    fontWeight: '800',
  },
  workoutSub: {
    color: '#A5A5A5',
    fontSize: 13,
  },
  exerciseList: {
    gap: 14,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  exerciseNumberContainer: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  exerciseNumber: {
    color: '#FFD400',
    fontSize: 16,
    fontWeight: '900',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseGroup: {
    color: '#FFD400',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginVertical: 4,
  },
  exerciseMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 10,
  },
  exMetric: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  exMetricVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  exMetricLab: {
    color: '#777777',
    fontSize: 11,
  },
  exMetricDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#444444',
  },
});
