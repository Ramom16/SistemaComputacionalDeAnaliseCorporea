import React, { useEffect, useRef } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/appNavigator';
import { registrarParaPushNotificationsAsync } from './src/notifications/notificationService';

export const navigationRef = createNavigationContainerRef();

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // 1. Registra permissões e obtém os tokens (Expo e Firebase FCM)
    registrarParaPushNotificationsAsync().then(({ expoPushToken, fcmDeviceToken }) => {
      if (expoPushToken) {
        console.log('Token pronto para uso Expo:', expoPushToken);
      }
      if (fcmDeviceToken) {
        console.log('Token pronto para uso direto no Firebase:', fcmDeviceToken);
      }
    });

    // 2. Ouvinte acionado quando a notificação chega com o app aberto em primeiro plano
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida em primeiro plano:', notification);
    });

    // Função para tratar o clique na notificação (redirecionamento dinâmico)
    function processarAberturaNotificacao(response) {
      const data = response?.notification?.request?.content?.data;
      console.log('Usuário clicou na notificação! Dados:', data);

      if (data?.screen && navigationRef.isReady()) {
        try {
          navigationRef.navigate(data.screen, data.params || {});
        } catch (navErr) {
          console.warn('Erro ao redirecionar para a tela da notificação:', navErr.message);
        }
      }
    }

    // 3. Ouvinte acionado quando o usuário CLICA na notificação com o app em segundo plano
    responseListener.current = Notifications.addNotificationResponseReceivedListener(processarAberturaNotificacao);

    // 4. Tratar caso em que o app foi aberto DIRETAMENTE através do clique na notificação (Cold Start)
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) {
        processarAberturaNotificacao(response);
      }
    });

    // Limpeza adequada das inscrições para evitar memory leak e conexões zumbi
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#080808" />
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

