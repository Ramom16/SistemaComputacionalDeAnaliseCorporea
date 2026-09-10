import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function EvolucaoScreen() {
  const { user, dadosCorporais } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historicoBanco, setHistoricoBanco] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    cards: {
      totalTreinos: 0,
      totalExercicios: 0,
      tempoTreinado: 0,
      calorias: 0,
    },
    recordes: {
      diasSeguidos: '0 dias',
      maiorPerdaPeso: '0 kg',
      totalHoras: '0 hrs',
      caloriasQueimadas: '0 kcal',
    },
  });

  async function carregarDadosEvolucao() {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const [histData, statsData] = await Promise.all([
        api.getHistorico(user.id),
        api.getEstatisticas(user.id),
      ]);

      if (histData) {
        const peso = histData.peso?.dados || [];
        const imc = histData.imc?.dados || [];
        const tmb = histData.tmb?.dados || [];
        const ndc = histData.ndc?.dados || [];

        const listaMapeada = peso.map((item, index) => ({
          idDados: index + 1,
          data_registro: item.data,
          peso_kg: Number(item.valor || 0),
          imc: Number(Number(imc[index]?.valor || 0).toFixed(1)),
          tmb: Math.round(Number(tmb[index]?.valor || 0)),
          ndc: Math.round(Number(ndc[index]?.valor || 0)),
        }));

        setHistoricoBanco(listaMapeada);
      }

      if (statsData) {
        setEstatisticas({
          cards: statsData.cards || {},
          recordes: statsData.recordes || {},
        });
      }
    } catch (err) {
      console.warn('Erro ao carregar dados de evolução:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    carregarDadosEvolucao();
  }, [user]);

  function onRefresh() {
    setRefreshing(true);
    carregarDadosEvolucao();
  }

  // Se o histórico do banco vier vazio mas existirem registros no contexto local, utiliza o local
  const registros = historicoBanco.length > 0 ? historicoBanco : (dadosCorporais || []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFD400" />
        <Text style={styles.loadingText}>Carregando histórico e evolução...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD400" />}
    >
      <Text style={styles.title}>EVOLUÇÃO E HISTÓRICO</Text>
      <Text style={styles.subtitle}>
        Acompanhe sua trajetória física e histórico de avaliações corporais salvas.
      </Text>

      {/* Cards de Métricas de Treino (vindas de /evolucao/estatisticas) */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{estatisticas.cards.totalTreinos || 0}</Text>
          <Text style={styles.statCardLabel}>Treinos Realizados</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{estatisticas.cards.tempoTreinado || 0}h</Text>
          <Text style={styles.statCardLabel}>Horas de Treino</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{estatisticas.cards.calorias || 0}</Text>
          <Text style={styles.statCardLabel}>Kcal Queimadas</Text>
        </View>
      </View>

      {/* Resumo de Progresso Corporal */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>RESUMO CORPORAL</Text>
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
          {registros.map((item, idx) => {
            const dataFormatada = item.data_registro
              ? (item.data_registro.includes('/') ? item.data_registro : new Date(item.data_registro).toLocaleDateString('pt-BR'))
              : 'Hoje';

            return (
              <View key={item.idDados || idx} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>📅 {dataFormatada}</Text>
                  </View>
                  <Text style={styles.badgeIndex}>#{registros.length - idx}</Text>
                </View>

                <View style={styles.historyMetrics}>
                  <View style={styles.hMetric}>
                    <Text style={styles.hLabel}>Peso</Text>
                    <Text style={styles.hVal}>{item.peso_kg} kg</Text>
                  </View>

                  {item.altura_cm ? (
                    <View style={styles.hMetric}>
                      <Text style={styles.hLabel}>Altura</Text>
                      <Text style={styles.hVal}>{item.altura_cm} cm</Text>
                    </View>
                  ) : null}

                  <View style={styles.hMetric}>
                    <Text style={styles.hLabel}>IMC</Text>
                    <Text style={styles.hVal}>{item.imc || '--'}</Text>
                  </View>

                  <View style={styles.hMetric}>
                    <Text style={styles.hLabel}>TMB</Text>
                    <Text style={styles.hVal}>{item.tmb ? `${item.tmb} kcal` : '--'}</Text>
                  </View>

                  <View style={styles.hMetric}>
                    <Text style={styles.hLabel}>NDC</Text>
                    <Text style={styles.hVal}>{item.ndc ? `${item.ndc} kcal` : '--'}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
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
