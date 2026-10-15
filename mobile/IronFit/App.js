import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/appNavigator';
import { registrarParaPushNotificationsAsync } from './src/notifications/notificationService';

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

    // 2. Ouvinte acionado quando a notificação chega com o app aberto
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida em primeiro plano:', notification);
    });

    // 3. Ouvinte acionado quando o usuário CLICA na notificação
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('Usuário clicou na notificação! Dados:', data);
      
      // Exemplo de redirecionamento:
      // if (data?.screen) { navigationRef.navigate(data.screen); }
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#080808" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
