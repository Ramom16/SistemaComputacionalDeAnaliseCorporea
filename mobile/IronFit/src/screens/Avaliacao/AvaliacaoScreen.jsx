import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { calcularMetabolismo } from '../../services/api';

export default function AvaliacaoScreen({ navigation }) {
  const { user, adicionarAvaliacao, loading } = useAuth();

  const [peso, setPeso] = useState('78.5');
  const [altura, setAltura] = useState('175');
  const [idade, setIdade] = useState('28');
  const [genero, setGenero] = useState('masculino');
  const [nivelAtividade, setNivelAtividade] = useState('moderado');
  const [sucesso, setSucesso] = useState(false);

  // Cálculo em tempo real para pré-visualização
  const resultado = calcularMetabolismo({
    peso,
    altura,
    idade,
    genero,
    nivelAtividade,
  });

  async function handleSalvar() {
    if (!peso || !altura || !idade) {
      Alert.alert('Atenção', 'Preencha peso, altura e idade para calcular e salvar.');
      return;
    }

    const res = await adicionarAvaliacao({
      peso_kg: parseFloat(peso),
      altura_cm: parseFloat(altura),
      idade: parseInt(idade, 10),
      genero,
      nivel_atividade: nivelAtividade,
    });

    if (res.success) {
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
      Alert.alert('Sucesso!', 'Avaliação corporal salva no seu histórico com sucesso.');
    } else {
      Alert.alert('Erro', res.error || 'Não foi possível salvar a avaliação.');
    }
  }

  const niveis = [
    { key: 'sedentario', label: 'Sedentário', sub: 'Pouco ou nenhum exercício' },
    { key: 'leve', label: 'Levemente Ativo', sub: 'Exercício leve 1-3 dias/semana' },
    { key: 'moderado', label: 'Moderadamente Ativo', sub: 'Exercício moderado 3-5 dias/semana' },
    { key: 'intenso', label: 'Altamente Ativo', sub: 'Exercício pesado 6-7 dias/semana' },
    { key: 'muito_intenso', label: 'Extremamente Ativo', sub: 'Treino de atleta / trabalho físico' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>CALCULADORA METABÓLICA</Text>
      <Text style={styles.subtitle}>
        Informe seus dados corporais para calcular IMC, TMB e NDC instantaneamente.
      </Text>

      {/* Formulário */}
      <View style={styles.formSection}>
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>PESO (KG) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 75.5"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
              value={peso}
              onChangeText={setPeso}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>ALTURA (CM) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 175"
              placeholderTextColor="#666666"
              keyboardType="number-pad"
              value={altura}
              onChangeText={setAltura}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 0.8 }]}>
            <Text style={styles.label}>IDADE *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 25"
              placeholderTextColor="#666666"
              keyboardType="number-pad"
              value={idade}
              onChangeText={setIdade}
            />
          </View>
        </View>

        {/* Seletor Gênero */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>GÊNERO</Text>
          <View style={styles.genderRow}>
            <Pressable
              style={[styles.genderBtn, genero === 'masculino' && styles.genderBtnActive]}
              onPress={() => setGenero('masculino')}
            >
              <Text style={[styles.genderBtnText, genero === 'masculino' && styles.genderBtnTextActive]}>
                ♂ Masculino
              </Text>
            </Pressable>

            <Pressable
              style={[styles.genderBtn, genero === 'feminino' && styles.genderBtnActive]}
              onPress={() => setGenero('feminino')}
            >
              <Text style={[styles.genderBtnText, genero === 'feminino' && styles.genderBtnTextActive]}>
                ♀ Feminino
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Nível de Atividade */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>NÍVEL DE ATIVIDADE FÍSICA</Text>
          {niveis.map((item) => (
            <Pressable
              key={item.key}
              style={[styles.levelOption, nivelAtividade === item.key && styles.levelOptionActive]}
              onPress={() => setNivelAtividade(item.key)}
            >
              <View style={styles.levelRadio}>
                {nivelAtividade === item.key && <View style={styles.levelRadioInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.levelTitle, nivelAtividade === item.key && styles.levelTitleActive]}>
                  {item.label}
                </Text>
                <Text style={styles.levelSub}>{item.sub}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Card de Pré-visualização do Resultado */}
      {resultado && (
        <View style={styles.resultCard}>
          <Text style={styles.resultCardTitle}>RESULTADO CALCULADO</Text>

          <View style={styles.resultGrid}>
            <View style={styles.resultBox}>
              <Text style={styles.resultBoxLabel}>IMC (Índice Corporamente)</Text>
              <Text style={styles.resultBoxValue}>{resultado.imc}</Text>
              <View style={styles.badgeClassificacao}>
                <Text style={styles.badgeClassificacaoText}>{resultado.classificacaoImc}</Text>
              </View>
            </View>

            <View style={styles.resultBox}>
              <Text style={styles.resultBoxLabel}>TMB (Taxa Metabólica Basal)</Text>
              <Text style={styles.resultBoxValue}>{resultado.tmb} <Text style={styles.unit}>kcal</Text></Text>
              <Text style={styles.resultBoxSub}>Energia em repouso absoluto</Text>
            </View>

            <View style={styles.resultBox}>
              <Text style={styles.resultBoxLabel}>NDC (Gasto Diário Total)</Text>
              <Text style={styles.resultBoxValue}>{resultado.ndc} <Text style={styles.unit}>kcal</Text></Text>
              <Text style={styles.resultBoxSub}>Calorias p/ manter peso</Text>
            </View>
          </View>
        </View>
      )}

      {/* Botão Salvar */}
      <Pressable
        style={[styles.saveButton, loading && { opacity: 0.7 }]}
        onPress={handleSalvar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000000" />
        ) : (
          <Text style={styles.saveButtonText}>SALVAR AVALIAÇÃO NO HISTÓRICO</Text>
        )}
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
  formSection: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#FFD400',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  genderBtnActive: {
    borderColor: '#FFD400',
    backgroundColor: 'rgba(255, 212, 0, 0.1)',
  },
  genderBtnText: {
    color: '#A5A5A5',
    fontSize: 14,
    fontWeight: '700',
  },
  genderBtnTextActive: {
    color: '#FFD400',
  },
  levelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  levelOptionActive: {
    borderColor: '#FFD400',
    backgroundColor: 'rgba(255, 212, 0, 0.05)',
  },
  levelRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#555555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelRadioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FFD400',
  },
  levelTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  levelTitleActive: {
    color: '#FFD400',
  },
  levelSub: {
    color: '#777777',
    fontSize: 11,
  },
  resultCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#FFD400',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
  },
  resultCardTitle: {
    color: '#FFD400',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  resultGrid: {
    gap: 12,
  },
  resultBox: {
    backgroundColor: '#181818',
    borderRadius: 8,
    padding: 14,
  },
  resultBoxLabel: {
    color: '#A5A5A5',
    fontSize: 12,
    fontWeight: '700',
  },
  resultBoxValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginVertical: 4,
  },
  unit: {
    fontSize: 14,
    color: '#FFD400',
    fontWeight: '700',
  },
  resultBoxSub: {
    color: '#777777',
    fontSize: 11,
  },
  badgeClassificacao: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 212, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  badgeClassificacaoText: {
    color: '#FFD400',
    fontSize: 12,
    fontWeight: '800',
  },
  saveButton: {
    backgroundColor: '#FFD400',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
