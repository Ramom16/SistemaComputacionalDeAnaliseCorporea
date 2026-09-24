import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LandingPage from '../screens/Landing/LandingPage';
import LoginScreen from '../screens/Login/LoginScreen';
import CadastroScreen from '../screens/Cadastro/CadastroScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { signed, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: '#080808', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFD400" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signed ? (
        // Fluxo Autenticado
        <Stack.Screen name="MainApp" component={TabNavigator} />
      ) : (
        // Fluxo de Visitante / Autenticação
        <>
          <Stack.Screen name="Landing" component={LandingPage} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}