import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingPage from '../screens/Landing/LandingPage';
import LoginScreen from '../screens/Login/LoginScreen';
import CadastroScreen from '../screens/Cadastro/CadastroScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen
        name="Landing"
        component={LandingPage}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Cadastro"
        component={CadastroScreen}
      />

    </Stack.Navigator>
  );
}