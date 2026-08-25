import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LandingPage from '../screens/Landing/LandingPage';
import LoginScreen from '../screens/Login/LoginScreen';
import CadastroScreen from '../screens/Cadastro/CadastroScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { signed } = useAuth();

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