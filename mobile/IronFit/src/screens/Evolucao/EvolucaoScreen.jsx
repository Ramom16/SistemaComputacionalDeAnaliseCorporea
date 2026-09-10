import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../services/api';

export default function EvolucaoScreen() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    try {
      setLoading(true);
      // Chamada real ao endpoint da API/Banco de Dados
      const data = await api.get('/evolucao'); 
      setRegistros(data || []);
    } catch (error) {
      console.log('Erro ao carregar histórico:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico de avaliações.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#FFD400" />
          <Text style={styles.loadingText}>Carregando histórico corporal...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>EVOLUÇÃO E HISTÓRICO</Text>
        <Text style={styles.subtitle}>
          Acompanhe sua trajetória física e histórico de avaliações corporais salvas.
        </Text>

        {/* Resumo de Progresso */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>RESUMO GERAL</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryStat}>
              <Text style={styles.statLabel}>AVALIAÇÕES</Text>
              <Text style={styles.statVal}>{registros.length}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.summaryStat}>
              <Text style={styles.statLabel}>PESO ATUAL</Text>
              <Text style={styles.statVal}>{registros[0]?.peso_kg || '--'} kg</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.summaryStat}>
              <Text style={styles.statLabel}>ÚLTIMO IMC</Text>
              <Text style={styles.statVal}>{registros[0]?.imc || '--'}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>HISTÓRICO REGISTRADO</Text>

        {registros.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Nenhuma avaliação registrada até o momento.</Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {registros.map((item, idx) => (
              <View key={item.idDados || idx} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>
                      📅 {new Date(item.data_registro).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text style={styles.badgeIndex}>#{registros.length - idx}</Text>
                </View>

                <View style={styles.historyMetrics}>
                  <View style={styles.hMetric}>
                    <Text style={styles.hLabel}>Peso</Text>
                    <Text style={styles.hVal}>{item.peso_kg} kg</Text>
                  </View>

                  <View style={styles.hMetric}>
                    <Text style={styles.hLabel}>Altura</Text>
                    <Text style={styles.hVal}>{item.altura_cm} cm</Text>
                  </View>

                  <View style={styles.hMetric}>
                    <Text style={styles.hLabel}>IMC</Text>
                    <Text style={styles.hVal}>{item.imc}</Text>
                  </View>

                  <View style={styles.hMetric}>
                    <Text style={styles.hLabel}>TMB</Text>
                    <Text style={styles.hVal}>{item.tmb} kcal</Text>
                  </View>

                  <View style={styles.hMetric}>
                    <Text style={styles.hLabel}>NDC</Text>
                    <Text style={styles.hVal}>{item.ndc} kcal</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#080808',
  },
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  statCardValue: {
    color: '#FFD400',
    fontSize: 20,
    fontWeight: '900',
  },
  statCardLabel: {
    color: '#888888',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    color: '#FFD400',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '700',
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: '#262626',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  emptyCard: {
    backgroundColor: '#121212',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#777777',
    fontSize: 14,
  },
  historyList: {
    gap: 14,
  },
  historyCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dateBadge: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateText: {
    color: '#FFD400',
    fontSize: 12,
    fontWeight: '700',
  },
  badgeIndex: {
    color: '#555555',
    fontSize: 14,
    fontWeight: '900',
  },
  historyMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  hMetric: {
    backgroundColor: '#161616',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: '28%',
    flexGrow: 1,
  },
  hLabel: {
    color: '#777777',
    fontSize: 10,
    fontWeight: '700',
  },
  hVal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
});