import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  Platform,
} from 'react-native';

import HomeScreen from '../screens/Home/HomeScreen';
import AvaliacaoScreen from '../screens/Avaliacao/AvaliacaoScreen';
import TreinosScreen from '../screens/Treinos/TreinosScreen';
import EvolucaoScreen from '../screens/Evolucao/EvolucaoScreen';
import PerfilScreen from '../screens/Perfil/PerfilScreen';

export default function TabNavigator() {
  const [activeTab, setActiveTab] = useState('Home');

  function renderScreen() {
    switch (activeTab) {
      case 'Home':
        return (
          <HomeScreen
            navigation={{
              navigate: (tabName) => {
                if (tabName === 'AvaliacaoTab') setActiveTab('Avaliacao');
                if (tabName === 'TreinosTab') setActiveTab('Treinos');
                if (tabName === 'EvolucaoTab') setActiveTab('Evolucao');
              },
            }}
          />
        );
      case 'Avaliacao':
        return <AvaliacaoScreen />;
      case 'Treinos':
        return <TreinosScreen />;
      case 'Evolucao':
        return <EvolucaoScreen />;
      case 'Perfil':
        return <PerfilScreen />;
      default:
        return <HomeScreen />;
    }
  }

  const tabs = [
    { key: 'Home', label: 'Início', icon: '🏠' },
    { key: 'Avaliacao', label: 'Calculadora', icon: '🧮' },
    { key: 'Treinos', label: 'Treinos', icon: '🏋️‍♂️' },
    { key: 'Evolucao', label: 'Evolução', icon: '📈' },
    { key: 'Perfil', label: 'Perfil', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {/* Área da Tela Ativa */}
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Barra de Navegação Inferior (Bottom Bar) */}
      <SafeAreaView style={styles.bottomBarSafeArea}>
        <View style={styles.bottomBar}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                  {tab.icon}
                </Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.activeDot} />}
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  screenContainer: {
    flex: 1,
  },
  bottomBarSafeArea: {
    backgroundColor: '#0D0D0D',
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#0D0D0D',
    borderTopWidth: 1,
    borderTopColor: '#222222',
    height: Platform.OS === 'ios' ? 70 : 64,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabItemActive: {},
  tabIcon: {
    fontSize: 18,
    opacity: 0.5,
    marginBottom: 2,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#FFD400',
    fontWeight: '900',
  },
  activeDot: {
    width: 14,
    height: 3,
    backgroundColor: '#FFD400',
    borderRadius: 2,
    marginTop: 4,
  },
});
